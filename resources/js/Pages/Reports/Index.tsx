import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import { DeviceTypeIcon } from '../../Components/DeviceTypeIcon';
import { StatusBadge } from '../../Components/StatusBadge';
import {
    FileBarChart,
    Download,
    Calendar,
    Activity,
    ShieldCheck,
    AlertOctagon,
    Percent,
    Server,
    Clock,
    Filter,
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

interface DailyTrend {
    date: string;
    latency: number;
    packet_loss: number;
    uptime_pct: number;
}

interface DeviceSla {
    id: number;
    name: string;
    ip_address: string;
    device_type: string;
    uptime_pct: number;
    avg_latency: number;
    avg_packet_loss: number;
    status: string;
}

interface Props {
    summary: {
        days: number;
        totalChecks: number;
        uptimePct: number;
        avgLatency: number;
        avgPacketLoss: number;
    };
    dailyTrends: DailyTrend[];
    deviceSla: DeviceSla[];
    devices: { id: number; name: string; ip_address: string }[];
    selectedDeviceId?: string;
}

export default function ReportsIndex({
    summary,
    dailyTrends,
    deviceSla,
    devices,
    selectedDeviceId,
}: Props) {
    const [range, setRange] = useState(String(summary.days));
    const [deviceId, setDeviceId] = useState(selectedDeviceId || '');

    const handleFilterChange = (newRange: string, newDeviceId: string) => {
        router.get(
            '/reports',
            {
                range: newRange,
                device_id: newDeviceId || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleExportCsv = () => {
        const params = new URLSearchParams();
        params.append('range', range);
        if (deviceId) params.append('device_id', deviceId);

        window.location.href = `/reports/export-csv?${params.toString()}`;
    };

    return (
        <AuthenticatedLayout title="Laporan Kinerja & SLA">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <FileBarChart className="w-5 h-5 text-cyan-400" />
                            <span>Laporan Kinerja Jaringan & Service Level Agreement (SLA)</span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Analisis komprehensif ketersediaan (uptime), latensi, packet loss, dan export dataset telemetri untuk kebutuhan skripsi.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleExportCsv}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export Data CSV</span>
                        </button>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400 font-medium">Rentang Waktu:</span>
                        </div>

                        {[
                            { label: '24 Jam Terakhir', value: '1' },
                            { label: '7 Hari', value: '7' },
                            { label: '30 Hari', value: '30' },
                            { label: '90 Hari', value: '90' },
                        ].map((btn) => (
                            <button
                                key={btn.value}
                                type="button"
                                onClick={() => {
                                    setRange(btn.value);
                                    handleFilterChange(btn.value, deviceId);
                                }}
                                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                                    range === btn.value
                                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-medium">Filter Perangkat:</span>
                        <select
                            value={deviceId}
                            onChange={(e) => {
                                setDeviceId(e.target.value);
                                handleFilterChange(range, e.target.value);
                            }}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                        >
                            <option value="">Semua Perangkat Kampus</option>
                            {devices.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} ({d.ip_address})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Summary KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider">Ketersediaan (SLA)</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="mt-3 text-3xl font-extrabold font-mono text-emerald-400">
                            {summary.uptimePct}%
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">Target SLA Minimum: 99.00%</p>
                    </div>

                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider">Rata-Rata Latensi</span>
                            <Activity className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="mt-3 text-3xl font-extrabold font-mono text-cyan-400">
                            {summary.avgLatency} <span className="text-sm font-sans text-slate-500">ms</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">Kategori ITU-T: Sangat Bagus (&lt; 150ms)</p>
                    </div>

                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider">Rata-Rata Packet Loss</span>
                            <AlertOctagon className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="mt-3 text-3xl font-extrabold font-mono text-rose-400">
                            {summary.avgPacketLoss}%
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">Standar THIPLO: &lt; 3%</p>
                    </div>

                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 text-xs">
                            <span className="font-semibold uppercase tracking-wider">Total Sample Pengujian</span>
                            <Clock className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="mt-3 text-3xl font-extrabold font-mono text-slate-100">
                            {summary.totalChecks.toLocaleString('id-ID')}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">Dataset Polling ICMP & SNMP</p>
                    </div>
                </div>

                {/* Telemetry Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SLA Uptime Daily Trend */}
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Tren Ketersediaan Harian (%)</span>
                            </h3>
                            <p className="text-[11px] text-slate-400">Persentase status UP per hari</p>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                                    <YAxis stroke="#10b981" fontSize={10} domain={[90, 100]} unit="%" />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
                                    <Area type="monotone" dataKey="uptime_pct" name="Uptime SLA (%)" stroke="#10b981" fill="#10b98125" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Latency & Loss Daily Trend */}
                    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                <span>Tren Rata-Rata Latensi & Packet Loss Harian</span>
                            </h3>
                            <p className="text-[11px] text-slate-400">Performa transmisi paket data</p>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                                    <YAxis yAxisId="left" stroke="#06b6d4" fontSize={10} unit="ms" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={10} unit="%" />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                                    <Line yAxisId="left" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#06b6d4" strokeWidth={2} />
                                    <Line yAxisId="right" type="step" dataKey="packet_loss" name="Packet Loss (%)" stroke="#f43f5e" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Device SLA Breakdown Table */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-cyan-400" />
                            <h3 className="text-sm font-semibold text-slate-100">
                                Rincian Ketersediaan SLA per Perangkat
                            </h3>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                            {deviceSla.length} Perangkat Teranalisis
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">Perangkat</th>
                                    <th className="py-3 px-4">Tipe</th>
                                    <th className="py-3 px-4">Status Terkini</th>
                                    <th className="py-3 px-4">Ketersediaan (Uptime %)</th>
                                    <th className="py-3 px-4">Rata-Rata Latensi</th>
                                    <th className="py-3 px-4">Rata-Rata Packet Loss</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                {deviceSla.map((dev) => (
                                    <tr key={dev.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="py-3.5 px-4 font-semibold text-slate-100">
                                            <div>{dev.name}</div>
                                            <div className="text-[11px] font-mono text-slate-500">{dev.ip_address}</div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <DeviceTypeIcon type={dev.device_type} size={14} className="text-cyan-400" />
                                                <span>{dev.device_type}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <StatusBadge status={dev.status} size="sm" />
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-mono font-bold ${
                                                    dev.uptime_pct >= 99.0 ? 'text-emerald-400' : dev.uptime_pct >= 95.0 ? 'text-amber-400' : 'text-rose-400'
                                                }`}>
                                                    {dev.uptime_pct}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-slate-200">
                                            {dev.avg_latency} ms
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-slate-200">
                                            {dev.avg_packet_loss}%
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <Link
                                                href={`/devices/${dev.id}`}
                                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700 font-semibold"
                                            >
                                                Telemetri
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
