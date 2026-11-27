import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import { StatusBadge } from '../../Components/StatusBadge';
import { DeviceTypeIcon } from '../../Components/DeviceTypeIcon';
import { Device, MonitoringResult } from '../../types';
import {
    ArrowLeft,
    Activity,
    Edit2,
    Trash2,
    Power,
    Server,
    Cpu,
    HardDrive,
    Thermometer,
    Clock,
    Network,
    AlertTriangle,
    Shield,
    Terminal,
    X,
    CheckCircle2,
    XCircle,
    Loader2,
    Radio,
    Link2,
} from 'lucide-react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    AreaChart,
    Area,
} from 'recharts';
import axios from 'axios';

interface Props {
    device: Device;
    monitoringHistory: MonitoringResult[];
    canManage: boolean;
}

export default function Show({ device, monitoringHistory, canManage }: Props) {
    const [pingLoading, setPingLoading] = useState(false);
    const [pingResult, setPingResult] = useState<{
        reachable: boolean;
        latency: number | null;
        output: string;
    } | null>(null);
    const [showPingModal, setShowPingModal] = useState(false);

    const handleToggleMonitoring = () => {
        router.post(`/devices/${device.id}/toggle-monitoring`, {}, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus perangkat "${device.name}" (${device.ip_address})?`)) {
            router.delete(`/devices/${device.id}`);
        }
    };

    const runPingTest = async () => {
        setShowPingModal(true);
        setPingLoading(true);
        setPingResult(null);

        try {
            const res = await axios.post(`/devices/${device.id}/test-connection`);
            setPingResult(res.data);
        } catch (err: any) {
            setPingResult({
                reachable: false,
                latency: null,
                output: err.response?.data?.message || 'Gagal mengeksekusi tes koneksi.',
            });
        } finally {
            setPingLoading(false);
        }
    };

    // Format uptime into days, hours, mins
    const formatUptime = (seconds?: number | null) => {
        if (!seconds) return 'N/A';
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${d}h ${h}j ${m}m`;
    };

    // Prepare chart data from monitoringHistory
    const chartData = monitoringHistory.map((m) => {
        const time = new Date(m.checked_at).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return {
            time,
            latency: m.latency !== null ? Number(m.latency) : null,
            packetLoss: Number(m.packet_loss),
            cpu: m.cpu_usage !== null ? Number(m.cpu_usage) : null,
            memory: m.memory_usage !== null ? Number(m.memory_usage) : null,
        };
    });

    return (
        <AuthenticatedLayout title={`Detail: ${device.name}`}>
            <div className="space-y-6">
                {/* Back button & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/devices"
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-xl font-bold text-slate-100">{device.name}</h1>
                                <StatusBadge status={device.status} size="md" />
                            </div>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                                {device.ip_address} {device.hostname ? `• ${device.hostname}` : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={runPingTest}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
                        >
                            <Activity className="w-4 h-4 text-cyan-400" />
                            <span>Tes ICMP</span>
                        </button>

                        {canManage && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleToggleMonitoring}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                                        device.monitoring_enabled
                                            ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800'
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-950/60 hover:text-emerald-400 hover:border-emerald-800'
                                    }`}
                                >
                                    <Power className="w-4 h-4" />
                                    <span>{device.monitoring_enabled ? 'Monitoring Aktif' : 'Monitoring Mati'}</span>
                                </button>

                                <Link
                                    href={`/devices/${device.id}/edit`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4 text-amber-400" />
                                    <span>Edit</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 text-xs font-semibold rounded-xl border border-rose-800/60 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Hapus</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span>Status Jaringan</span>
                            <Radio className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="mt-2 text-base font-bold text-slate-100">
                            {device.status}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            {device.monitoring_enabled ? 'Polling aktif' : 'Polling nonaktif'}
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span>Beban CPU</span>
                            <Cpu className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="mt-2 text-base font-bold font-mono text-slate-100">
                            {device.cpu_usage !== null ? `${device.cpu_usage}%` : 'N/A'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            SNMP hrProcessorLoad
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span>Memori RAM</span>
                            <HardDrive className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="mt-2 text-base font-bold font-mono text-slate-100">
                            {device.memory_usage !== null ? `${device.memory_usage}%` : 'N/A'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            hrStorageUsed / Size
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span>Suhu Perangkat</span>
                            <Thermometer className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="mt-2 text-base font-bold font-mono text-slate-100">
                            {device.temperature != null ? `${device.temperature} °C` : 'N/A'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            Sensor Thermal
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span>Masa Aktif</span>
                            <Clock className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="mt-2 text-sm font-bold font-mono text-slate-100">
                            {formatUptime(device.uptime)}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            sysUpTimeInstance
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span>Terakhir Terlihat</span>
                            <Activity className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="mt-2 text-xs font-semibold text-slate-200">
                            {device.last_seen || device.last_checked_at
                                ? new Date((device.last_seen || device.last_checked_at) as string).toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                  })
                                : 'Belum pernah'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            Interval {device.monitoring_interval}s
                        </div>
                    </div>
                </div>

                {/* Device Specification & SNMP Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                            <Server className="w-4 h-4 text-cyan-400" />
                            <span>Informasi Fisik & Lokasi</span>
                        </h3>
                        <dl className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Tipe Perangkat:</dt>
                                <dd className="font-semibold text-slate-200">{device.device_type}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Vendor:</dt>
                                <dd className="font-semibold text-slate-200">{device.vendor || '-'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Model / Seri:</dt>
                                <dd className="font-semibold text-slate-200">{device.model || '-'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Lokasi / Gedung:</dt>
                                <dd className="font-semibold text-slate-200">{device.location || '-'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Versi Firmware / OS:</dt>
                                <dd className="font-semibold text-slate-200">{device.firmware_version || '-'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                            <Shield className="w-4 h-4 text-cyan-400" />
                            <span>Konfigurasi SNMP</span>
                        </h3>
                        <dl className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Versi SNMP:</dt>
                                <dd className="font-semibold text-cyan-400 uppercase font-mono">{device.snmp_version}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Port UDP:</dt>
                                <dd className="font-semibold font-mono text-slate-200">{device.snmp_port}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Community String:</dt>
                                <dd className="font-mono text-slate-400">•••••••• (Terenkripsi)</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Security Level:</dt>
                                <dd className="font-mono text-slate-300">{device.snmp_security_level || 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-400">Timeout / Retry:</dt>
                                <dd className="font-mono text-slate-300">{device.timeout}s / {device.retry}x</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                            <Network className="w-4 h-4 text-cyan-400" />
                            <span>Deskripsi Sistem MIB-II</span>
                        </h3>
                        <div className="space-y-2 text-xs">
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase">sysDescr:</span>
                                <p className="font-mono text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 break-words mt-1">
                                    {device.sys_descr || 'Belum diperoleh melalui SNMP'}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase">sysObjectID:</span>
                                <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                                    {device.sys_object_id || '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-Time Historical Charts */}
                {chartData.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chart 1: Latency & Packet Loss */}
                        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-200">
                                    Histori Latensi (RTT) & Packet Loss
                                </h3>
                                <span className="text-[10px] text-slate-400">50 Sampel Terakhir</span>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                                        <YAxis yAxisId="left" stroke="#06b6d4" fontSize={10} unit="ms" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={10} unit="%" domain={[0, 100]} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
                                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                        <Area yAxisId="left" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#06b6d4" fill="#06b6d420" />
                                        <Line yAxisId="right" type="step" dataKey="packetLoss" name="Packet Loss (%)" stroke="#f43f5e" strokeWidth={2} dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Chart 2: CPU & Memory Usage */}
                        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-200">
                                    Histori Beban CPU & Penggunaan Memori
                                </h3>
                                <span className="text-[10px] text-slate-400">50 Sampel Terakhir</span>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} unit="%" domain={[0, 100]} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
                                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                        <Area type="monotone" dataKey="cpu" name="CPU (%)" stroke="#38bdf8" fill="#38bdf820" />
                                        <Area type="monotone" dataKey="memory" name="RAM (%)" stroke="#a855f7" fill="#a855f720" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interfaces Table */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-2">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Network className="w-4 h-4 text-cyan-400" />
                            <h3 className="text-sm font-semibold text-slate-100">
                                Port & Antarmuka Jaringan (Interfaces MIB)
                            </h3>
                        </div>
                        <span className="text-xs text-slate-400">
                            Total {device.interfaces?.length || 0} Antarmuka
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                                <tr>
                                    <th className="py-2.5 px-4">Index</th>
                                    <th className="py-2.5 px-4">Nama Port</th>
                                    <th className="py-2.5 px-4">Deskripsi</th>
                                    <th className="py-2.5 px-4">Speed</th>
                                    <th className="py-2.5 px-4">Admin Status</th>
                                    <th className="py-2.5 px-4">Oper Status</th>
                                    <th className="py-2.5 px-4">In / Out Util</th>
                                    <th className="py-2.5 px-4">Errors</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                                {!device.interfaces || device.interfaces.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                                            Belum ada data antarmuka yang terdeteksi via SNMP ifTable.
                                        </td>
                                    </tr>
                                ) : (
                                    device.interfaces.map((iface) => (
                                        <tr key={iface.id} className="hover:bg-slate-800/30">
                                            <td className="py-3 px-4 text-slate-400">#{iface.if_index}</td>
                                            <td className="py-3 px-4 font-bold text-slate-200">{iface.if_name}</td>
                                            <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">{iface.if_descr || '-'}</td>
                                            <td className="py-3 px-4 text-slate-300">
                                                {iface.if_speed >= 1000000000
                                                    ? `${iface.if_speed / 1000000000} Gbps`
                                                    : iface.if_speed >= 1000000
                                                    ? `${iface.if_speed / 1000000} Mbps`
                                                    : `${iface.if_speed} bps`}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                                                    iface.if_admin_status === 'UP' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                                                }`}>
                                                    {iface.if_admin_status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                                                    iface.if_oper_status === 'UP' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                                                }`}>
                                                    {iface.if_oper_status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-cyan-400">↓ {iface.in_utilization}%</span>
                                                    <span className="text-slate-600">/</span>
                                                    <span className="text-indigo-400">↑ {iface.out_utilization}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`${iface.if_in_errors + iface.if_out_errors > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                                                    {iface.if_in_errors + iface.if_out_errors}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Active Alerts Table */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-2">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <h3 className="text-sm font-semibold text-slate-100">
                                Insiden & Alert Terkini
                            </h3>
                        </div>
                        <Link href="/alerts" className="text-xs text-cyan-400 hover:underline">
                            Lihat Semua Alert &rarr;
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                                <tr>
                                    <th className="py-2.5 px-4">Waktu</th>
                                    <th className="py-2.5 px-4">Tipe Alert</th>
                                    <th className="py-2.5 px-4">Tingkat Keparahan</th>
                                    <th className="py-2.5 px-4">Pesan Masalah</th>
                                    <th className="py-2.5 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                {!device.active_alerts || device.active_alerts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-emerald-400 text-xs">
                                            Tidak ada insiden atau alert aktif pada perangkat ini. Kondisi stabil.
                                        </td>
                                    </tr>
                                ) : (
                                    device.active_alerts.map((alert) => (
                                        <tr key={alert.id} className="hover:bg-slate-800/30">
                                            <td className="py-3 px-4 font-mono text-slate-400">
                                                {new Date(alert.triggered_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-slate-200">
                                                {alert.alert_type}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    alert.severity === 'CRITICAL'
                                                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                                                }`}>
                                                    {alert.severity}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-200">{alert.message}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                                                    {alert.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Topology Connections */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-slate-100">
                            Koneksi Topologi Terhubung
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Tautan Keluar (Outbound Links)
                            </h4>
                            {!device.outbound_edges || device.outbound_edges.length === 0 ? (
                                <p className="text-xs text-slate-500">Tidak ada tautan keluar terdaftar.</p>
                            ) : (
                                <ul className="space-y-2 text-xs">
                                    {device.outbound_edges.map((e) => (
                                        <li key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                                            <span>
                                                Menuju: <Link href={`/devices/${e.target_device_id}`} className="font-semibold text-cyan-400 hover:underline">{e.target_device?.name || `Perangkat #${e.target_device_id}`}</Link>
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400">{e.link_type} ({e.link_speed / 1000000} Mbps)</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Tautan Masuk (Inbound Links)
                            </h4>
                            {!device.inbound_edges || device.inbound_edges.length === 0 ? (
                                <p className="text-xs text-slate-500">Tidak ada tautan masuk terdaftar.</p>
                            ) : (
                                <ul className="space-y-2 text-xs">
                                    {device.inbound_edges.map((e) => (
                                        <li key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                                            <span>
                                                Dari: <Link href={`/devices/${e.source_device_id}`} className="font-semibold text-cyan-400 hover:underline">{e.source_device?.name || `Perangkat #${e.source_device_id}`}</Link>
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400">{e.link_type} ({e.link_speed / 1000000} Mbps)</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Test Connection */}
                {showPingModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
                        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-base font-semibold text-slate-100">
                                        Tes Koneksi ICMP: {device.name}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowPingModal(false)}
                                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="text-xs text-slate-400 flex items-center justify-between">
                                    <span>Target IP: <span className="font-mono text-slate-200">{device.ip_address}</span></span>
                                    <span>Port SNMP: <span className="font-mono text-slate-200">{device.snmp_port}</span></span>
                                </div>

                                {pingLoading && (
                                    <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
                                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                                        <p className="text-xs">Mengirim paket ICMP echo request...</p>
                                    </div>
                                )}

                                {!pingLoading && pingResult && (
                                    <div className="space-y-3">
                                        <div
                                            className={`p-3 rounded-xl border flex items-center gap-3 ${
                                                pingResult.reachable
                                                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                                                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                                            }`}
                                        >
                                            {pingResult.reachable ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                                            )}
                                            <div className="text-xs">
                                                <p className="font-semibold">
                                                    {pingResult.reachable
                                                        ? 'Perangkat Merespon (Reachable)'
                                                        : 'Perangkat Tidak Merespon (Unreachable)'}
                                                </p>
                                                {pingResult.latency !== null && (
                                                    <p className="text-[11px] opacity-90">
                                                        Round-Trip Latency: {pingResult.latency} ms
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                                Keluaran Perintah Shell:
                                            </p>
                                            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
                                                {pingResult.output}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={runPingTest}
                                    disabled={pingLoading}
                                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
                                >
                                    Ping Ulang
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPingModal(false)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
