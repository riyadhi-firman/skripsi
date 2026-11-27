<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use App\Models\Device;
use App\Models\InterfaceMetric;
use App\Models\MonitoringResult;
use App\Models\NetworkInterface;
use App\Models\TopologyEdge;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ImportUbjDevicesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ubj:import-devices
                            {file? : Path file JSON atau CSV (default: database/data/devices_ubj.json)}
                            {--replace : Hapus perangkat demo sebelumnya}
                            {--with-topology : Buat relasi link topologi otomatis}
                            {--with-metrics : Buat metrik historis 24 jam untuk chart}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data perangkat infrastruktur jaringan Universitas Banten Jaya (UBJ)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $filePath = $this->argument('file') ?? base_path('database/data/devices_ubj.json');

        if (!File::exists($filePath)) {
            $this->error("File tidak ditemukan: {$filePath}");
            return Command::FAILURE;
        }

        $this->info("Membaca file data perangkat: {$filePath}");

        $devicesData = [];
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        if ($ext === 'json') {
            $devicesData = json_decode(File::get($filePath), true);
        } elseif ($ext === 'csv') {
            $devicesData = $this->parseCsv($filePath);
        } else {
            $this->error("Format file tidak didukung (.json atau .csv saja).");
            return Command::FAILURE;
        }

        if (empty($devicesData)) {
            $this->error("Tidak ada data perangkat yang valid dalam file.");
            return Command::FAILURE;
        }

        DB::beginTransaction();
        try {
            if ($this->option('replace')) {
                $this->warn("Menghapus data perangkat lama beserta relasinya...");
                TopologyEdge::truncate();
                InterfaceMetric::truncate();
                NetworkInterface::truncate();
                MonitoringResult::truncate();
                Device::truncate();
            }

            $imported = [];
            foreach ($devicesData as $row) {
                $device = Device::updateOrCreate(
                    ['ip_address' => $row['ip_address']],
                    [
                        'name' => $row['name'],
                        'hostname' => $row['hostname'] ?? null,
                        'device_type' => $row['device_type'] ?? 'Other',
                        'vendor' => $row['vendor'] ?? null,
                        'model' => $row['model'] ?? null,
                        'location' => $row['location'] ?? null,
                        'snmp_version' => $row['snmp_version'] ?? 'v2c',
                        'snmp_community' => $row['snmp_community'] ?? 'ubj_snmp_community',
                        'snmp_port' => (int) ($row['snmp_port'] ?? 161),
                        'monitoring_interval' => (int) ($row['monitoring_interval'] ?? 30),
                        'timeout' => (int) ($row['timeout'] ?? 5),
                        'retry' => (int) ($row['retry'] ?? 2),
                        'monitoring_enabled' => true,
                        'status' => 'UNKNOWN',
                        'latency' => null,
                        'packet_loss' => 0.0,
                        'cpu_usage' => null,
                        'memory_usage' => null,
                        'uptime' => null,
                        'pos_x' => isset($row['pos_x']) ? (int) $row['pos_x'] : null,
                        'pos_y' => isset($row['pos_y']) ? (int) $row['pos_y'] : null,
                        'last_checked_at' => null,
                    ]
                );
                $imported[$device->name] = $device;
                $this->line("  ✓ Perangkat tersimpan: <info>{$device->name}</info> ({$device->ip_address}) - {$device->location}");
            }

            // Topology & Links
            if ($this->option('with-topology') || $this->option('replace')) {
                $this->info("Membangun interkoneksi topologi kampus UBJ...");
                $this->buildCampusTopology($imported);
            }

            // Historical Metrics for 24h charts (only if explicitly requested)
            if ($this->option('with-metrics')) {
                $this->info("Menghasilkan metrik telemetri 24 jam untuk chart NOC...");
                $this->generateHistoricalMetrics(array_values($imported));
            }

            AuditLog::create([
                'user_id' => 1,
                'action' => 'DEVICE_IMPORT',
                'module' => 'DeviceManagement',
                'description' => "Import " . count($imported) . " perangkat jaringan kampus UBJ.",
                'ip_address' => '127.0.0.1',
                'created_at' => Carbon::now(),
            ]);

            DB::commit();
            $this->info("Berhasil mengimpor " . count($imported) . " perangkat jaringan UBJ!");
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("Gagal melakukan impor perangkat: " . $e->getMessage());
            return Command::FAILURE;
        }
    }

    private function parseCsv(string $filePath): array
    {
        $rows = [];
        if (($handle = fopen($filePath, 'r')) !== false) {
            $header = fgetcsv($handle);
            if (!$header) return [];
            $header = array_map('trim', $header);

            while (($data = fgetcsv($handle)) !== false) {
                if (count($data) === count($header)) {
                    $rows[] = array_combine($header, array_map('trim', $data));
                }
            }
            fclose($handle);
        }
        return $rows;
    }

    private function buildCampusTopology(array $devs): void
    {
        $edges = [
            // WAN / Perimeter
            ['src' => 'UBJ-FW-FortiGate-100F', 'tgt' => 'UBJ-GW-Core-CCR1036', 'label' => 'WAN Uplink (1 Gbps)', 'bw' => '1 Gbps'],
            ['src' => 'UBJ-GW-Core-CCR1036', 'tgt' => 'UBJ-CS-Core-Catalyst3850', 'label' => 'Core Backbone (10 Gbps)', 'bw' => '10 Gbps'],
            // Interkoneksi Kampus 1 Ciwaru via Fiber / VPN
            ['src' => 'UBJ-GW-Core-CCR1036', 'tgt' => 'UBJ-GW-Ciwaru-CCR1009', 'label' => 'Interkoneksi Kampus 1 & 2 (1 Gbps)', 'bw' => '1 Gbps'],
            ['src' => 'UBJ-GW-Ciwaru-CCR1009', 'tgt' => 'UBJ-SW-Distribusi-Ciwaru', 'label' => 'Trunk Ciwaru (1 Gbps)', 'bw' => '1 Gbps'],
            ['src' => 'UBJ-SW-Distribusi-Ciwaru', 'tgt' => 'UBJ-AP-Ciwaru-Lobby', 'label' => 'Access Point Ciwaru PoE', 'bw' => '1 Gbps'],
            // Server Farm
            ['src' => 'UBJ-CS-Core-Catalyst3850', 'tgt' => 'UBJ-SRV-SIAKAD', 'label' => 'SIAKAD Dedicated (10 Gbps)', 'bw' => '10 Gbps'],
            ['src' => 'UBJ-CS-Core-Catalyst3850', 'tgt' => 'UBJ-SRV-Elearning-LMS', 'label' => 'LMS Elearning (10 Gbps)', 'bw' => '10 Gbps'],
            ['src' => 'UBJ-CS-Core-Catalyst3850', 'tgt' => 'UBJ-SRV-Web-Portal', 'label' => 'Web Portal UBJ (1 Gbps)', 'bw' => '1 Gbps'],
            // Distribution Switches Kampus 2 Curug
            ['src' => 'UBJ-CS-Core-Catalyst3850', 'tgt' => 'UBJ-DS-GedungA-Rektorat', 'label' => 'Trunk Gedung A (1 Gbps)', 'bw' => '1 Gbps'],
            ['src' => 'UBJ-CS-Core-Catalyst3850', 'tgt' => 'UBJ-DS-GedungB-FTI', 'label' => 'Trunk Gedung B FTI (1 Gbps)', 'bw' => '1 Gbps'],
            ['src' => 'UBJ-CS-Core-Catalyst3850', 'tgt' => 'UBJ-DS-GedungC-FEB-FKIP', 'label' => 'Trunk Gedung C (1 Gbps)', 'bw' => '1 Gbps'],
            // Access Points Kampus 2
            ['src' => 'UBJ-DS-GedungA-Rektorat', 'tgt' => 'UBJ-AP-Rektorat-Lobby', 'label' => 'AP Lobby Rektorat PoE', 'bw' => '1 Gbps'],
            ['src' => 'UBJ-DS-GedungA-Rektorat', 'tgt' => 'UBJ-AP-Perpustakaan-Lt2', 'label' => 'AP Perpustakaan PoE', 'bw' => '1 Gbps'],
            ['src' => 'UBJ-DS-GedungB-FTI', 'tgt' => 'UBJ-AP-Lab-Komputer-FTI', 'label' => 'AP Lab Komputer FTI PoE', 'bw' => '1 Gbps'],
            ['src' => 'UBJ-DS-GedungC-FEB-FKIP', 'tgt' => 'UBJ-AP-GedungC-Auditorium', 'label' => 'AP Auditorium PoE', 'bw' => '1 Gbps'],
        ];

        foreach ($edges as $e) {
            if (isset($devs[$e['src']]) && isset($devs[$e['tgt']])) {
                TopologyEdge::create([
                    'source_device_id' => $devs[$e['src']]->id,
                    'target_device_id' => $devs[$e['tgt']]->id,
                    'label' => $e['label'],
                    'status' => 'UP',
                    'bandwidth' => $e['bw'],
                ]);
            }
        }
    }

    private function generateHistoricalMetrics(array $devices): void
    {
        $now = Carbon::now();
        foreach ($devices as $dev) {
            for ($i = 24; $i >= 0; $i--) {
                $time = $now->copy()->subHours($i);
                MonitoringResult::create([
                    'device_id' => $dev->id,
                    'status' => 'ONLINE',
                    'latency' => rand(12, 45) / 10 + (rand(0, 99) / 100),
                    'packet_loss' => 0.0,
                    'cpu_usage' => rand(20, 55),
                    'memory_usage' => rand(35, 65),
                    'uptime' => 100000 + ($i * 3600),
                    'checked_at' => $time,
                    'created_at' => $time,
                ]);
            }
        }
    }
}
