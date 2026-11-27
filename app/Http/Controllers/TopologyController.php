<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Device;
use App\Models\NetworkInterface;
use App\Models\TopologyEdge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TopologyController extends Controller
{
    /**
     * Display the interactive network topology canvas.
     */
    public function index(Request $request): Response
    {
        $devices = Device::with(['interfaces'])->get();
        $edges = TopologyEdge::with([
            'sourceDevice',
            'targetDevice',
            'sourceInterface',
            'targetInterface',
        ])->get();

        return Inertia::render('Topology/Index', [
            'devices' => $devices,
            'edges' => $edges,
            'links' => $edges,
            'canManage' => $request->user()?->isAdmin() ?? false,
        ]);
    }

    /**
     * Update node positions when dragged in React Flow.
     */
    public function updatePosition(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|exists:devices,id',
            'pos_x' => 'required|numeric',
            'pos_y' => 'required|numeric',
        ]);

        $device = Device::findOrFail($request->input('device_id'));
        $device->update([
            'pos_x' => $request->input('pos_x'),
            'pos_y' => $request->input('pos_y'),
        ]);

        return response()->json([
            'success' => true,
            'device_id' => $device->id,
            'pos_x' => $device->pos_x,
            'pos_y' => $device->pos_y,
        ]);
    }

    /**
     * Create a new link between two devices.
     */
    public function storeLink(Request $request): RedirectResponse
    {
        if (! $request->user()?->isAdmin()) {
            abort(403, 'Aksi ini hanya diperbolehkan untuk Administrator.');
        }

        $validated = $request->validate([
            'source_device_id' => 'required|exists:devices,id',
            'target_device_id' => 'required|exists:devices,id|different:source_device_id',
            'source_interface_id' => 'nullable|exists:interfaces,id',
            'target_interface_id' => 'nullable|exists:interfaces,id',
            'source_port' => 'nullable|string|max:50',
            'target_port' => 'nullable|string|max:50',
            'link_type' => 'nullable|string|max:50',
            'speed_mbps' => 'nullable|integer|min:1',
            'link_speed' => 'nullable|integer|min:1',
            'label' => 'nullable|string|max:100',
            'bandwidth' => 'nullable|string|max:50',
        ]);

        $speed = $request->input('speed_mbps') ?? $request->input('link_speed');
        $bandwidth = $request->input('bandwidth');
        if (! $bandwidth && $speed) {
            $bandwidth = $speed >= 1000 ? ($speed / 1000) . ' Gbps' : $speed . ' Mbps';
        }
        $label = $request->input('label');
        if (! $label) {
            $srcPort = $request->input('source_port', 'eth0');
            $tgtPort = $request->input('target_port', 'eth0');
            $bw = $bandwidth ?: '1 Gbps';
            $label = "{$bw} ({$srcPort} → {$tgtPort})";
        }

        $edge = TopologyEdge::create([
            'source_device_id' => $validated['source_device_id'],
            'target_device_id' => $validated['target_device_id'],
            'source_interface_id' => $validated['source_interface_id'] ?? null,
            'target_interface_id' => $validated['target_interface_id'] ?? null,
            'label' => $label,
            'status' => 'UP',
            'bandwidth' => $bandwidth ?? '1 Gbps',
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'TOPOLOGY_LINK_CREATE',
            'module' => 'Topologi',
            'description' => "Menambahkan link topologi antara Device #{$edge->source_device_id} dan Device #{$edge->target_device_id}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Link topologi berhasil dibuat.');
    }

    /**
     * Remove a link between two devices.
     */
    public function destroyLink(Request $request, TopologyEdge $edge): RedirectResponse
    {
        if (! $request->user()?->isAdmin()) {
            abort(403, 'Aksi ini hanya diperbolehkan untuk Administrator.');
        }

        $sourceId = $edge->source_device_id;
        $targetId = $edge->target_device_id;
        $edge->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'TOPOLOGY_LINK_DELETE',
            'module' => 'Topologi',
            'description' => "Menghapus link topologi antara Device #{$sourceId} dan Device #{$targetId}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Link topologi berhasil dihapus.');
    }
}
