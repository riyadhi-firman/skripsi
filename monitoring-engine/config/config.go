package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	ApiURL         string
	ApiToken       string
	WorkerPoolSize int
	PollInterval   time.Duration
	PingCount      int
	PingTimeout    time.Duration
	SnmpTimeout    time.Duration
	SnmpRetries    int
}

func LoadConfig() *Config {
	apiURL := getEnv("API_URL", "http://127.0.0.1:8000")
	apiToken := getEnv("API_TOKEN", "ubj_nms_engine_secret_token_2026")
	workerPool := getEnvInt("WORKER_POOL_SIZE", 10)
	pollIntervalSec := getEnvInt("POLL_INTERVAL_SEC", 30)
	pingCount := getEnvInt("PING_COUNT", 3)
	pingTimeoutSec := getEnvInt("PING_TIMEOUT_SEC", 2)
	snmpTimeoutSec := getEnvInt("SNMP_TIMEOUT_SEC", 3)
	snmpRetries := getEnvInt("SNMP_RETRIES", 2)

	return &Config{
		ApiURL:         apiURL,
		ApiToken:       apiToken,
		WorkerPoolSize: workerPool,
		PollInterval:   time.Duration(pollIntervalSec) * time.Second,
		PingCount:      pingCount,
		PingTimeout:    time.Duration(pingTimeoutSec) * time.Second,
		SnmpTimeout:    time.Duration(snmpTimeoutSec) * time.Second,
		SnmpRetries:    snmpRetries,
	}
}

func getEnv(key, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		if intVal, err := strconv.Atoi(val); err == nil {
			return intVal
		}
	}
	return defaultVal
}
