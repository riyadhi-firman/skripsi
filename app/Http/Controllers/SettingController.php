<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display configuration settings.
     */
    public function index(): Response
    {
        $settings = Setting::orderBy('key')->get();

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update configuration settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($data['settings'] as $item) {
            Setting::set($item['key'], $item['value']);
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'SETTINGS_UPDATE',
            'module' => 'Pengaturan',
            'description' => "Memperbarui konfigurasi ambang batas monitoring",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Konfigurasi sistem berhasil diperbarui.');
    }

    /**
     * Send test notification to Telegram.
     */
    public function testTelegram(Request $request): RedirectResponse
    {
        $botToken = Setting::get('telegram_bot_token');
        $chatId = Setting::get('telegram_chat_id');

        if (empty($botToken) || empty($chatId)) {
            return back()->with('error', 'Token bot Telegram dan Chat ID harus disimpan terlebih dahulu.');
        }

        try {
            $resp = \Illuminate\Support\Facades\Http::timeout(5)->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => "🧪 <b>UBJ NETPULSE - TEST NOTIFIKASI</b>\nKoneksi bot Telegram NOC Universitas Banten Jaya berhasil terhubung!\nWaktu: " . now()->format('Y-m-d H:i:s') . " WIB",
                'parse_mode' => 'HTML',
            ]);

            if ($resp->successful()) {
                return back()->with('success', 'Pesan uji coba Telegram berhasil terkirim!');
            }

            return back()->with('error', 'Telegram API error: ' . ($resp->json('description') ?? $resp->body()));
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menghubungi Telegram: ' . $e->getMessage());
        }
    }
}
