<?php

namespace App\Services;

use App\Events\AlertTriggered;
use App\Models\Alert;
use App\Models\AlertHistory;
use App\Models\Device;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AlertService
{
    /**
     * Evaluate monitoring results against alert thresholds.
     */
    public function evaluateDevice(Device $device, array $metrics): void
    {
        $latencyWarn = (float) (Setting::get('latency_warning_ms') ?? Setting::get('alert_latency_warn_ms', 100.0));
        $lossWarn = (float) (Setting::get('packet_loss_warning_pct') ?? Setting::get('alert_packet_loss_warn_pct', 10.0));
        $lossCrit = (float) (Setting::get('packet_loss_critical_pct', 20.0));
        $cpuWarn = (float) (Setting::get('cpu_warning_pct') ?? Setting::get('alert_cpu_warn_pct', 80.0));
        $cpuCrit = (float) (Setting::get('cpu_critical_pct', 90.0));
        $memWarn = (float) (Setting::get('memory_warning_pct') ?? Setting::get('alert_mem_warn_pct', 85.0));
        $memCrit = (float) (Setting::get('memory_critical_pct', 95.0));
        $tempWarn = (float) (Setting::get('temperature_warning_c', 70.0));
        $tempCrit = (float) (Setting::get('temperature_critical_c', 75.0));

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
                $sev = $loss >= $lossCrit ? 'CRITICAL' : 'WARNING';
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
                $sev = $cpu >= $cpuCrit ? 'CRITICAL' : 'WARNING';
                $this->triggerAlert(
                    $device,
                    'HIGH_CPU',
                    $sev,
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
                $sev = $mem >= $memCrit ? 'CRITICAL' : 'WARNING';
                $this->triggerAlert(
                    $device,
                    'HIGH_MEMORY',
                    $sev,
                    "Penggunaan RAM tinggi pada {$device->name}: {$mem}% (Ambang batas: {$memWarn}%)."
                );
            } else {
                $this->autoResolveAlert($device, 'HIGH_MEMORY', "Penggunaan RAM {$device->name} normal ({$mem}%).");
            }
        }

        // 6. Temperature check
        if (isset($metrics['temperature']) && $metrics['temperature'] !== null) {
            $temp = (float) $metrics['temperature'];
            if ($temp >= $tempCrit) {
                $this->triggerAlert(
                    $device,
                    'HIGH_TEMPERATURE',
                    'CRITICAL',
                    "Suhu router {$device->name} kritis: {$temp}°C (Batas bahaya: {$tempCrit}°C)."
                );
            } elseif ($temp >= $tempWarn) {
                $this->triggerAlert(
                    $device,
                    'HIGH_TEMPERATURE',
                    'WARNING',
                    "Suhu router {$device->name} tinggi: {$temp}°C (Ambang batas: {$tempWarn}°C)."
                );
            } else {
                $this->autoResolveAlert($device, 'HIGH_TEMPERATURE', "Suhu router {$device->name} kembali normal ({$temp}°C).");
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

        $title = match ($type) {
            'DEVICE_DOWN' => "Perangkat {$device->name} Tidak Merespons",
            'HIGH_LATENCY' => "Latensi Tinggi Terdeteksi pada {$device->name}",
            'PACKET_LOSS' => "Packet Loss Tinggi pada {$device->name}",
            'HIGH_CPU' => "Beban CPU Tinggi pada {$device->name}",
            'HIGH_MEMORY' => "Penggunaan Memori Tinggi pada {$device->name}",
            'HIGH_TEMPERATURE' => "Suhu Tinggi / Overheat pada {$device->name}",
            default => "Peringatan {$type} pada {$device->name}",
        };

        $alert = Alert::create([
            'device_id' => $device->id,
            'alert_type' => $type,
            'type' => $type,
            'title' => $title,
            'severity' => $severity,
            'message' => $message,
            'status' => Alert::STATUS_OPEN,
            'triggered_at' => now(),
        ]);

        AlertHistory::create([
            'alert_id' => $alert->id,
            'action' => 'TRIGGERED',
            'notes' => $message,
            'description' => $message,
        ]);

        // Broadcast real-time alert via Reverb
        try {
            broadcast(new AlertTriggered($alert));
        } catch (\Throwable $e) {
            // Fail silently if reverb is offline during polling
        }

        // Send Telegram Notification
        $icon = $severity === 'CRITICAL' ? '🚨' : '⚠️';
        $telegramMsg = "{$icon} <b>UBJ NETPULSE - NOC ALERT</b>\n"
            . "<b>Perangkat:</b> {$device->name} ({$device->ip_address})\n"
            . "<b>Severity:</b> [{$severity}]\n"
            . "<b>Tipe:</b> {$type}\n"
            . "<b>Pesan:</b> {$message}\n"
            . "<b>Waktu:</b> " . now()->format('Y-m-d H:i:s') . " WIB";
        $this->sendTelegram($telegramMsg);

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

            // Send Telegram Recovery Notification
            $telegramMsg = "✅ <b>UBJ NETPULSE - NOC RECOVERY</b>\n"
                . "<b>Perangkat:</b> {$device->name} ({$device->ip_address})\n"
                . "<b>Status:</b> RESOLVED ({$type})\n"
                . "<b>Keterangan:</b> {$notes}\n"
                . "<b>Waktu:</b> " . now()->format('Y-m-d H:i:s') . " WIB";
            $this->sendTelegram($telegramMsg);
        }
    }

    /**
     * Send instant message to Telegram Bot channel/group.
     */
    public function sendTelegram(string $message): void
    {
        $enabled = Setting::get('telegram_enabled', 'false');
        if (! in_array(strtolower((string) $enabled), ['true', '1', 'yes', 'on'], true)) {
            return;
        }

        $botToken = Setting::get('telegram_bot_token');
        $chatId = Setting::get('telegram_chat_id');

        if (empty($botToken) || empty($chatId)) {
            return;
        }

        try {
            Http::timeout(5)->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => true,
            ]);
        } catch (\Throwable $e) {
            Log::warning('[TelegramBot] Gagal mengirim pesan notifikasi: ' . $e->getMessage());
        }
    }
}
