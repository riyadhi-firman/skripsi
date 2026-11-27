package pinger

import (
	"context"
	"fmt"
	"math"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type PingResult struct {
	IPAddress  string
	Reachable  bool
	LatencyMs  *float64
	PacketLoss float64
	JitterMs   *float64
	Error      error
}

var (
	// rtt min/avg/max/mdev = 0.038/0.045/0.052/0.007 ms
	rttRegex = regexp.MustCompile(`(?:rtt|round-trip)\s+min/avg/max/(?:mdev|stddev)\s*=\s*([0-9.]+)/([0-9.]+)/([0-9.]+)/([0-9.]+)`)
	// 3 packets transmitted, 3 received, 0% packet loss
	lossRegex = regexp.MustCompile(`([0-9]+)\s+(?:packets\s+)?transmitted,\s*([0-9]+)\s+(?:packets\s+)?received.*?(?:([0-9.]+)%\s+packet\s+loss)`)
)

type Pinger struct {
	Count   int
	Timeout time.Duration
}

func NewPinger(count int, timeout time.Duration) *Pinger {
	if count <= 0 {
		count = 3
	}
	if timeout <= 0 {
		timeout = 2 * time.Second
	}
	return &Pinger{
		Count:   count,
		Timeout: timeout,
	}
}

func (p *Pinger) Ping(ctx context.Context, ip string) *PingResult {
	result := &PingResult{
		IPAddress:  ip,
		PacketLoss: 100.0,
		Reachable:  false,
	}

	timeoutSec := int(math.Ceil(p.Timeout.Seconds()))
	if timeoutSec < 1 {
		timeoutSec = 1
	}

	cmdCtx, cancel := context.WithTimeout(ctx, p.Timeout+time.Duration(p.Count)*time.Second)
	defer cancel()

	// ping -c <count> -W <timeoutSec> <ip>
	cmd := exec.CommandContext(cmdCtx, "ping", "-c", strconv.Itoa(p.Count), "-W", strconv.Itoa(timeoutSec), ip)
	outputBytes, err := cmd.CombinedOutput()
	output := string(outputBytes)

	// Parse packet loss
	lossMatches := lossRegex.FindStringSubmatch(output)
	if len(lossMatches) >= 4 {
		if loss, err := strconv.ParseFloat(lossMatches[3], 64); err == nil {
			result.PacketLoss = loss
		}
	} else if strings.Contains(output, "100% packet loss") || strings.Contains(output, "100.0% packet loss") {
		result.PacketLoss = 100.0
	}

	// Parse RTT latency & jitter
	rttMatches := rttRegex.FindStringSubmatch(output)
	if len(rttMatches) >= 5 {
		if avg, err := strconv.ParseFloat(rttMatches[2], 64); err == nil {
			result.LatencyMs = &avg
		}
		if jitter, err := strconv.ParseFloat(rttMatches[4], 64); err == nil {
			result.JitterMs = &jitter
		}
	}

	if result.PacketLoss < 100.0 && result.LatencyMs != nil {
		result.Reachable = true
	} else if err != nil && result.LatencyMs == nil {
		result.Error = fmt.Errorf("ping failed or host unreachable: %w", err)
	}

	return result
}
