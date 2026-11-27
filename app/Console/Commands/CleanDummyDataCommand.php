<?php

namespace App\Console\Commands;

use App\Models\Alert;
use App\Models\AlertHistory;
use App\Models\AuditLog;
use App\Models\Device;
use App\Models\InterfaceMetric;
use App\Models\MonitoringResult;
use App\Models\NetworkInterface;
use App\Models\TopologyEdge;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanDummyDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'nms:clean-dummy
                            {--all : Hapus total seluruh perangkat, antarmuka, dan topologi (hanya menyisakan user dan settings)}
                            {--force : Jalankan tanpa konfirmasi interaktif}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Bersihkan data dummy, riwayat telemetri sintetis, alert percobaan, dan reset status perangkat ke data riil';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $all = (bool) $this->option('all');

        $this->warn('========================================================');
        $this->warn('  UBJ Network Monitoring System - Pembersihan Data Dummy ');
        $this->warn('========================================================');

        if ($all) {
            $this->error('PERHATIAN: Opsi --all aktif!');
            $this->line('Perangkat, antarmuka, dan link topologi akan DIHAPUS TOTAL.');
        } else {
            $this->info('Mode default: Menghapus metrik sintetis, alert percobaan, dan demo log.');
            $this->line('Data master 16 perangkat UBJ dan 15 link topologi TETAP DIPERTAHANKAN.');
            $this->line('Nilai telemetri (latency, CPU, RAM) di-reset agar hanya diisi oleh polling riil engine.');
        }

        DB::beginTransaction();
        try {
            // 1. Truncate riwayat metrik telemetri dummy
            $countMonitoring = MonitoringResult::count();
            MonitoringResult::truncate();
            $this->line("  ✓ {$countMonitoring} data monitoring_results dummy dibersihkan.");

            // 2. Truncate metrik interface
            $countIfMetrics = InterfaceMetric::count();
            InterfaceMetric::truncate();
            $this->line("  ✓ {$countIfMetrics} data interface_metrics dummy dibersihkan.");

            // 3. Truncate alerts dan alert histories
            $countAlerts = Alert::count();
            $countAlertHist = AlertHistory::count();
            AlertHistory::truncate();
            Alert::truncate();
            $this->line("  ✓ {$countAlerts} alert & {$countAlertHist} alert histories dibersihkan.");

            // 4. Bersihkan audit logs berlabel demo / init awal
            $demoLogsCount = AuditLog::where(function ($q) {
                $q->where('description', 'ilike', '%demo%')
                  ->orWhere('action', 'SYSTEM_INIT');
            })->delete();
            $this->line("  ✓ {$demoLogsCount} audit log berlabel demo dibersihkan.");

            if ($all) {
                // Hapus topologi, antarmuka, perangkat, alert, riwayat metrik, dan log
                $devCount = Device::count();
                $edgesCount = TopologyEdge::count();
                $ifacesCount = NetworkInterface::count();

                DB::statement('TRUNCATE TABLE topology_edges, interface_metrics, interfaces, alert_histories, alerts, monitoring_results, devices, audit_logs RESTART IDENTITY CASCADE;');

                $this->line("  ✓ {$edgesCount} link topologi dibersihkan.");
                $this->line("  ✓ {$ifacesCount} network interfaces dibersihkan.");
                $this->line("  ✓ {$devCount} perangkat dibersihkan total.");
                $this->line("  ✓ Seluruh riwayat audit log dibersihkan.");
            } else {
                // Reset telemetri perangkat ke nilai kosong (clean state)
                $updatedDevs = Device::query()->update([
                    'status' => 'UNKNOWN',
                    'latency' => null,
                    'packet_loss' => 0.0,
                    'cpu_usage' => null,
                    'memory_usage' => null,
                    'uptime' => null,
                    'last_checked_at' => null,
                ]);
                $this->line("  ✓ {$updatedDevs} perangkat di-reset ke status UNKNOWN tanpa metrik sintetis.");

                // Reset akumulasi octets antarmuka
                NetworkInterface::query()->update([
                    'in_octets' => 0,
                    'out_octets' => 0,
                    'in_errors' => 0,
                    'out_errors' => 0,
                ]);
                $this->line("  ✓ Antarmuka jaringan di-reset ke nilai awal.");
            }

            // Catat log pembersihan resmi
            AuditLog::create([
                'user_id' => 1,
                'action' => 'DATA_CLEANUP',
                'module' => 'System',
                'description' => $all
                    ? 'Pembersihan total sistem (perangkat, antarmuka, topologi, dan riwayat metrik dummy).'
                    : 'Pembersihan seluruh metrik dummy & reset telemetri perangkat ke status riil.',
                'ip_address' => '127.0.0.1',
            ]);

            DB::commit();

            $this->info('');
            $this->info('✓ Seluruh data dummy berhasil dibersihkan!');
            $this->line('Engine monitoring Golang akan mengisi data riil pada siklus polling berikutnya.');
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error('Gagal membersihkan data dummy: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
