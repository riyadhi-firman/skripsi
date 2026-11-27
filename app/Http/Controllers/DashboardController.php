<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\AuditLog;
use App\Models\Device;
use App\Models\MonitoringResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display NOC overview dashboard.
     */
    public function index(Request $request): Response
    {
        $devices = Device::all();

        $totalDevices = $devices->count();
        $upCount = $devices->where('status', 'UP')->count();
        $downCount = $devices->where('status', 'DOWN')->count();
        $degradedCount = $devices->where('status', 'DEGRADED')->count();
        $unknownCount = $devices->where('status', 'UNKNOWN')->count();

        $availability = $totalDevices > 0
            ? round(($upCount / $totalDevices) * 100, 1)
            : 100;

        $openAlertsCount = Alert::where('status', Alert::STATUS_OPEN)->count();
        $criticalAlertsCount = Alert::where('status', Alert::STATUS_OPEN)
            ->where('severity', 'CRITICAL')
            ->count();

        // Recent 10 alerts
        $recentAlerts = Alert::with('device')
            ->latest('triggered_at')
            ->take(10)
            ->get();

        // 24-hour average latency and packet loss trend
        $hourlyTrends = MonitoringResult::selectRaw("
                DATE_TRUNC('hour', checked_at) as hour,
                ROUND(AVG(latency)::numeric, 2) as avg_latency,
                ROUND(AVG(packet_loss)::numeric, 2) as avg_packet_loss,
                ROUND(AVG(cpu_usage)::numeric, 1) as avg_cpu
            ")
            ->where('checked_at', '>=', now()->subHours(24))
            ->groupBy('hour')
            ->orderBy('hour', 'asc')
            ->get()
            ->map(function ($row) {
                return [
                    'time' => \Carbon\Carbon::parse($row->hour)->format('H:i'),
                    'latency' => $row->avg_latency !== null ? (float) $row->avg_latency : null,
                    'packet_loss' => (float) $row->avg_packet_loss,
                    'cpu' => $row->avg_cpu !== null ? (float) $row->avg_cpu : null,
                ];
            });

        // Device status breakdown by type
        $devicesByType = Device::select('device_type', DB::raw('count(*) as count'))
            ->groupBy('device_type')
            ->pluck('count', 'device_type');

        // Recent audit logs
        $recentAudits = AuditLog::with('user')
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'totalDevices' => $totalDevices,
                'upCount' => $upCount,
                'downCount' => $downCount,
                'degradedCount' => $degradedCount,
                'unknownCount' => $unknownCount,
                'availability' => $availability,
                'openAlertsCount' => $openAlertsCount,
                'criticalAlertsCount' => $criticalAlertsCount,
            ],
            'devices' => $devices->map(fn ($d) => [
                'id' => $d->id,
                'name' => $d->name,
                'ip_address' => $d->ip_address,
                'device_type' => $d->device_type,
                'status' => $d->status,
                'latency' => $d->latency,
                'cpu_usage' => $d->cpu_usage,
                'memory_usage' => $d->memory_usage,
                'temperature' => $d->temperature,
                'uptime' => $d->uptime,
                'last_seen' => $d->last_checked_at?->toIso8601String() ?? ($d->last_seen instanceof \DateTimeInterface ? $d->last_seen->toIso8601String() : $d->last_seen),
                'location' => $d->location,
            ]),
            'recentAlerts' => $recentAlerts,
            'hourlyTrends' => $hourlyTrends,
            'devicesByType' => $devicesByType,
            'recentAudits' => $recentAudits,
        ]);
    }
}
