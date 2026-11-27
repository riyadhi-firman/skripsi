<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeviceRequest;
use App\Http\Requests\UpdateDeviceRequest;
use App\Models\AuditLog;
use App\Models\Device;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DeviceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Device::class);

        $query = Device::query()->withCount(['interfaces', 'activeAlerts']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhere('hostname', 'ilike', "%{$search}%")
                  ->orWhere('vendor', 'ilike', "%{$search}%")
                  ->orWhere('location', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('device_type')) {
            $query->where('device_type', $request->input('device_type'));
        }

        if ($request->filled('vendor')) {
            $query->where('vendor', $request->input('vendor'));
        }

        if ($request->filled('location')) {
            $query->where('location', $request->input('location'));
        }

        $devices = $query->orderBy('name')->paginate(15)->withQueryString();

        $types = ['Router', 'Switch', 'Firewall', 'Access Point', 'Server', 'Other'];
        $vendors = Device::whereNotNull('vendor')->distinct()->pluck('vendor');
        $locations = Device::whereNotNull('location')->distinct()->pluck('location');

        return Inertia::render('Devices/Index', [
            'devices' => $devices,
            'filters' => $request->only(['search', 'status', 'device_type', 'vendor', 'location']),
            'deviceTypes' => $types,
            'vendors' => $vendors,
            'locations' => $locations,
            'canManage' => $request->user()?->isAdmin() ?? false,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('create', Device::class);

        return Inertia::render('Devices/Create', [
            'deviceTypes' => ['Router', 'Switch', 'Firewall', 'Access Point', 'Server', 'Other'],
            'snmpVersions' => ['v1', 'v2c', 'v3'],
            'authProtocols' => ['MD5', 'SHA', 'SHA256'],
            'privProtocols' => ['DES', 'AES'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeviceRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        if (empty($validated['snmp_port'])) {
            $validated['snmp_port'] = 161;
        }

        $device = Device::create($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DEVICE_CREATE',
            'module' => 'Perangkat',
            'description' => "Menambahkan perangkat {$device->name} ({$device->ip_address})",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('devices.show', $device->id)
            ->with('success', "Perangkat {$device->name} berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Device $device): Response
    {
        Gate::authorize('view', $device);

        $device->load([
            'interfaces' => fn ($q) => $q->orderBy('if_index'),
            'interfaces.latestMetric',
            'activeAlerts' => fn ($q) => $q->latest()->take(10),
            'outboundEdges.targetDevice',
            'inboundEdges.sourceDevice',
        ]);

        $monitoringHistory = $device->monitoringResults()
            ->orderBy('checked_at', 'desc')
            ->take(50)
            ->get()
            ->reverse()
            ->values();

        return Inertia::render('Devices/Show', [
            'device' => $device,
            'monitoringHistory' => $monitoringHistory,
            'canManage' => $request->user()?->isAdmin() ?? false,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Device $device): Response
    {
        Gate::authorize('update', $device);

        return Inertia::render('Devices/Edit', [
            'device' => $device,
            'deviceTypes' => ['Router', 'Switch', 'Firewall', 'Access Point', 'Server', 'Other'],
            'snmpVersions' => ['v1', 'v2c', 'v3'],
            'authProtocols' => ['MD5', 'SHA', 'SHA256'],
            'privProtocols' => ['DES', 'AES'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeviceRequest $request, Device $device): RedirectResponse
    {
        $validated = $request->validated();

        // Jika password/community tidak diisi saat update, pertahankan yang lama
        if (empty($validated['snmp_community'])) {
            unset($validated['snmp_community']);
        }
        if (empty($validated['snmp_auth_password'])) {
            unset($validated['snmp_auth_password']);
        }
        if (empty($validated['snmp_priv_password'])) {
            unset($validated['snmp_priv_password']);
        }

        $device->update($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DEVICE_UPDATE',
            'module' => 'Perangkat',
            'description' => "Memperbarui konfigurasi perangkat {$device->name} ({$device->ip_address})",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('devices.show', $device->id)
            ->with('success', "Konfigurasi perangkat {$device->name} berhasil diperbarui.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Device $device): RedirectResponse
    {
        Gate::authorize('delete', $device);

        $name = $device->name;
        $ip = $device->ip_address;
        $device->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DEVICE_DELETE',
            'module' => 'Perangkat',
            'description' => "Menghapus perangkat {$name} ({$ip})",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('devices.index')
            ->with('success', "Perangkat {$name} berhasil dihapus.");
    }

    /**
     * Toggle monitoring state.
     */
    public function toggleMonitoring(Request $request, Device $device): RedirectResponse
    {
        Gate::authorize('update', $device);

        $device->monitoring_enabled = ! $device->monitoring_enabled;
        $device->save();

        $statusStr = $device->monitoring_enabled ? 'diaktifkan' : 'dinonaktifkan';

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DEVICE_TOGGLE_MONITORING',
            'module' => 'Perangkat',
            'description' => "Monitoring perangkat {$device->name} {$statusStr}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Monitoring perangkat {$device->name} berhasil {$statusStr}.");
    }

    /**
     * Quick connection test from web UI (ICMP ping).
     */
    public function testConnection(Request $request, Device $device): JsonResponse
    {
        Gate::authorize('view', $device);

        $ip = escapeshellarg($device->ip_address);
        $output = [];
        $exitCode = 0;
        exec("ping -c 2 -W 2 {$ip} 2>&1", $output, $exitCode);

        $reachable = ($exitCode === 0);
        $latency = null;

        if ($reachable) {
            foreach ($output as $line) {
                if (preg_match('/time=([0-9.]+)\s*ms/', $line, $matches)) {
                    $latency = (float) $matches[1];
                    break;
                }
            }
        }

        return response()->json([
            'reachable' => $reachable,
            'latency' => $latency,
            'output' => implode("\n", $output),
            'tested_at' => now()->toIso8601String(),
        ]);
    }
}
