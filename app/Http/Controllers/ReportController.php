<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\MonitoringResult;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Display reporting dashboard.
     */
    public function index(Request $request): Response
    {
        $days = (int) $request->input('range', 7);
        $since = now()->subDays($days);

        $deviceId = $request->input('device_id');

        $query = MonitoringResult::where('checked_at', '>=', $since);
        if ($deviceId) {
            $query->where('device_id', $deviceId);
        }

        // Summary calculations
        $totalChecks = (clone $query)->count();
        $upChecks = (clone $query)->where('status', 'UP')->count();
        $overallUptimePct = $totalChecks > 0 ? round(($upChecks / $totalChecks) * 100, 2) : 100.0;

        $avgLatency = round((float) (clone $query)->avg('latency'), 2);
        $avgPacketLoss = round((float) (clone $query)->avg('packet_loss'), 2);

        // Daily trend
        $dailyTrends = (clone $query)
            ->selectRaw("
                DATE_TRUNC('day', checked_at) as date,
                ROUND(AVG(latency)::numeric, 2) as avg_latency,
                ROUND(AVG(packet_loss)::numeric, 2) as avg_packet_loss,
                ROUND(COUNT(CASE WHEN status = 'UP' THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100, 2) as uptime_pct
            ")
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($row) {
                return [
                    'date' => Carbon::parse($row->date)->format('d M'),
                    'latency' => $row->avg_latency !== null ? (float) $row->avg_latency : 0,
                    'packet_loss' => (float) $row->avg_packet_loss,
                    'uptime_pct' => (float) $row->uptime_pct,
                ];
            });

        // Device SLA breakdown
        $deviceSla = Device::all()->map(function ($device) use ($since) {
            $deviceChecks = MonitoringResult::where('device_id', $device->id)
                ->where('checked_at', '>=', $since);

            $total = $deviceChecks->count();
            $up = (clone $deviceChecks)->where('status', 'UP')->count();
            $uptime = $total > 0 ? round(($up / $total) * 100, 2) : 100.0;
            $avgLat = round((float) (clone $deviceChecks)->avg('latency'), 2);
            $avgLoss = round((float) (clone $deviceChecks)->avg('packet_loss'), 2);

            return [
                'id' => $device->id,
                'name' => $device->name,
                'ip_address' => $device->ip_address,
                'device_type' => $device->device_type,
                'uptime_pct' => $uptime,
                'avg_latency' => $avgLat,
                'avg_packet_loss' => $avgLoss,
                'status' => $device->status,
            ];
        });

        $devices = Device::orderBy('name')->get(['id', 'name', 'ip_address']);

        return Inertia::render('Reports/Index', [
            'summary' => [
                'days' => $days,
                'totalChecks' => $totalChecks,
                'uptimePct' => $overallUptimePct,
                'avgLatency' => $avgLatency,
                'avgPacketLoss' => $avgPacketLoss,
            ],
            'dailyTrends' => $dailyTrends,
            'deviceSla' => $deviceSla,
            'devices' => $devices,
            'selectedDeviceId' => $deviceId,
        ]);
    }

    /**
     * Export monitoring records to CSV for academic thesis documentation.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $days = (int) $request->input('range', 7);
        $since = now()->subDays($days);
        $deviceId = $request->input('device_id');

        $query = MonitoringResult::with('device')
            ->where('checked_at', '>=', $since)
            ->orderBy('checked_at', 'desc');

        if ($deviceId) {
            $query->where('device_id', $deviceId);
        }

        $filename = 'laporan-monitoring-ubj-'.now()->format('Y-m-d_His').'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        return response()->stream(function () use ($query) {
            $handle = fopen('php://output', 'w');

            // Header Row
            fputcsv($handle, [
                'ID',
                'Device ID',
                'Device Name',
                'IP Address',
                'Status',
                'Latency (ms)',
                'Packet Loss (%)',
                'Jitter (ms)',
                'CPU Usage (%)',
                'Memory Usage (%)',
                'Uptime (seconds)',
                'Checked At',
            ]);

            $query->chunk(500, function ($rows) use ($handle) {
                foreach ($rows as $row) {
                    fputcsv($handle, [
                        $row->id,
                        $row->device_id,
                        $row->device?->name ?? 'N/A',
                        $row->device?->ip_address ?? 'N/A',
                        $row->status,
                        $row->latency,
                        $row->packet_loss,
                        $row->jitter,
                        $row->cpu_usage,
                        $row->memory_usage,
                        $row->uptime,
                        $row->checked_at->toDateTimeString(),
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }
}
