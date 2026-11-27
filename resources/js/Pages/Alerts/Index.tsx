import React, { useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import { Alert, Device } from '../../types';
import {
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    Clock,
    Search,
    Filter,
    Check,
    CheckCheck,
    X,
    FileText,
    ChevronLeft,
    ChevronRight,
    Server,
    Info,
    RefreshCw,
} from 'lucide-react';

interface PaginatedAlerts {
    data: Alert[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    alerts: PaginatedAlerts;
    filters: {
        status?: string;
        severity?: string;
        device_id?: string;
        search?: string;
    };
    devices: { id: number; name: string; ip_address: string }[];
    counts: {
        open: number;
        critical: number;
        warning: number;
        acknowledged: number;
        resolved: number;
    };
}

export default function AlertsIndex({ alerts, filters, devices, counts }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [severity, setSeverity] = useState(filters.severity || '');
    const [deviceId, setDeviceId] = useState(filters.device_id || '');

    // Resolve Modal
    const [resolvingAlert, setResolvingAlert] = useState<Alert | null>(null);
    const [resolveNotes, setResolveNotes] = useState('');

    // History Modal
    const [viewingHistory, setViewingHistory] = useState<Alert | null>(null);

    // Real-time listener for new alerts
    useEffect(() => {
        const win = window as any;
        if (!win.Echo) return;

        const channel = win.Echo.channel('alerts');
        channel.listen('.alert.triggered', () => {
            router.reload({ preserveScroll: true });
        });

        return () => {
            channel.stopListening('.alert.triggered');
        };
    }, []);

    const applyFilters = () => {
        router.get(
            '/alerts',
            {
                search: search || undefined,
                status: status || undefined,
                severity: severity || undefined,
                device_id: deviceId || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleAcknowledge = (alertId: number) => {
        router.post(`/alerts/${alertId}/acknowledge`, {}, { preserveScroll: true });
    };

    const handleResolveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resolvingAlert) return;

        router.post(
            `/alerts/${resolvingAlert.id}/resolve`,
            { notes: resolveNotes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setResolvingAlert(null);
                    setResolveNotes('');
                },
            }
        );
    };

    return (
        <AuthenticatedLayout title="Manajemen Insiden & Alert">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <span>Pusat Manajemen Insiden & Alert Jaringan</span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Deteksi anomali real-time berdasarkan batas ambang latensi, packet loss, dan utilisasi resource.
                        </p>
                    </div>

                    <button
                        onClick={() => router.reload()}
                        className="self-start md:self-auto px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Segarkan Data</span>
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div
                        onClick={() => { setStatus('OPEN'); setSeverity(''); }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            status === 'OPEN' && !severity
                                ? 'bg-cyan-950/40 border-cyan-500'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Insiden Terbuka
                        </span>
                        <span className="text-2xl font-extrabold font-mono text-cyan-400 mt-1 block">
                            {counts.open}
                        </span>
                    </div>

                    <div
                        onClick={() => { setStatus('OPEN'); setSeverity('CRITICAL'); }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            status === 'OPEN' && severity === 'CRITICAL'
                                ? 'bg-rose-950/40 border-rose-500'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                        <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block">
                            Kritis (Critical)
                        </span>
                        <span className="text-2xl font-extrabold font-mono text-rose-400 mt-1 block">
                            {counts.critical}
                        </span>
                    </div>

                    <div
                        onClick={() => { setStatus('OPEN'); setSeverity('WARNING'); }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            status === 'OPEN' && severity === 'WARNING'
                                ? 'bg-amber-950/40 border-amber-500'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                        <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                            Peringatan (Warning)
                        </span>
                        <span className="text-2xl font-extrabold font-mono text-amber-400 mt-1 block">
                            {counts.warning}
                        </span>
                    </div>

                    <div
                        onClick={() => { setStatus('ACKNOWLEDGED'); setSeverity(''); }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            status === 'ACKNOWLEDGED'
                                ? 'bg-blue-950/40 border-blue-500'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                        <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block">
                            Diakui (In Progress)
                        </span>
                        <span className="text-2xl font-extrabold font-mono text-blue-400 mt-1 block">
                            {counts.acknowledged}
                        </span>
                    </div>

                    <div
                        onClick={() => { setStatus('RESOLVED'); setSeverity(''); }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            status === 'RESOLVED'
                                ? 'bg-emerald-950/40 border-emerald-500'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                            Selesai (Resolved)
                        </span>
                        <span className="text-2xl font-extrabold font-mono text-emerald-400 mt-1 block">
                            {counts.resolved}
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            placeholder="Cari pesan alert, tipe masalah, atau nama perangkat..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                        <option value="">Semua Status</option>
                        <option value="OPEN">OPEN (Belum Ditangani)</option>
                        <option value="ACKNOWLEDGED">ACKNOWLEDGED (Sedang Diproses)</option>
                        <option value="RESOLVED">RESOLVED (Terselesaikan)</option>
                    </select>

                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                        <option value="">Semua Keparahan</option>
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="WARNING">WARNING</option>
                        <option value="INFO">INFO</option>
                    </select>

                    <select
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 max-w-[200px]"
                    >
                        <option value="">Semua Perangkat</option>
                        {devices.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name} ({d.ip_address})
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={applyFilters}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors"
                    >
                        Terapkan Filter
                    </button>

                    {(search || status || severity || deviceId) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setStatus('');
                                setSeverity('');
                                setDeviceId('');
                                router.get('/alerts');
                            }}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Alerts Table */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">Perangkat</th>
                                    <th className="py-3 px-4">Tipe Alert</th>
                                    <th className="py-3 px-4">Keparahan</th>
                                    <th className="py-3 px-4">Pesan & Detail</th>
                                    <th className="py-3 px-4">Waktu Terpicu</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Aksi Penanganan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                {alerts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-500">
                                            Tidak ada riwayat alert yang cocok dengan filter yang dipilih.
                                        </td>
                                    </tr>
                                ) : (
                                    alerts.data.map((alert) => (
                                        <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-slate-100">
                                                <Link
                                                    href={`/devices/${alert.device_id}`}
                                                    className="hover:text-cyan-400 transition-colors"
                                                >
                                                    {alert.device?.name || `Device #${alert.device_id}`}
                                                </Link>
                                                <div className="text-[11px] font-mono text-slate-500">
                                                    {alert.device?.ip_address}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                                                {alert.alert_type}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                        alert.severity === 'CRITICAL'
                                                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                                            : alert.severity === 'WARNING'
                                                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                                            : 'bg-blue-950 text-blue-400 border border-blue-800'
                                                    }`}
                                                >
                                                    {alert.severity}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 max-w-sm">
                                                <div className="truncate text-slate-200 font-medium">
                                                    {alert.message}
                                                </div>
                                                {alert.notes && (
                                                    <div className="text-[11px] text-cyan-400 truncate mt-0.5">
                                                        Catatan: {alert.notes}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                                                {new Date(alert.triggered_at).toLocaleString('id-ID')}
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                        alert.status === 'OPEN'
                                                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                                            : alert.status === 'ACKNOWLEDGED'
                                                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                                    }`}
                                                >
                                                    {alert.status}
                                                </span>
                                                {alert.acknowledged_user && (
                                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                                        by {alert.acknowledged_user.name}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                                                {alert.status === 'OPEN' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAcknowledge(alert.id)}
                                                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        <span>Akui</span>
                                                    </button>
                                                )}

                                                {alert.status !== 'RESOLVED' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setResolvingAlert(alert);
                                                            setResolveNotes('');
                                                        }}
                                                        className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <CheckCheck className="w-3 h-3" />
                                                        <span>Selesaikan</span>
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => setViewingHistory(alert)}
                                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg transition-colors"
                                                    title="Riwayat Penanganan"
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {alerts.last_page > 1 && (
                        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                            <div>
                                Halaman {alerts.current_page} dari {alerts.last_page} &bull; Total {alerts.total} Insiden
                            </div>
                            <div className="flex items-center gap-2">
                                {alerts.prev_page_url && (
                                    <Link
                                        href={alerts.prev_page_url}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                        <span>Sebelumnya</span>
                                    </Link>
                                )}
                                {alerts.next_page_url && (
                                    <Link
                                        href={alerts.next_page_url}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1"
                                    >
                                        <span>Berikutnya</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Resolve Modal */}
                {resolvingAlert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                                    <span>Selesaikan Alert #{resolvingAlert.id}</span>
                                </h3>
                                <button
                                    onClick={() => setResolvingAlert(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-400">
                                Perangkat: <strong className="text-slate-200">{resolvingAlert.device?.name}</strong> ({resolvingAlert.device?.ip_address})
                                <br />
                                Pesan: <span className="text-slate-300">{resolvingAlert.message}</span>
                            </p>

                            <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">
                                        Catatan Penanganan & Tindakan Perbaikan
                                    </label>
                                    <textarea
                                        value={resolveNotes}
                                        onChange={(e) => setResolveNotes(e.target.value)}
                                        rows={3}
                                        placeholder="Contoh: Kabel patch diganti, link UP kembali stabil. Routing di-reset."
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setResolvingAlert(null)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950/40"
                                    >
                                        Tandai Selesai
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* History Modal */}
                {viewingHistory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-cyan-400" />
                                    <span>Riwayat Penanganan Alert #{viewingHistory.id}</span>
                                </h3>
                                <button
                                    onClick={() => setViewingHistory(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs max-h-96 overflow-y-auto pr-1">
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                                    <span className="font-semibold text-rose-400">TRIGGERED (Otomatis Sistem)</span>
                                    <div className="text-slate-300">{viewingHistory.message}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                        {new Date(viewingHistory.triggered_at).toLocaleString('id-ID')}
                                    </div>
                                </div>

                                {viewingHistory.histories?.map((h) => (
                                    <div key={h.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-cyan-400">{h.action}</span>
                                            <span className="text-[10px] text-slate-500 font-mono">
                                                {new Date(h.created_at).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="text-slate-300">{h.notes}</div>
                                        {h.user && (
                                            <div className="text-[10px] text-slate-500">
                                                Oleh: {h.user.name} ({h.user.email})
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
