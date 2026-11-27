package pinger

import (
	"context"
	"testing"
	"time"
)

func TestPingLocalhost(t *testing.T) {
	p := NewPinger(3, 1*time.Second)

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result := p.Ping(ctx, "127.0.0.1")

	if !result.Reachable {
		t.Logf("Ping localhost not reachable: %v", result.Error)
		return
	}

	if result.PacketLoss > 50.0 {
		t.Errorf("expected low packet loss for 127.0.0.1, got %.2f%%", result.PacketLoss)
	}

	if result.LatencyMs == nil {
		t.Errorf("expected latency to be measured")
	}
}

func TestPingInvalidHost(t *testing.T) {
	p := NewPinger(1, 500*time.Millisecond)

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	// RFC 5737 non-routable test address
	result := p.Ping(ctx, "192.0.2.254")

	if result.Reachable {
		t.Errorf("expected 192.0.2.254 to be unreachable, but got reachable")
	}

	if result.PacketLoss < 100.0 {
		t.Errorf("expected 100%% packet loss for unreachable address, got %.2f%%", result.PacketLoss)
	}
}
