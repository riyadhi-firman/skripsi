<?php

namespace App\Services;

use App\Events\AlertTriggered;
use App\Models\Alert;
use App\Models\AlertHistory;
use App\Models\Device;
use App\Models\Setting;

class AlertService
{
    /**
     * Evaluate monitoring results against alert thresholds.
     */
    public function evaluateDevice(Device $device, array $metrics): void
    {
        $latencyWarn = (float) Setting::get('alert_latency_warn_ms', 150.0);
        $lossWarn = (float) Setting::get('alert_packet_loss_warn_pct', 10.0);
        $cpuWarn = (float) Setting::get('alert_cpu_warn_pct', 85.0);
        $memWarn = (float) Setting::get('alert_mem_warn_pct', 90.0);

        // 1. Device UP / DOWN state
        if ($device->status === 'DOWN') {
            $this->triggerAlert(
                $device,
                'DEVICE_DOWN',
                'CRITICAL',
                "Perangkat {$device->name} ({$device->ip_address}) tidak merespon (DOWN / Unreachable)."
            );
        } else {
            // Auto resolve DEVICE_DOWN if now UP or DEGRADED
            $this->autoResolveAlert($device, 'DEVICE_DOWN', "Perangkat {$device->name} kembali aktif (UP).");
        }

        // 2. Latency check
        if (isset($metrics['latency']) && $metrics['latency'] !== null) {
            $lat = (float) $metrics['latency'];
            if ($lat >= $latencyWarn) {
                $this->triggerAlert(
                    $device,
                    'HIGH_LATENCY',
                    'WARNING',
                    "Latensi tinggi terdeteksi pada {$device->name}: {$lat} ms (Ambang batas: {$latencyWarn} ms)."
                );
            } else {
                $this->autoResolveAlert($device, 'HIGH_LATENCY', "Latensi {$device->name} kembali normal ({$lat} ms).");
            }
        }

        // 3. Packet loss check
        if (isset($metrics['packet_loss']) && $metrics['packet_loss'] !== null) {
            $loss = (float) $metrics['packet_loss'];
            if ($loss >= $lossWarn && $device->status !== 'DOWN') {
                $sev = $loss >= 50.0 ? 'CRITICAL' : 'WARNING';
                $this->triggerAlert(
                    $device,
                    'PACKET_LOSS',
                    $sev,
                    "Packet loss sebesar {$loss}% terdeteksi pada {$device->name} (Ambang batas: {$lossWarn}%)."
                );
            } elseif ($loss < $lossWarn) {
                $this->autoResolveAlert($device, 'PACKET_LOSS', "Packet loss {$device->name} kembali normal ({$loss}%).");
            }
        }

        // 4. CPU usage check
        if (isset($metrics['cpu_usage']) && $metrics['cpu_usage'] !== null) {
            $cpu = (float) $metrics['cpu_usage'];
            if ($cpu >= $cpuWarn) {
                $this->triggerAlert(
                    $device,
                    'HIGH_CPU',
                    'WARNING',
                    "Beban CPU tinggi pada {$device->name}: {$cpu}% (Ambang batas: {$cpuWarn}%)."
                );
            } else {
                $this->autoResolveAlert($device, 'HIGH_CPU', "Beban CPU {$device->name} normal ({$cpu}%).");
            }
        }

        // 5. Memory usage check
        if (isset($metrics['memory_usage']) && $metrics['memory_usage'] !== null) {
            $mem = (float) $metrics['memory_usage'];
            if ($mem >= $memWarn) {
                $this->triggerAlert(
                    $device,
                    'HIGH_MEMORY',
                    'WARNING',
                    "Penggunaan RAM tinggi pada {$device->name}: {$mem}% (Ambang batas: {$memWarn}%)."
                );
            } else {
                $this->autoResolveAlert($device, 'HIGH_MEMORY', "Penggunaan RAM {$device->name} normal ({$mem}%).");
            }
        }
    }

    /**
     * Trigger alert with deduplication.
     */
    public function triggerAlert(Device $device, string $type, string $severity, string $message): Alert
    {
        // Deduplication: Check if there is an existing OPEN or ACKNOWLEDGED alert for this device and type
        $existing = Alert::where('device_id', $device->id)
            ->where('alert_type', $type)
            ->whereIn('status', [Alert::STATUS_OPEN, Alert::STATUS_ACKNOWLEDGED])
            ->first();

        if ($existing) {
            // Update message and severity if escalated
            if ($severity === 'CRITICAL' && $existing->severity !== 'CRITICAL') {
                $existing->severity = 'CRITICAL';
            }
            $existing->message = $message;
            $existing->save();
            return $existing;
        }

        $alert = Alert::create([
            'device_id' => $device->id,
            'alert_type' => $type,
            'severity' => $severity,
            'message' => $message,
            'status' => Alert::STATUS_OPEN,
            'triggered_at' => now(),
        ]);

        AlertHistory::create([
            'alert_id' => $alert->id,
            'action' => 'TRIGGERED',
            'notes' => $message,
        ]);

        // Broadcast real-time alert via Reverb
        try {
            broadcast(new AlertTriggered($alert));
        } catch (\Throwable $e) {
            // Fail silently if reverb is offline during polling
        }

        return $alert;
    }

    /**
     * Auto resolve existing open alert when condition clears.
     */
    public function autoResolveAlert(Device $device, string $type, string $notes): void
    {
        $alerts = Alert::where('device_id', $device->id)
            ->where('alert_type', $type)
            ->whereIn('status', [Alert::STATUS_OPEN, Alert::STATUS_ACKNOWLEDGED])
            ->get();

        foreach ($alerts as $alert) {
            $alert->update([
                'status' => Alert::STATUS_RESOLVED,
                'resolved_at' => now(),
                'notes' => $notes,
            ]);

            AlertHistory::create([
                'alert_id' => $alert->id,
                'action' => 'RESOLVED',
                'notes' => $notes,
            ]);
        }
    }
}
