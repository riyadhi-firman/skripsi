<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\AlertHistory;
use App\Models\AuditLog;
use App\Models\Device;
use App\Models\InterfaceMetric;
use App\Models\MonitoringResult;
use App\Models\NetworkInterface;
use App\Models\Setting;
use App\Models\TopologyEdge;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with DEMO data.
     * PERINGATAN: Seluruh data perangkat dan IP berlabel "DEMO-"
     * bukan merupakan data riil jaringan Universitas Banten Jaya.
     */
    public function run(): void
    {
        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@ubj.ac.id'],
            [
                'name' => 'Administrator Jaringan UBJ',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
            ]
        );

        $operator = User::firstOrCreate(
            ['email' => 'operator@ubj.ac.id'],
            [
                'name' => 'Operator NOC UBJ',
                'password' => Hash::make('password'),
                'role' => User::ROLE_OPERATOR,
            ]
        );

        // 2. Settings / Configurable Thresholds
        $settings = [
            ['key' => 'latency_warning_ms', 'value' => '50', 'type' => 'float', 'description' => 'Ambang batas latency status WARNING (milidetik)'],
            ['key' => 'latency_critical_ms', 'value' => '150', 'type' => 'float', 'description' => 'Ambang batas latency status CRITICAL (milidetik)'],
            ['key' => 'packet_loss_warning_pct', 'value' => '5', 'type' => 'float', 'description' => 'Ambang batas packet loss status WARNING (%)'],
            ['key' => 'packet_loss_critical_pct', 'value' => '20', 'type' => 'float', 'description' => 'Ambang batas packet loss status CRITICAL (%)'],
            ['key' => 'cpu_warning_pct', 'value' => '75', 'type' => 'float', 'description' => 'Ambang batas penggunaan CPU status WARNING (%)'],
            ['key' => 'cpu_critical_pct', 'value' => '90', 'type' => 'float', 'description' => 'Ambang batas penggunaan CPU status CRITICAL (%)'],
            ['key' => 'memory_warning_pct', 'value' => '80', 'type' => 'float', 'description' => 'Ambang batas penggunaan Memory status WARNING (%)'],
            ['key' => 'memory_critical_pct', 'value' => '95', 'type' => 'float', 'description' => 'Ambang batas penggunaan Memory status CRITICAL (%)'],
            ['key' => 'monitoring_api_token', 'value' => 'ubj_nms_engine_secret_token_2026', 'type' => 'string', 'description' => 'Kunci otorisasi monitoring engine Golang'],
            ['key' => 'default_polling_interval', 'value' => '30', 'type' => 'integer', 'description' => 'Interval standar monitoring perangkat (detik)'],
        ];

        foreach ($settings as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }

        // 3. Demo Devices
        $demoDevices = [
            [
                'name' => 'DEMO-Core-Router',
                'hostname' => 'cr01.demo.ubj.ac.id',
                'ip_address' => '10.10.0.1',
                'device_type' => 'Router',
                'vendor' => 'Cisco',
                'model' => 'ISR 4331',
                'location' => 'Data Center Gedung A Lantai 1',
                'snmp_version' => 'v2c',
                'snmp_community' => 'ubj_demo_community',
                'snmp_port' => 161,
                'monitoring_interval' => 30,
                'timeout' => 5,
                'retry' => 2,
                'monitoring_enabled' => true,
                'status' => 'ONLINE',
                'latency' => 2.45,
                'packet_loss' => 0.0,
                'cpu_usage' => 28.5,
                'memory_usage' => 45.2,
                'uptime' => 1259200,
                'last_checked_at' => Carbon::now(),
            ],
            [
                'name' => 'DEMO-Firewall-Border',
                'hostname' => 'fw01.demo.ubj.ac.id',
                'ip_address' => '10.10.0.2',
                'device_type' => 'Firewall',
                'vendor' => 'Fortinet',
                'model' => 'FortiGate 100F',
                'location' => 'Data Center Gedung A Lantai 1',
                'snmp_version' => 'v2c',
                'snmp_community' => 'ubj_demo_community',
                'snmp_port' => 161,
                'monitoring_interval' => 30,
                'timeout' => 5,
                'retry' => 2,
                'monitoring_enabled' => true,
                'status' => 'ONLINE',
                'latency' => 1.85,
                'packet_loss' => 0.0,
                'cpu_usage' => 35.1,
                'memory_usage' => 52.0,
                'uptime' => 2592000,
                'last_checked_at' => Carbon::now(),
            ],
            [
                'name' => 'DEMO-Core-Switch',
                'hostname' => 'cs01.demo.ubj.ac.id',
                'ip_address' => '10.10.0.10',
                'device_type' => 'Switch',
                'vendor' => 'Cisco',
                'model' => 'Catalyst 3850-48P',
                'location' => 'Data Center Gedung A Lantai 1',
                'snmp_version' => 'v2c',
                'snmp_community' => 'ubj_demo_community',
                'snmp_port' => 161,
                'monitoring_interval' => 30,
                'timeout' => 5,
                'retry' => 2,
                'monitoring_enabled' => true,
                'status' => 'ONLINE',
                'latency' => 1.20,
                'packet_loss' => 0.0,
                'cpu_usage' => 22.0,
                'memory_usage' => 38.6,
                'uptime' => 3456000,
                'last_checked_at' => Carbon::now(),
            ],
            [
                'name' => 'DEMO-Distribution-01',
                'hostname' => 'ds01.demo.ubj.ac.id',
                'ip_address' => '10.10.1.1',
                'device_type' => 'Switch',
                'vendor' => 'Ruijie',
                'model' => 'RG-S2910-24GT4SFP-P-E',
                'location' => 'Ruang Server Gedung B Lantai 2',
                'snmp_version' => 'v2c',
                'snmp_community' => 'ubj_demo_community',
                'snmp_port' => 161,
                'monitoring_interval' => 30,
                'timeout' => 5,
                'retry' => 2,
                'monitoring_enabled' => true,
                'status' => 'WARNING',
                'latency' => 64.30,
                'packet_loss' => 2.5,
                'cpu_usage' => 78.4,
                'memory_usage' => 65.0,
                'uptime' => 864000,
                'last_checked_at' => Carbon::now(),
            ],
            [
                'name' => 'DEMO-Distribution-02',
                'hostname' => 'ds02.demo.ubj.ac.id',
                'ip_address' => '10.10.2.1',
                'device_type' => 'Switch',
                'vendor' => 'Ruijie',
                'model' => 'RG-S2910-24GT4SFP-P-E',
                'location' => 'Ruang Server Gedung C Lantai 2',
                'snmp_version' => 'v2c',
                'snmp_community' => 'ubj_demo_community',
                'snmp_port' => 161,
                'monitoring_interval' => 30,
                'timeout' => 5,
                'retry' => 2,
                'monitoring_enabled' => true,
                'status' => 'ONLINE',
                'latency' => 3.12,
                'packet_loss' => 0.0,
                'cpu_usage' => 19.8,
                'memory_usage' => 41.2,
                'uptime' => 950000,
                'last_checked_at' => Carbon::now(),
            ],
            [
                'name' => 'DEMO-AccessPoint-01',
                'hostname' => 'ap01.demo.ubj.ac.id',
                'ip_address' => '10.10.1.50',
                'device_type' => 'Access Point',
                'vendor' => 'Ubiquiti',
                'model' => 'UniFi U6 Pro',
                'location' => 'Gedung B - Lobby & Perpustakaan',
                'snmp_version' => 'v2c',
                'snmp_community' => 'ubj_demo_community',
                'snmp_port' => 161,
                'monitoring_interval' => 30,
                'timeout' => 5,
                'retry' => 2,
                'monitoring_enabled' => true,
                'status' => 'ONLINE',
                'latency' => 5.40,
                'packet_loss' => 0.0,
                'cpu_usage' => 32.0,
                'memory_usage' => 48.0,
                'uptime' => 432000,
                'last_checked_at' => Carbon::now(),
            ],
            [
                'name' => 'DEMO-AccessPoint-02',
                'hostname' => 'ap02.demo.ubj.ac.id',
                'ip_address' => '10.10.2.50',
                'device_type' => 'Access Point',
                'vendor' => 'Ubiquiti',
                'model' => 'UniFi U6 Pro',
                'location' => 'Gedung C - Ruang Kuliah Lantai 3',
                'snmp_version' => 'v2c',
                'snmp_community' => 'ubj_demo_community',
                'snmp_port' => 161,
                'monitoring_interval' => 30,
                'timeout' => 5,
                'retry' => 2,
                'monitoring_enabled' => true,
                'status' => 'OFFLINE',
                'latency' => null,
                'packet_loss' => 100.0,
                'cpu_usage' => null,
                'memory_usage' => null,
                'uptime' => null,
                'last_checked_at' => Carbon::now(),
            ],
            [
                'name' => 'DEMO-Server-01',
                'hostname' => 'srv01.demo.ubj.ac.id',
                'ip_address' => '10.10.0.100',
                'device_type' => 'Server',
                'vendor' => 'Dell',
                'model' => 'PowerEdge R640',
                'location' => 'Data Center Gedung A Lantai 1',
                'snmp_version' => 'v2c',
                'snmp_community' => 'ubj_demo_community',
                'snmp_port' => 161,
                'monitoring_interval' => 30,
                'timeout' => 5,
                'retry' => 2,
                'monitoring_enabled' => true,
                'status' => 'ONLINE',
                'latency' => 0.95,
                'packet_loss' => 0.0,
                'cpu_usage' => 42.1,
                'memory_usage' => 61.4,
                'uptime' => 5184000,
                'last_checked_at' => Carbon::now(),
            ],
        ];

        $createdDevices = [];
        foreach ($demoDevices as $devData) {
            $createdDevices[$devData['name']] = Device::create($devData);
        }

        // 4. Interfaces
        $cr = $createdDevices['DEMO-Core-Router'];
        $crIf1 = NetworkInterface::create([
            'device_id' => $cr->id,
            'if_index' => 1,
            'name' => 'GigabitEthernet0/0/0',
            'description' => 'Link WAN ke Border Firewall',
            'admin_status' => 'UP',
            'oper_status' => 'UP',
            'speed' => 1000000000,
            'in_octets' => 954823100,
            'out_octets' => 842194000,
        ]);
        $crIf2 = NetworkInterface::create([
            'device_id' => $cr->id,
            'if_index' => 2,
            'name' => 'GigabitEthernet0/0/1',
            'description' => 'Trunk ke DEMO-Core-Switch',
            'admin_status' => 'UP',
            'oper_status' => 'UP',
            'speed' => 1000000000,
            'in_octets' => 1459203940,
            'out_octets' => 1349029304,
        ]);

        $cs = $createdDevices['DEMO-Core-Switch'];
        $csIf1 = NetworkInterface::create([
            'device_id' => $cs->id,
            'if_index' => 1,
            'name' => 'TenGigabitEthernet1/1/1',
            'description' => 'Trunk dari DEMO-Core-Router',
            'admin_status' => 'UP',
            'oper_status' => 'UP',
            'speed' => 10000000000,
            'in_octets' => 1349029304,
            'out_octets' => 1459203940,
        ]);
        $csIf2 = NetworkInterface::create([
            'device_id' => $cs->id,
            'if_index' => 2,
            'name' => 'GigabitEthernet1/0/1',
            'description' => 'Uplink ke DEMO-Distribution-01',
            'admin_status' => 'UP',
            'oper_status' => 'UP',
            'speed' => 1000000000,
            'in_octets' => 450920300,
            'out_octets' => 380491000,
        ]);
        $csIf3 = NetworkInterface::create([
            'device_id' => $cs->id,
            'if_index' => 3,
            'name' => 'GigabitEthernet1/0/2',
            'description' => 'Uplink ke DEMO-Distribution-02',
            'admin_status' => 'UP',
            'oper_status' => 'UP',
            'speed' => 1000000000,
            'in_octets' => 510920400,
            'out_octets' => 490203900,
        ]);
        $csIf4 = NetworkInterface::create([
            'device_id' => $cs->id,
            'if_index' => 4,
            'name' => 'TenGigabitEthernet1/1/2',
            'description' => 'Uplink Server Farm ke DEMO-Server-01',
            'admin_status' => 'UP',
            'oper_status' => 'UP',
            'speed' => 10000000000,
            'in_octets' => 782019400,
            'out_octets' => 891029300,
        ]);

        $ds1 = $createdDevices['DEMO-Distribution-01'];
        $ds1If1 = NetworkInterface::create([
            'device_id' => $ds1->id,
            'if_index' => 1,
            'name' => 'GigabitEthernet0/1',
            'description' => 'Downlink ke DEMO-AccessPoint-01',
            'admin_status' => 'UP',
            'oper_status' => 'UP',
            'speed' => 1000000000,
            'in_octets' => 129039400,
            'out_octets' => 204920300,
        ]);

        $ds2 = $createdDevices['DEMO-Distribution-02'];
        $ds2If1 = NetworkInterface::create([
            'device_id' => $ds2->id,
            'if_index' => 1,
            'name' => 'GigabitEthernet0/1',
            'description' => 'Downlink ke DEMO-AccessPoint-02',
            'admin_status' => 'UP',
            'oper_status' => 'DOWN',
            'speed' => 1000000000,
            'in_octets' => 0,
            'out_octets' => 0,
        ]);

        // 5. Topology Edges
        TopologyEdge::create([
            'source_device_id' => $createdDevices['DEMO-Firewall-Border']->id,
            'target_device_id' => $cr->id,
            'label' => 'WAN Link (1 Gbps)',
            'status' => 'UP',
            'bandwidth' => '1 Gbps',
        ]);

        TopologyEdge::create([
            'source_device_id' => $cr->id,
            'target_device_id' => $cs->id,
            'source_interface_id' => $crIf2->id,
            'target_interface_id' => $csIf1->id,
            'label' => 'Core Backbone (10 Gbps)',
            'status' => 'UP',
            'bandwidth' => '10 Gbps',
        ]);

        TopologyEdge::create([
            'source_device_id' => $cs->id,
            'target_device_id' => $ds1->id,
            'source_interface_id' => $csIf2->id,
            'label' => 'Dist-01 Link (Gedung B)',
            'status' => 'UP',
            'bandwidth' => '1 Gbps',
        ]);

        TopologyEdge::create([
            'source_device_id' => $cs->id,
            'target_device_id' => $ds2->id,
            'source_interface_id' => $csIf3->id,
            'label' => 'Dist-02 Link (Gedung C)',
            'status' => 'UP',
            'bandwidth' => '1 Gbps',
        ]);

        TopologyEdge::create([
            'source_device_id' => $cs->id,
            'target_device_id' => $createdDevices['DEMO-Server-01']->id,
            'source_interface_id' => $csIf4->id,
            'label' => 'Server Farm Link',
            'status' => 'UP',
            'bandwidth' => '10 Gbps',
        ]);

        TopologyEdge::create([
            'source_device_id' => $ds1->id,
            'target_device_id' => $createdDevices['DEMO-AccessPoint-01']->id,
            'source_interface_id' => $ds1If1->id,
            'label' => 'Access Point 01 PoE',
            'status' => 'UP',
            'bandwidth' => '1 Gbps',
        ]);

        TopologyEdge::create([
            'source_device_id' => $ds2->id,
            'target_device_id' => $createdDevices['DEMO-AccessPoint-02']->id,
            'source_interface_id' => $ds2If1->id,
            'label' => 'Access Point 02 PoE',
            'status' => 'DOWN',
            'bandwidth' => '1 Gbps',
        ]);

        // 6. Monitoring Results (24 jam)
        $now = Carbon::now();
        foreach ($createdDevices as $dev) {
            for ($i = 24; $i >= 0; $i--) {
                $time = $now->copy()->subHours($i);
                $isOffline = ($dev->name === 'DEMO-AccessPoint-02' && $i <= 4);
                $isWarning = ($dev->name === 'DEMO-Distribution-01' && $i <= 6);

                MonitoringResult::create([
                    'device_id' => $dev->id,
                    'status' => $isOffline ? 'OFFLINE' : ($isWarning ? 'WARNING' : 'ONLINE'),
                    'latency' => $isOffline ? null : ($isWarning ? rand(60, 95) + (rand(0, 99) / 100) : rand(1, 15) + (rand(0, 99) / 100)),
                    'packet_loss' => $isOffline ? 100 : ($isWarning ? rand(2, 8) : 0),
                    'cpu_usage' => $isOffline ? null : ($isWarning ? rand(75, 88) : rand(15, 45)),
                    'memory_usage' => $isOffline ? null : rand(30, 65),
                    'uptime' => $isOffline ? null : (100000 + ($i * 3600)),
                    'checked_at' => $time,
                    'created_at' => $time,
                ]);
            }
        }

        // 7. Interface Metrics
        foreach ([$crIf1, $csIf1, $ds1If1] as $iface) {
            for ($i = 12; $i >= 0; $i--) {
                $time = $now->copy()->subHours($i);
                InterfaceMetric::create([
                    'interface_id' => $iface->id,
                    'input_octets' => rand(1000000, 50000000),
                    'output_octets' => rand(1000000, 45000000),
                    'input_errors' => rand(0, 3),
                    'output_errors' => 0,
                    'utilization' => rand(5, 65) + (rand(0, 99) / 100),
                    'recorded_at' => $time,
                    'created_at' => $time,
                ]);
            }
        }

        // 8. Alerts
        $apOfflineAlert = Alert::create([
            'device_id' => $createdDevices['DEMO-AccessPoint-02']->id,
            'type' => 'DEVICE_DOWN',
            'severity' => 'CRITICAL',
            'title' => 'DEMO-AccessPoint-02 Tidak Merespons ICMP',
            'message' => 'Perangkat DEMO-AccessPoint-02 (10.10.2.50) mengalami kegagalan ICMP ping dengan packet loss 100%.',
            'status' => 'OPEN',
            'triggered_at' => Carbon::now()->subHours(2),
        ]);

        AlertHistory::create([
            'alert_id' => $apOfflineAlert->id,
            'action' => 'TRIGGERED',
            'description' => 'Alert dibuat otomatis oleh Golang Monitoring Engine karena ICMP timeout berturut-turut.',
            'created_at' => Carbon::now()->subHours(2),
        ]);

        $distWarningAlert = Alert::create([
            'device_id' => $createdDevices['DEMO-Distribution-01']->id,
            'type' => 'HIGH_LATENCY',
            'severity' => 'WARNING',
            'title' => 'Latensi Tinggi Terdeteksi pada DEMO-Distribution-01',
            'message' => 'Latensi rata-rata mencapai 64.30 ms melebihi batas warning 50.00 ms.',
            'status' => 'ACKNOWLEDGED',
            'triggered_at' => Carbon::now()->subHours(4),
            'acknowledged_at' => Carbon::now()->subHours(1),
        ]);

        AlertHistory::create([
            'alert_id' => $distWarningAlert->id,
            'action' => 'TRIGGERED',
            'description' => 'Ambang batas latency warning terlampaui.',
            'created_at' => Carbon::now()->subHours(4),
        ]);

        AlertHistory::create([
            'alert_id' => $distWarningAlert->id,
            'action' => 'ACKNOWLEDGED',
            'description' => 'Peringatan telah ditinjau dan sedang dalam pemeriksaan teknisi.',
            'user_id' => $operator->id,
            'created_at' => Carbon::now()->subHours(1),
        ]);

        $resolvedAlert = Alert::create([
            'device_id' => $createdDevices['DEMO-Core-Router']->id,
            'type' => 'HIGH_CPU',
            'severity' => 'WARNING',
            'title' => 'Penggunaan CPU Tinggi pada DEMO-Core-Router',
            'message' => 'Penggunaan CPU sempat mencapai 82% selama proses update routing table.',
            'status' => 'RESOLVED',
            'triggered_at' => Carbon::now()->subHours(12),
            'acknowledged_at' => Carbon::now()->subHours(11),
            'resolved_at' => Carbon::now()->subHours(10),
        ]);

        AlertHistory::create([
            'alert_id' => $resolvedAlert->id,
            'action' => 'RESOLVED',
            'description' => 'Penggunaan CPU kembali ke level normal (28.5%). Masalah selesai.',
            'user_id' => $admin->id,
            'created_at' => Carbon::now()->subHours(10),
        ]);

        // 9. Audit Logs
        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'SYSTEM_INIT',
            'module' => 'System',
            'description' => 'Inisialisasi sistem NMS Universitas Banten Jaya dengan dataset demo.',
            'ip_address' => '127.0.0.1',
            'created_at' => Carbon::now()->subDays(1),
        ]);

        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'DEVICE_CREATE',
            'module' => 'Perangkat',
            'description' => 'Admin menambahkan perangkat DEMO-Core-Router (10.10.0.1)',
            'ip_address' => '127.0.0.1',
            'created_at' => Carbon::now()->subHours(18),
        ]);

        AuditLog::create([
            'user_id' => $operator->id,
            'action' => 'ALERT_ACK',
            'module' => 'Peringatan',
            'description' => 'Operator mengakui peringatan HIGH_LATENCY pada DEMO-Distribution-01',
            'ip_address' => '127.0.0.1',
            'created_at' => Carbon::now()->subHours(1),
        ]);
    }
}
