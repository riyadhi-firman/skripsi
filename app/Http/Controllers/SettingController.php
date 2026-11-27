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
}
