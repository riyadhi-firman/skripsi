package main

import (
	"context"
	"flag"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"ubj-nms-engine/collector"
	"ubj-nms-engine/config"
)

func main() {
	onceFlag := flag.Bool("once", false, "Jalankan satu siklus polling kemudian keluar")
	flag.Parse()

	log.Println("======================================================================")
	log.Println("  UBJ NETPULSE - GOLANG NETWORK MONITORING ENGINE (ICMP & SNMP)")
	log.Println("  Universitas Banten Jaya • Tugas Akhir / Skripsi Teknik Informatika")
	log.Println("======================================================================")

	cfg := config.LoadConfig()
	log.Printf("[Init] API Endpoint: %s", cfg.ApiURL)
	log.Printf("[Init] Worker Pool: %d goroutines", cfg.WorkerPoolSize)
	log.Printf("[Init] Polling Interval: %v", cfg.PollInterval)
	log.Printf("[Init] Ping Settings: %d paket, timeout %v", cfg.PingCount, cfg.PingTimeout)

	engine := collector.NewEngine(cfg)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if *onceFlag {
		log.Println("[Mode] Menjalankan satu siklus polling (--once)...")
		if err := engine.RunOnce(ctx); err != nil {
			log.Fatalf("[Error] Siklus polling gagal: %v", err)
		}
		log.Println("[Selesai] Siklus polling tunggal selesai.")
		return
	}

	// Trap termination signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	ticker := time.NewTicker(cfg.PollInterval)
	defer ticker.Stop()

	// Run initial cycle immediately
	go func() {
		if err := engine.RunOnce(ctx); err != nil {
			log.Printf("[Engine] Warning siklus awal: %v", err)
		}
	}()

	log.Println("[Daemon] Mesin polling monitoring aktif dan berjalan.")

	for {
		select {
		case <-sigChan:
			log.Println("[Shutdown] Sinyal terminate diterima. Menghentikan mesin monitoring...")
			cancel()
			time.Sleep(500 * time.Millisecond)
			log.Println("[Shutdown] Mesin monitoring berhasil dimatikan dengan aman.")
			return
		case <-ticker.C:
			if err := engine.RunOnce(ctx); err != nil {
				log.Printf("[Engine] Kesalahan pada siklus: %v", err)
			}
		}
	}
}
