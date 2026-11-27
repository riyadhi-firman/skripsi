<?php

namespace App\Http\Controllers\Api;

use App\Events\DeviceStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\InterfaceMetric;
use App\Models\MonitoringResult;
use App\Models\NetworkInterface;
use App\Services\AlertService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MonitoringIngestionController extends Controller
{
    /**
     * Return list of active devices configured for polling.
     */
    public function getDevices(Request $request): JsonResponse
    {
        $devices = Device::where('monitoring_enabled', true)
            ->get([
                'id',
                'name',
                'hostname',
                'ip_address',
                'device_type',
                'snmp_version',
                'snmp_community',
                'snmp_port',
                'snmp_security_level',
                'snmp_auth_protocol',
                'snmp_auth_password',
                'snmp_priv_protocol',
                'snmp_priv_password',
                'monitoring_interval',
                'timeout',
                'retry',
            ]);

        return response()->json([
            'success' => true,
            'count' => $devices->count(),
            'devices' => $devices,
        ]);
    }

    /**
     * Ingest batch or single device monitoring results from Golang engine.
     */
    public function postResults(Request $request, AlertService $alertService): JsonResponse
    {
        $payload = $request->all();
        $results = isset($payload['results']) && is_array($payload['results'])
            ? $payload['results']
            : [$payload];

        $processed = 0;

        foreach ($results as $item) {
            $validator = Validator::make($item, [
                'device_id' => 'required|exists:devices,id',
                'status' => 'required|in:UP,DOWN,DEGRADED,UNKNOWN',
                'latency' => 'nullable|numeric',
                'packet_loss' => 'required|numeric|min:0|max:100',
                'jitter' => 'nullable|numeric',
                'cpu_usage' => 'nullable|numeric',
                'memory_usage' => 'nullable|numeric',
                'temperature' => 'nullable|numeric',
                'uptime' => 'nullable|integer',
                'checked_at' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                continue;
            }

            $valid = $validator->validated();
            $device = Device::find($valid['device_id']);
            if (! $device) continue;

            $checkedAt = $valid['checked_at'] ?? now();

            // 1. Record time-series
            $resultModel = MonitoringResult::create([
                'device_id' => $device->id,
                'status' => $valid['status'],
                'latency' => $valid['latency'] ?? null,
                'packet_loss' => $valid['packet_loss'],
                'jitter' => $valid['jitter'] ?? null,
                'cpu_usage' => $valid['cpu_usage'] ?? null,
                'memory_usage' => $valid['memory_usage'] ?? null,
                'uptime' => $valid['uptime'] ?? null,
                'checked_at' => $checkedAt,
            ]);

            // 2. Update device status and latest metrics
            $deviceUpdate = [
                'status' => $valid['status'],
                'last_seen' => $valid['status'] !== 'DOWN' ? $checkedAt : $device->last_seen,
            ];

            if (isset($valid['uptime']) && $valid['uptime'] !== null) {
                $deviceUpdate['uptime'] = $valid['uptime'];
            }
            if (isset($valid['cpu_usage']) && $valid['cpu_usage'] !== null) {
                $deviceUpdate['cpu_usage'] = $valid['cpu_usage'];
            }
            if (isset($valid['memory_usage']) && $valid['memory_usage'] !== null) {
                $deviceUpdate['memory_usage'] = $valid['memory_usage'];
            }
            if (isset($valid['temperature']) && $valid['temperature'] !== null) {
                $deviceUpdate['temperature'] = $valid['temperature'];
            }
            if (! empty($item['firmware_version'])) {
                $deviceUpdate['firmware_version'] = $item['firmware_version'];
            }
            if (! empty($item['sys_descr'])) {
                $deviceUpdate['sys_descr'] = $item['sys_descr'];
            }
            if (! empty($item['sys_object_id'])) {
                $deviceUpdate['sys_object_id'] = $item['sys_object_id'];
            }

            $device->update($deviceUpdate);

            // 3. Evaluate Alerts
            $alertService->evaluateDevice($device, [
                'latency' => $valid['latency'] ?? null,
                'packet_loss' => $valid['packet_loss'] ?? null,
                'cpu_usage' => $valid['cpu_usage'] ?? null,
                'memory_usage' => $valid['memory_usage'] ?? null,
            ]);

            // 4. Broadcast Real-Time Reverb event
            try {
                broadcast(new DeviceStatusUpdated($device, $valid['latency'] ?? null, (float)$valid['packet_loss']));
            } catch (\Throwable $e) {
                // Ignore WebSocket connection errors if Reverb is offline
            }

            $processed++;
        }

        return response()->json([
            'success' => true,
            'processed' => $processed,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Ingest interface metrics and update interface states.
     */
    public function postInterfaceResults(Request $request): JsonResponse
    {
        $deviceId = $request->input('device_id');
        $interfaces = $request->input('interfaces', []);

        if (! $deviceId || ! is_array($interfaces)) {
            return response()->json([
                'success' => false,
                'message' => 'device_id dan interfaces array wajib diisi.',
            ], 422);
        }

        $device = Device::find($deviceId);
        if (! $device) {
            return response()->json(['success' => false, 'message' => 'Device not found.'], 404);
        }

        $now = now();
        $processed = 0;

        foreach ($interfaces as $ifaceData) {
            $ifIndex = $ifaceData['if_index'] ?? null;
            if ($ifIndex === null) continue;

            $name = $ifaceData['name'] ?? $ifaceData['if_name'] ?? "eth{$ifIndex}";
            $description = $ifaceData['description'] ?? $ifaceData['if_descr'] ?? null;
            $adminStatus = $ifaceData['admin_status'] ?? $ifaceData['if_admin_status'] ?? 'UP';
            $operStatus = $ifaceData['oper_status'] ?? $ifaceData['if_oper_status'] ?? 'UP';
            $speed = (int) ($ifaceData['speed'] ?? $ifaceData['if_speed'] ?? 1000000000);
            $inOctets = (int) ($ifaceData['in_octets'] ?? $ifaceData['if_in_octets'] ?? 0);
            $outOctets = (int) ($ifaceData['out_octets'] ?? $ifaceData['if_out_octets'] ?? 0);
            $inErrors = (int) ($ifaceData['in_errors'] ?? $ifaceData['if_in_errors'] ?? 0);
            $outErrors = (int) ($ifaceData['out_errors'] ?? $ifaceData['if_out_errors'] ?? 0);

            $iface = NetworkInterface::updateOrCreate(
                [
                    'device_id' => $device->id,
                    'if_index' => $ifIndex,
                ],
                [
                    'name' => $name,
                    'description' => $description,
                    'admin_status' => $adminStatus,
                    'oper_status' => $operStatus,
                    'speed' => $speed,
                    'in_octets' => $inOctets,
                    'out_octets' => $outOctets,
                    'in_errors' => $inErrors,
                    'out_errors' => $outErrors,
                ]
            );

            // Record interface metric sample
            $inputOctets = (int) ($ifaceData['input_octets'] ?? $ifaceData['in_octets_rate'] ?? $inOctets);
            $outputOctets = (int) ($ifaceData['output_octets'] ?? $ifaceData['out_octets_rate'] ?? $outOctets);
            $inputErrors = (int) ($ifaceData['input_errors'] ?? $inErrors);
            $outputErrors = (int) ($ifaceData['output_errors'] ?? $outErrors);
            $utilization = (float) ($ifaceData['utilization'] ?? max((float) ($ifaceData['in_utilization'] ?? 0), (float) ($ifaceData['out_utilization'] ?? 0)));

            InterfaceMetric::create([
                'interface_id' => $iface->id,
                'input_octets' => $inputOctets,
                'output_octets' => $outputOctets,
                'input_errors' => $inputErrors,
                'output_errors' => $outputErrors,
                'utilization' => $utilization,
                'recorded_at' => $now,
                'created_at' => $now,
            ]);

            $processed++;
        }

        return response()->json([
            'success' => true,
            'device_id' => $device->id,
            'interfaces_processed' => $processed,
            'timestamp' => $now->toIso8601String(),
        ]);
    }
}
