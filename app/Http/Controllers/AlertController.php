<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\AlertHistory;
use App\Models\AuditLog;
use App\Models\Device;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlertController extends Controller
{
    /**
     * Display alerts list with filtering.
     */
    public function index(Request $request): Response
    {
        $query = Alert::with(['device', 'acknowledgedUser', 'resolvedUser', 'histories']);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('severity')) {
            $query->where('severity', $request->input('severity'));
        }

        if ($request->filled('device_id')) {
            $query->where('device_id', $request->input('device_id'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('message', 'ilike', "%{$search}%")
                  ->orWhere('alert_type', 'ilike', "%{$search}%")
                  ->orWhereHas('device', function ($dq) use ($search) {
                      $dq->where('name', 'ilike', "%{$search}%")
                         ->orWhere('ip_address', 'like', "%{$search}%");
                  });
            });
        }

        $alerts = $query->latest('triggered_at')->paginate(20)->withQueryString();

        $devices = Device::orderBy('name')->get(['id', 'name', 'ip_address']);

        return Inertia::render('Alerts/Index', [
            'alerts' => $alerts,
            'filters' => $request->only(['status', 'severity', 'device_id', 'search']),
            'devices' => $devices,
            'counts' => [
                'open' => Alert::where('status', Alert::STATUS_OPEN)->count(),
                'critical' => Alert::where('status', Alert::STATUS_OPEN)->where('severity', 'CRITICAL')->count(),
                'warning' => Alert::where('status', Alert::STATUS_OPEN)->where('severity', 'WARNING')->count(),
                'acknowledged' => Alert::where('status', Alert::STATUS_ACKNOWLEDGED)->count(),
                'resolved' => Alert::where('status', Alert::STATUS_RESOLVED)->count(),
            ],
        ]);
    }

    /**
     * Acknowledge an alert.
     */
    public function acknowledge(Request $request, Alert $alert): RedirectResponse
    {
        if ($alert->status !== Alert::STATUS_OPEN) {
            return back()->with('warning', 'Alert sudah diakui atau diselesaikan.');
        }

        $alert->update([
            'status' => Alert::STATUS_ACKNOWLEDGED,
            'acknowledged_at' => now(),
            'acknowledged_by' => $request->user()->id,
        ]);

        AlertHistory::create([
            'alert_id' => $alert->id,
            'action' => 'ACKNOWLEDGED',
            'user_id' => $request->user()->id,
            'notes' => "Diakui oleh operator {$request->user()->name}",
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'ALERT_ACKNOWLEDGE',
            'module' => 'Alert',
            'description' => "Mengakui alert #{$alert->id} ({$alert->alert_type}) pada {$alert->device?->name}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Alert #{$alert->id} berhasil diakui.");
    }

    /**
     * Manually resolve an alert.
     */
    public function resolve(Request $request, Alert $alert): RedirectResponse
    {
        $notes = $request->input('notes', 'Diselesaikan secara manual oleh petugas.');

        $alert->update([
            'status' => Alert::STATUS_RESOLVED,
            'resolved_at' => now(),
            'resolved_by' => $request->user()->id,
            'notes' => $notes,
        ]);

        AlertHistory::create([
            'alert_id' => $alert->id,
            'action' => 'RESOLVED',
            'user_id' => $request->user()->id,
            'notes' => $notes,
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'ALERT_RESOLVE',
            'module' => 'Alert',
            'description' => "Menyelesaikan alert #{$alert->id} ({$alert->alert_type}) pada {$alert->device?->name}: {$notes}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Alert #{$alert->id} berhasil diselesaikan.");
    }
}
