package config

import (
	"os"
	"testing"
	"time"
)

func TestLoadConfigDefaults(t *testing.T) {
	os.Unsetenv("API_URL")
	os.Unsetenv("API_TOKEN")
	os.Unsetenv("WORKER_POOL_SIZE")
	os.Unsetenv("POLL_INTERVAL_SEC")

	cfg := LoadConfig()

	if cfg.ApiURL != "http://127.0.0.1:8000" {
		t.Errorf("expected default ApiURL http://127.0.0.1:8000, got %s", cfg.ApiURL)
	}

	if cfg.WorkerPoolSize != 10 {
		t.Errorf("expected default WorkerPoolSize 10, got %d", cfg.WorkerPoolSize)
	}

	if cfg.PollInterval != 30*time.Second {
		t.Errorf("expected default PollInterval 30s, got %v", cfg.PollInterval)
	}
}

func TestLoadConfigCustomEnv(t *testing.T) {
	os.Setenv("API_URL", "http://nms.ubj.ac.id:8000")
	os.Setenv("API_TOKEN", "custom_test_token_123")
	os.Setenv("WORKER_POOL_SIZE", "50")
	os.Setenv("POLL_INTERVAL_SEC", "15")
	defer func() {
		os.Unsetenv("API_URL")
		os.Unsetenv("API_TOKEN")
		os.Unsetenv("WORKER_POOL_SIZE")
		os.Unsetenv("POLL_INTERVAL_SEC")
	}()

	cfg := LoadConfig()

	if cfg.ApiURL != "http://nms.ubj.ac.id:8000" {
		t.Errorf("expected ApiURL http://nms.ubj.ac.id:8000, got %s", cfg.ApiURL)
	}

	if cfg.ApiToken != "custom_test_token_123" {
		t.Errorf("expected ApiToken custom_test_token_123, got %s", cfg.ApiToken)
	}

	if cfg.WorkerPoolSize != 50 {
		t.Errorf("expected WorkerPoolSize 50, got %d", cfg.WorkerPoolSize)
	}

	if cfg.PollInterval != 15*time.Second {
		t.Errorf("expected PollInterval 15s, got %v", cfg.PollInterval)
	}
}
