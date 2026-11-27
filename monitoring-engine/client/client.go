package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type Device struct {
	ID                 int     `json:"id"`
	Name               string  `json:"name"`
	Hostname           *string `json:"hostname"`
	IPAddress          string  `json:"ip_address"`
	DeviceType         string  `json:"device_type"`
	SnmpVersion        string  `json:"snmp_version"`
	SnmpCommunity      *string `json:"snmp_community"`
	SnmpPort           int     `json:"snmp_port"`
	SnmpSecurityLevel  *string `json:"snmp_security_level"`
	SnmpAuthProtocol   *string `json:"snmp_auth_protocol"`
	SnmpAuthPassword   *string `json:"snmp_auth_password"`
	SnmpPrivProtocol   *string `json:"snmp_priv_protocol"`
	SnmpPrivPassword   *string `json:"snmp_priv_password"`
	MonitoringInterval int     `json:"monitoring_interval"`
	Timeout            int     `json:"timeout"`
	Retry              int     `json:"retry"`
}

type DeviceResponse struct {
	Success bool     `json:"success"`
	Count   int      `json:"count"`
	Devices []Device `json:"devices"`
}

type MonitoringResult struct {
	DeviceID        int      `json:"device_id"`
	Status          string   `json:"status"`
	Latency         *float64 `json:"latency"`
	PacketLoss      float64  `json:"packet_loss"`
	Jitter          *float64 `json:"jitter,omitempty"`
	CPUUsage        *float64 `json:"cpu_usage,omitempty"`
	MemoryUsage     *float64 `json:"memory_usage,omitempty"`
	Temperature     *float64 `json:"temperature,omitempty"`
	Uptime          *int64   `json:"uptime,omitempty"`
	FirmwareVersion *string  `json:"firmware_version,omitempty"`
	SysDescr        *string  `json:"sys_descr,omitempty"`
	SysObjectID     *string  `json:"sys_object_id,omitempty"`
	CheckedAt       string   `json:"checked_at"`
}

type InterfaceMetric struct {
	IfIndex        int     `json:"if_index"`
	IfName         string  `json:"if_name"`
	IfDescr        string  `json:"if_descr,omitempty"`
	IfType         string  `json:"if_type,omitempty"`
	IfSpeed        uint64  `json:"if_speed"`
	IfPhysAddress  string  `json:"if_phys_address,omitempty"`
	IfAdminStatus  string  `json:"if_admin_status"`
	IfOperStatus   string  `json:"if_oper_status"`
	IfInOctets     uint64  `json:"if_in_octets"`
	IfOutOctets    uint64  `json:"if_out_octets"`
	IfInErrors     uint32  `json:"if_in_errors"`
	IfOutErrors    uint32  `json:"if_out_errors"`
	InOctetsRate   uint64  `json:"in_octets_rate"`
	OutOctetsRate  uint64  `json:"out_octets_rate"`
	InUtilization  float64 `json:"in_utilization"`
	OutUtilization float64 `json:"out_utilization"`
}

type InterfacePayload struct {
	DeviceID   int               `json:"device_id"`
	Interfaces []InterfaceMetric `json:"interfaces"`
}

type ApiClient struct {
	baseURL    string
	token      string
	httpClient *http.Client
}

func NewApiClient(baseURL, token string) *ApiClient {
	return &ApiClient{
		baseURL: baseURL,
		token:   token,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *ApiClient) FetchDevices() ([]Device, error) {
	url := fmt.Sprintf("%s/api/monitoring/devices", c.baseURL)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.token))
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to api: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("api error status %d: %s", resp.StatusCode, string(body))
	}

	var res DeviceResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, fmt.Errorf("failed to decode devices response: %w", err)
	}

	return res.Devices, nil
}

func (c *ApiClient) SendResults(results []MonitoringResult) error {
	if len(results) == 0 {
		return nil
	}

	url := fmt.Sprintf("%s/api/monitoring/results", c.baseURL)
	payload := map[string]interface{}{
		"results": results,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(data))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.token))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send monitoring results: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("api rejected results (status %d): %s", resp.StatusCode, string(body))
	}

	return nil
}

func (c *ApiClient) SendInterfaceMetrics(deviceID int, ifaces []InterfaceMetric) error {
	if len(ifaces) == 0 {
		return nil
	}

	url := fmt.Sprintf("%s/api/monitoring/interface-results", c.baseURL)
	payload := InterfacePayload{
		DeviceID:   deviceID,
		Interfaces: ifaces,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(data))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.token))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send interface results: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("api rejected interface results (status %d): %s", resp.StatusCode, string(body))
	}

	return nil
}
