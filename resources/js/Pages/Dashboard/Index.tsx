import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import { StatusBadge } from '../../Components/StatusBadge';
import { DeviceTypeIcon } from '../../Components/DeviceTypeIcon';
import { Device, Alert, AuditLog } from '../../types';
import {
    Activity,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Server,
    Wifi,
    Radio,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    Cpu,
    Clock,
    Eye,
    Bell,
    ChevronRight,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

interface HourlyTrend {
    time: string;
    latency: number | null;
    packet_loss: number;
    cpu: number | null;
}

interface Props {
    stats: {
        totalDevices: number;
        upCount: number;
        downCount: number;
        degradedCount: number;
        unknownCount: number;
        availability: number;
        openAlertsCount: number;
        criticalAlertsCount: number;
    };
    devices: Device[];
    recentAlerts: Alert[];
    hourlyTrends: HourlyTrend[];
    devicesByType: Record<string, number>;
    recentAudits: AuditLog[];
}

export default function Dashboard({
    stats: initialStats,
    devices: initialDevices,
    recentAlerts: initialAlerts,
    hourlyTrends,
    devicesByType,
    recentAudits,
}: Props) {
    const [devices, setDevices] = useState<Device[]>(initialDevices);
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
    const [stats, setStats] = useState(initialStats);

    // Listen to real-time events via Laravel Echo / Reverb
    useEffect(() => {
        const win = window as any;
        if (!win.Echo) return;

        // Channel: monitoring
        const channel = win.Echo.channel('monitoring');
        channel.listen('.device.updated', (event: any) => {
            const updated = event.payload;
            if (!updated) return;

            setDevices((prev) =>
                prev.map((d) =>
                    d.id === updated.id
                        ? {
                              ...d,
                              status: updated.status,
                              cpu_usage: updated.cpu_usage,
                              memory_usage: updated.memory_usage,
                              uptime: updated.uptime,
                              last_seen: updated.last_seen,
                          }
                        : d
                )
            );
        });

        // Channel: alerts
        const alertChannel = win.Echo.channel('alerts');
        alertChannel.listen('.alert.triggered', (event: any) => {
            const newAlert = event.payload;
            if (!newAlert) return;

            setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
            setStats((prev) => ({
                ...prev,
                openAlertsCount: prev.openAlertsCount + 1,
                criticalAlertsCount:
                    newAlert.severity === 'CRITICAL'
                        ? prev.criticalAlertsCount + 1
                        : prev.criticalAlertsCount,
            }));
        });

        return () => {
            channel.stopListening('.device.updated');
            alertChannel.stopListening('.alert.triggered');
        };
    }, []);

    const handleAcknowledgeAlert = (alertId: number) => {
        router.post(`/alerts/${alertId}/acknowledge`, {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout title="NOC Overview Dashboard">
            <div className="space-y-6">
                {/* Header NOC Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                                    <Radio className="w-3 h-3 animate-pulse" />
                                    <span>NOC Real-Time Active Polling</span>
                                </span>
                                <span className="text-xs text-slate-400">
                                    Universitas Banten Jaya
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                                Pusat Operasi Jaringan Kampus (NOC)
                            </h1>
                            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                                Memantau ketersediaan infrastruktur backbone kampus, router border, switch distribusi,
                                access point, dan server secara simultan menggunakan protokol ICMP Echo & SNMP v2c/v3.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href="/topology"
                                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all"
                            >
                                <Wifi className="w-4 h-4" />
                                <span>Buka Peta Topologi</span>
                            </Link>
                            <Link
                                href="/reports"
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                            >
                                Unduh Laporan SLA
                            </Link>
                        </div>
                    </div>
                </div>

                {/* KPI Overview Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* SLA Availability */}
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider">Ketersediaan (SLA)</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight font-mono text-emerald-400">
                                {stats.availability}%
                            </span>
                            <span className="text-xs text-slate-500">Uptime Global</span>
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${stats.availability}%` }}
                            />
                        </div>
                    </div>

                    {/* Devices Online */}
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider">Perangkat Aktif (UP)</span>
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight font-mono text-slate-100">
                                {stats.upCount}
                            </span>
                            <span className="text-xs text-slate-400">/ {stats.totalDevices} Terdaftar</span>
                        </div>
                        <p className="text-[11px] text-emerald-400 mt-3 flex items-center gap-1">
                            <span>Respon ICMP & SNMP Normal</span>
                        </p>
                    </div>

                    {/* Degraded & Down */}
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider">Masalah / Offline</span>
                            <XCircle className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight font-mono text-rose-400">
                                {stats.downCount}
                            </span>
                            <span className="text-xs text-amber-400">
                                + {stats.degradedCount} Degraded
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">
                            {stats.downCount > 0 ? 'Perlu tindakan perbaikan segera' : 'Tidak ada gangguan offline'}
                        </p>
                    </div>

                    {/* Open Alerts */}
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider">Insiden Terbuka</span>
                            <Bell className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight font-mono text-amber-400">
                                {stats.openAlertsCount}
                            </span>
                            {stats.criticalAlertsCount > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-semibold animate-pulse">
                                    {stats.criticalAlertsCount} Kritis
                                </span>
                            )}
                        </div>
                        <div className="mt-3 text-[11px]">
                            <Link href="/alerts" className="text-cyan-400 hover:underline flex items-center gap-1">
                                <span>Buka Manajemen Insiden</span>
                                <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Device Type Distribution */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider">
                        Komposisi Perangkat Jaringan UBJ:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        {Object.entries(devicesByType).map(([type, count]) => (
                            <div
                                key={type}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800"
                            >
                                <DeviceTypeIcon type={type} size={14} className="text-cyan-400" />
                                <span className="text-slate-300 font-medium">{type}:</span>
                                <span className="font-bold text-slate-100 font-mono">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 24-Hour Telemetry Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Latency & Packet Loss Trend */}
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-cyan-400" />
                                    <span>Tren Rata-Rata Latensi & Packet Loss (24 Jam)</span>
                                </h3>
                                <p className="text-[11px] text-slate-400">Pengukuran ICMP Round-Trip Time per jam</p>
                            </div>
                            <span className="text-[10px] text-cyan-400 font-mono">Aggregated hourly</span>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={hourlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                                    <YAxis yAxisId="left" stroke="#06b6d4" fontSize={10} unit="ms" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={10} unit="%" domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                    <Area yAxisId="left" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#06b6d4" fill="#06b6d420" />
                                    <Line yAxisId="right" type="step" dataKey="packet_loss" name="Packet Loss (%)" stroke="#f43f5e" strokeWidth={2} dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* CPU Utilization Trend */}
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-cyan-400" />
                                    <span>Tren Beban Rata-Rata CPU Perangkat (24 Jam)</span>
                                </h3>
                                <p className="text-[11px] text-slate-400">Pengukuran MIB-II hrProcessorLoad per jam</p>
                            </div>
                            <span className="text-[10px] text-cyan-400 font-mono">SNMP Walk</span>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={hourlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} unit="%" domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                    <Area type="monotone" dataKey="cpu" name="CPU Load (%)" stroke="#38bdf8" fill="#38bdf820" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Device Live Status Grid */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                <Server className="w-4 h-4 text-cyan-400" />
                                <span>Status Perangkat Jaringan Terkini</span>
                            </h3>
                            <p className="text-[11px] text-slate-400">Diperbarui otomatis secara real-time via WebSocket</p>
                        </div>
                        <Link href="/devices" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                            <span>Kelola Semua Perangkat</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {devices.map((device) => (
                            <Link
                                key={device.id}
                                href={`/devices/${device.id}`}
                                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all group block"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:text-cyan-300">
                                        <DeviceTypeIcon type={device.device_type} size={15} />
                                    </div>
                                    <StatusBadge status={device.status} size="sm" />
                                </div>

                                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                                    {device.name}
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 truncate">
                                    {device.ip_address}
                                </div>

                                <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                                    <div>
                                        <span>CPU: </span>
                                        <span className="font-mono text-slate-200 font-semibold">
                                            {device.cpu_usage !== null ? `${device.cpu_usage}%` : '-'}
                                        </span>
                                    </div>
                                    <div>
                                        <span>RAM: </span>
                                        <span className="font-mono text-slate-200 font-semibold">
                                            {device.memory_usage !== null ? `${device.memory_usage}%` : '-'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Row: Active Incidents & Audit Log Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Incidents */}
                    <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-2">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                <h3 className="text-sm font-semibold text-slate-100">
                                    Insiden & Peringatan Terkini
                                </h3>
                            </div>
                            <Link href="/alerts" className="text-xs text-cyan-400 hover:underline">
                                Semua Alert ({stats.openAlertsCount}) &rarr;
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-2.5 px-4">Perangkat</th>
                                        <th className="py-2.5 px-4">Tipe Masalah</th>
                                        <th className="py-2.5 px-4">Keparahan</th>
                                        <th className="py-2.5 px-4">Waktu Kejadian</th>
                                        <th className="py-2.5 px-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                    {alerts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-emerald-400 text-xs">
                                                Tidak ada insiden aktif saat ini. Semua perangkat beroperasi normal.
                                            </td>
                                        </tr>
                                    ) : (
                                        alerts.slice(0, 6).map((alert) => (
                                            <tr key={alert.id} className="hover:bg-slate-800/30">
                                                <td className="py-3 px-4 font-semibold text-slate-200">
                                                    {alert.device?.name || `Device #${alert.device_id}`}
                                                </td>
                                                <td className="py-3 px-4">{alert.alert_type}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                        alert.severity === 'CRITICAL'
                                                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                                                    }`}>
                                                        {alert.severity}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                                                    {new Date(alert.triggered_at).toLocaleTimeString('id-ID')}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    {alert.status === 'OPEN' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAcknowledgeAlert(alert.id)}
                                                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-semibold border border-slate-700 transition-colors"
                                                        >
                                                            Akui
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Audit Trail Feed */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <h3 className="text-sm font-semibold text-slate-100">Audit Trail Terkini</h3>
                            </div>
                            <Link href="/audit-logs" className="text-xs text-cyan-400 hover:underline">
                                Log &rarr;
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentAudits.map((log) => (
                                <div key={log.id} className="text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-200">{log.action}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-snug">{log.description}</p>
                                    <div className="text-[10px] text-cyan-400 flex items-center justify-between pt-0.5">
                                        <span>User: {log.user?.name || 'Sistem'}</span>
                                        <span>{log.module}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
