import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import {
    Sliders,
    Save,
    Shield,
    Activity,
    Cpu,
    Radio,
    Clock,
    KeyRound,
    Check,
    AlertCircle,
    RotateCcw,
    Thermometer,
    Send,
} from 'lucide-react';

interface SettingItem {
    id: number;
    key: string;
    value: string;
    type: string;
    description: string;
}

interface Props {
    settings: SettingItem[];
}

export default function SettingsIndex({ settings: initialSettings }: Props) {
    const [settings, setSettings] = useState<Record<string, string>>(() => {
        const map: Record<string, string> = {};
        initialSettings.forEach((s) => {
            map[s.key] = s.value ?? '';
        });
        return map;
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isTestingTelegram, setIsTestingTelegram] = useState(false);

    const handleChange = (key: string, value: string) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleTestTelegram = () => {
        setIsTestingTelegram(true);
        router.post(
            '/settings/test-telegram',
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsTestingTelegram(false),
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const payload = Object.entries(settings).map(([key, value]) => ({
            key,
            value,
        }));

        router.post(
            '/settings',
            { settings: payload },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            }
        );
    };

    return (
        <AuthenticatedLayout title="Pengaturan & Ambang Batas Monitoring">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <Sliders className="w-5 h-5 text-cyan-400" />
                            <span>Pengaturan Parameter & Ambang Batas (Thresholds)</span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Konfigurasi batas toleransi SLA, ambang pemicu peringatan otomatis, dan kredensial komunikasi engine Golang.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="self-start md:self-auto px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/40 flex items-center gap-2 transition-all"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
                    </button>
                </div>

                {/* Section 1: ICMP Network Performance Thresholds */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <h2 className="text-sm font-bold text-slate-100">
                            Ambang Batas Performa Jaringan (ICMP Ping)
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Latency Warning Threshold (ms)
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={settings['latency_warning_ms'] || ''}
                                onChange={(e) => handleChange('latency_warning_ms', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Pemicu status DEGRADED jika RTT melewati nilai ini (standar UBJ: 50 ms)
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Latency Critical Threshold (ms)
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={settings['latency_critical_ms'] || ''}
                                onChange={(e) => handleChange('latency_critical_ms', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Pemicu insiden CRITICAL jika RTT melewati nilai ini (standar UBJ: 150 ms)
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Packet Loss Warning (%)
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={settings['packet_loss_warning_pct'] || ''}
                                onChange={(e) => handleChange('packet_loss_warning_pct', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="0"
                                max="100"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Toleransi kehilangan paket peringatan (standar: 5%)
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Packet Loss Critical (%)
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={settings['packet_loss_critical_pct'] || ''}
                                onChange={(e) => handleChange('packet_loss_critical_pct', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="0"
                                max="100"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Persentase paket loss pemicu alarm kritis (standar: 20%)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Hardware SNMP Resource Utilization Thresholds */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <h2 className="text-sm font-bold text-slate-100">
                            Ambang Batas Utilisasi Hardware (SNMP Resources)
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                CPU Warning Threshold (%)
                            </label>
                            <input
                                type="number"
                                value={settings['cpu_warning_pct'] || ''}
                                onChange={(e) => handleChange('cpu_warning_pct', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="1"
                                max="100"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Peringatan jika beban prosesor perangkat &gt; nilai ini (default: 75%)
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                CPU Critical Threshold (%)
                            </label>
                            <input
                                type="number"
                                value={settings['cpu_critical_pct'] || ''}
                                onChange={(e) => handleChange('cpu_critical_pct', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="1"
                                max="100"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Alarm kritis jika CPU mendekati overload (default: 90%)
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Memory Warning Threshold (%)
                            </label>
                            <input
                                type="number"
                                value={settings['memory_warning_pct'] || ''}
                                onChange={(e) => handleChange('memory_warning_pct', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="1"
                                max="100"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Peringatan konsumsi RAM perangkat (default: 80%)
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Memory Critical Threshold (%)
                            </label>
                            <input
                                type="number"
                                value={settings['memory_critical_pct'] || ''}
                                onChange={(e) => handleChange('memory_critical_pct', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="1"
                                max="100"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Alarm memori kritis perangkat (default: 95%)
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium flex items-center gap-1">
                                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                                <span>Temperature Warning Threshold (°C)</span>
                            </label>
                            <input
                                type="number"
                                value={settings['temperature_warning_c'] || ''}
                                onChange={(e) => handleChange('temperature_warning_c', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="20"
                                max="120"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Peringatan jika suhu router mencapai batas ini (default: 70°C)
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium flex items-center gap-1">
                                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                                <span>Temperature Critical Threshold (°C)</span>
                            </label>
                            <input
                                type="number"
                                value={settings['temperature_critical_c'] || ''}
                                onChange={(e) => handleChange('temperature_critical_c', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="20"
                                max="120"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Alarm kritis jika suhu router terancam overheat (default: 75°C)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section 3: Telegram Notification Bot */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <Send className="w-4 h-4 text-cyan-400" />
                            <h2 className="text-sm font-bold text-slate-100">
                                Notifikasi Otomatis Bot Telegram
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleTestTelegram}
                            disabled={isTestingTelegram}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-medium transition disabled:opacity-50"
                        >
                            <Send className="w-3 h-3" />
                            <span>{isTestingTelegram ? 'Mengirim...' : 'Uji Coba Kirim Pesan'}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Status Integrasi Telegram
                            </label>
                            <select
                                value={settings['telegram_enabled'] || 'false'}
                                onChange={(e) => handleChange('telegram_enabled', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                            >
                                <option value="true">Aktif (Enabled)</option>
                                <option value="false">Nonaktif (Disabled)</option>
                            </select>
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Mengirim alert langsung ke grup/channel NOC saat insiden terdeteksi
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Telegram Bot Token
                            </label>
                            <input
                                type="password"
                                value={settings['telegram_bot_token'] || ''}
                                onChange={(e) => handleChange('telegram_bot_token', e.target.value)}
                                placeholder="123456789:ABCdefGHIjklMNOpqrs"
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Dibuat melalui @BotFather di aplikasi Telegram
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Telegram Chat / Group ID
                            </label>
                            <input
                                type="text"
                                value={settings['telegram_chat_id'] || ''}
                                onChange={(e) => handleChange('telegram_chat_id', e.target.value)}
                                placeholder="-1001234567890 atau user ID"
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                ID grup/channel (gunakan @userinfobot atau @getidsbot)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section 4: Monitoring Engine Token & Polling Schedule */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                        <KeyRound className="w-4 h-4 text-cyan-400" />
                        <h2 className="text-sm font-bold text-slate-100">
                            Konfigurasi Engine Polling Golang
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Monitoring Ingestion API Token
                            </label>
                            <input
                                type="text"
                                value={settings['monitoring_api_token'] || ''}
                                onChange={(e) => handleChange('monitoring_api_token', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Secret Bearer token untuk autentikasi endpoint /api/monitoring/*
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Default Polling Interval (Detik)
                            </label>
                            <input
                                type="number"
                                value={settings['default_polling_interval'] || ''}
                                onChange={(e) => handleChange('default_polling_interval', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="5"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Siklus default pengulangan polling per perangkat (default: 30 detik)
                            </span>
                        </div>

                        <div>
                            <label className="block text-slate-300 mb-1 font-medium">
                                Retensi Data Histori (Hari)
                            </label>
                            <input
                                type="number"
                                value={settings['data_retention_days'] || '14'}
                                onChange={(e) => handleChange('data_retention_days', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                min="1"
                                max="365"
                                required
                            />
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                Data metriks lebih lama dari ini akan dibersihkan otomatis (pruned)
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
