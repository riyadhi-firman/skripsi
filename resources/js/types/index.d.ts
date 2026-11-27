export type Role = 'admin' | 'operator';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at: string;
    updated_at: string;
}

export type DeviceType = 'Router' | 'Switch' | 'Firewall' | 'Access Point' | 'Server' | 'Other';
export type DeviceStatus = 'UP' | 'DOWN' | 'DEGRADED' | 'UNKNOWN';
export type SnmpVersion = 'v1' | 'v2c' | 'v3';

export interface Device {
    id: number;
    name: string;
    hostname?: string | null;
    ip_address: string;
    device_type: DeviceType;
    vendor?: string | null;
    model?: string | null;
    location?: string | null;
    snmp_version: SnmpVersion;
    snmp_community?: string | null;
    snmp_port: number;
    snmp_security_level?: 'noAuthNoPriv' | 'authNoPriv' | 'authPriv' | null;
    snmp_auth_protocol?: 'MD5' | 'SHA' | 'SHA256' | null;
    snmp_priv_protocol?: 'DES' | 'AES' | null;
    monitoring_interval: number;
    timeout: number;
    retry: number;
    monitoring_enabled: boolean;
    status: DeviceStatus;
    last_seen?: string | null;
    uptime?: number | null;
    cpu_usage?: number | null;
    memory_usage?: number | null;
    temperature?: number | null;
    firmware_version?: string | null;
    sys_descr?: string | null;
    sys_object_id?: string | null;
    pos_x: number;
    pos_y: number;
    created_at: string;
    updated_at: string;
    interfaces_count?: number;
    active_alerts_count?: number;
    interfaces?: NetworkInterface[];
    active_alerts?: Alert[];
    outbound_edges?: TopologyEdge[];
    inbound_edges?: TopologyEdge[];
}

export interface NetworkInterface {
    id: number;
    device_id: number;
    if_index: number;
    if_name: string;
    if_descr?: string | null;
    if_type?: string | null;
    if_speed: number;
    if_phys_address?: string | null;
    if_admin_status: 'UP' | 'DOWN';
    if_oper_status: 'UP' | 'DOWN';
    if_in_octets: number;
    if_out_octets: number;
    if_in_errors: number;
    if_out_errors: number;
    in_utilization: number;
    out_utilization: number;
    last_polled_at?: string | null;
}

export interface TopologyEdge {
    id: number;
    source_device_id: number;
    target_device_id: number;
    source_interface_id?: number | null;
    target_interface_id?: number | null;
    label?: string | null;
    bandwidth?: string | null;
    link_type?: string;
    link_speed?: number;
    speed_mbps?: number;
    source_port?: string;
    target_port?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'UP' | 'DOWN' | string;
    source_device?: Device;
    target_device?: Device;
    source_interface?: NetworkInterface;
    target_interface?: NetworkInterface;
}

export type TopologyLink = TopologyEdge;

export interface MonitoringResult {
    id: number;
    device_id: number;
    status: DeviceStatus;
    latency: number | null;
    packet_loss: number;
    jitter?: number | null;
    cpu_usage?: number | null;
    memory_usage?: number | null;
    uptime?: number | null;
    checked_at: string;
}

export interface InterfaceMetric {
    id: number;
    interface_id: number;
    in_octets_rate: number;
    out_octets_rate: number;
    in_utilization: number;
    out_utilization: number;
    in_errors: number;
    out_errors: number;
    recorded_at: string;
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
    id: number;
    device_id: number;
    alert_type: string;
    severity: AlertSeverity;
    message: string;
    status: AlertStatus;
    triggered_at: string;
    acknowledged_at?: string | null;
    acknowledged_by?: number | null;
    resolved_at?: string | null;
    resolved_by?: number | null;
    notes?: string | null;
    device?: Device;
}

export interface AuditLog {
    id: number;
    user_id?: number | null;
    action: string;
    module: string;
    description: string;
    ip_address?: string | null;
    created_at: string;
    user?: User;
}

export interface Setting {
    id: number;
    key: string;
    value: string;
    type: 'string' | 'integer' | 'boolean' | 'json';
    group: string;
    description?: string | null;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface SharedProps {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string | null;
        error?: string | null;
        warning?: string | null;
    };
    app: {
        name: string;
        version: string;
        environment: string;
    };
    openAlertsCount: number;
}
