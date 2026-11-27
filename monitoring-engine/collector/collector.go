package collector

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"ubj-nms-engine/client"
	"ubj-nms-engine/config"
	"ubj-nms-engine/pinger"
	"ubj-nms-engine/snmp"
)

type Engine struct {
	cfg        *config.Config
	apiClient  *client.ApiClient
	pinger     *pinger.Pinger
	snmpPoller *snmp.Poller
}

func NewEngine(cfg *config.Config) *Engine {
	return &Engine{
		cfg:        cfg,
		apiClient:  client.NewApiClient(cfg.ApiURL, cfg.ApiToken),
		pinger:     pinger.NewPinger(cfg.PingCount, cfg.PingTimeout),
		snmpPoller: snmp.NewPoller(cfg.SnmpTimeout, cfg.SnmpRetries),
	}
}

func (e *Engine) RunOnce(ctx context.Context) error {
	log.Printf("[Collector] Memulai siklus polling perangkat dari API: %s...", e.cfg.ApiURL)

	devices, err := e.apiClient.FetchDevices()
	if err != nil {
		return fmt.Errorf("gagal mengambil daftar perangkat: %w", err)
	}

	log.Printf("[Collector] Berhasil mendapatkan %d perangkat aktif.", len(devices))
	if len(devices) == 0 {
		return nil
	}

	// Worker Pool Channel
	deviceChan := make(chan client.Device, len(devices))
	resultChan := make(chan client.MonitoringResult, len(devices))

	var wg sync.WaitGroup
	workers := e.cfg.WorkerPoolSize
	if workers > len(devices) {
		workers = len(devices)
	}
	if workers < 1 {
		workers = 1
	}

	// Launch worker pool
	for w := 1; w <= workers; w++ {
		wg.Add(1)
		go func(workerId int) {
			defer wg.Done()
			for dev := range deviceChan {
				res := e.pollDevice(ctx, dev)
				resultChan <- res
			}
		}(w)
	}

	// Enqueue jobs
	for _, dev := range devices {
		deviceChan <- dev
	}
	close(deviceChan)

	// Wait for workers in separate goroutine
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// Collect all results
	results := make([]client.MonitoringResult, 0, len(devices))
	for res := range resultChan {
		results = append(results, res)
	}

	// Send batch results to Laravel API
	if err := e.apiClient.SendResults(results); err != nil {
		log.Printf("[Collector] ERROR: Gagal mengirimkan hasil monitoring ke API: %v", err)
		return err
	}

	log.Printf("[Collector] Sukses mengirimkan %d hasil monitoring ke sistem Laravel.", len(results))
	return nil
}

func (e *Engine) pollDevice(ctx context.Context, dev client.Device) client.MonitoringResult {
	checkedAt := time.Now().UTC().Format(time.RFC3339)

	// 1. ICMP Ping check
	pingRes := e.pinger.Ping(ctx, dev.IPAddress)

	// Determine status based on ping
	status := "DOWN"
	if pingRes.Reachable {
		status = "UP"
		if pingRes.PacketLoss > 20.0 || (pingRes.LatencyMs != nil && *pingRes.LatencyMs > 200.0) {
			status = "DEGRADED"
		}
	} else {
		// When simulated in test demo environment, if IP is local 10.10.x.x unreachable,
		// allow fall back to UP if reachable or keep DOWN
		status = "DOWN"
	}

	res := client.MonitoringResult{
		DeviceID:   dev.ID,
		Status:     status,
		Latency:    pingRes.LatencyMs,
		PacketLoss: pingRes.PacketLoss,
		Jitter:     pingRes.JitterMs,
		CheckedAt:  checkedAt,
	}

	// 2. SNMP Poll (only if host is reachable or attempt regardless)
	snmpData := e.snmpPoller.Poll(dev)
	if snmpData.Success {
		res.SysDescr = snmpData.SysDescr
		res.SysObjectID = snmpData.SysObjectID
		res.Uptime = snmpData.UptimeSec
		res.CPUUsage = snmpData.CPUUsage
		res.MemoryUsage = snmpData.MemoryUsage

		if len(snmpData.Interfaces) > 0 {
			if err := e.apiClient.SendInterfaceMetrics(dev.ID, snmpData.Interfaces); err != nil {
				log.Printf("[Collector] Gagal mengirim antarmuka untuk Device %s: %v", dev.Name, err)
			}
		}
	}

	log.Printf("[Worker] Device %d [%s] (%s) => %s (Latency: %v ms, Loss: %.1f%%)",
		dev.ID, dev.Name, dev.IPAddress, res.Status,
		formatFloatPtr(res.Latency), res.PacketLoss)

	return res
}

func formatFloatPtr(v *float64) string {
	if v == nil {
		return "N/A"
	}
	return fmt.Sprintf("%.2f", *v)
}
