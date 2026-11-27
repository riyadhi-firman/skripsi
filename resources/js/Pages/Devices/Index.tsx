import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import { StatusBadge } from '../../Components/StatusBadge';
import { DeviceTypeIcon } from '../../Components/DeviceTypeIcon';
import { Device, PaginatedData } from '../../types';
import {
    Plus,
    Search,
    Filter,
    Activity,
    Edit2,
    Trash2,
    Eye,
    Power,
    Radio,
    Terminal,
    X,
    CheckCircle2,
    XCircle,
    Loader2,
} from 'lucide-react';
import axios from 'axios';

interface Props {
    devices: PaginatedData<Device>;
    filters: {
        search?: string;
        status?: string;
        device_type?: string;
        vendor?: string;
        location?: string;
    };
    deviceTypes: string[];
    vendors: string[];
    locations: string[];
    canManage: boolean;
}

export default function Index({ devices, filters, deviceTypes, vendors, locations, canManage }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [deviceType, setDeviceType] = useState(filters.device_type || '');
    const [vendor, setVendor] = useState(filters.vendor || '');
    const [location, setLocation] = useState(filters.location || '');

    // Ping test state
    const [pingTarget, setPingTarget] = useState<Device | null>(null);
    const [pingLoading, setPingLoading] = useState(false);
    const [pingResult, setPingResult] = useState<{
        reachable: boolean;
        latency: number | null;
        output: string;
    } | null>(null);

    const handleFilter = () => {
        router.get(
            '/devices',
            {
                search: search || undefined,
                status: status || undefined,
                device_type: deviceType || undefined,
                vendor: vendor || undefined,
                location: location || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setDeviceType('');
        setVendor('');
        setLocation('');
        router.get('/devices');
    };

    const handleToggleMonitoring = (device: Device) => {
        router.post(`/devices/${device.id}/toggle-monitoring`, {}, { preserveScroll: true });
    };

    const handleDelete = (device: Device) => {
        if (confirm(`Apakah Anda yakin ingin menghapus perangkat "${device.name}" (${device.ip_address})?`)) {
            router.delete(`/devices/${device.id}`);
        }
    };

    const runPingTest = async (device: Device) => {
        setPingTarget(device);
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

    return (
        <AuthenticatedLayout title="Manajemen Perangkat Jaringan">
            <div className="space-y-6">
                {/* Header & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <span>Perangkat Terkelola</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                                Total: {devices.total}
                            </span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Daftar perangkat jaringan inti, router, switch, firewall, dan server Universitas Banten Jaya
                        </p>
                    </div>

                    {canManage && (
                        <Link
                            href="/devices/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-950/40 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Perangkat</span>
                        </Link>
                    )}
                </div>

                {/* Filter & Search Bar */}
                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari nama, IP, host, lokasi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                            />
                        </div>

                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                            >
                                <option value="">Semua Status</option>
                                <option value="UP">UP (Online)</option>
                                <option value="DOWN">DOWN (Offline)</option>
                                <option value="DEGRADED">DEGRADED (Kritis)</option>
                                <option value="UNKNOWN">UNKNOWN</option>
                            </select>
                        </div>

                        <div>
                            <select
                                value={deviceType}
                                onChange={(e) => setDeviceType(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                            >
                                <option value="">Semua Tipe Perangkat</option>
                                {deviceTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={vendor}
                                onChange={(e) => setVendor(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                            >
                                <option value="">Semua Vendor</option>
                                {vendors.map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleFilter}
                                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Filter</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs rounded-xl border border-slate-800 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Device Table */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">Perangkat</th>
                                    <th className="py-3 px-4">Alamat IP / Host</th>
                                    <th className="py-3 px-4">Tipe & Vendor</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">CPU / RAM</th>
                                    <th className="py-3 px-4">Lokasi</th>
                                    <th className="py-3 px-4">Monitoring</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                {devices.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-500">
                                            Tidak ada perangkat yang sesuai dengan kriteria pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    devices.data.map((device) => (
                                        <tr key={device.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3.5 px-4 font-medium text-slate-200">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-cyan-400">
                                                        <DeviceTypeIcon type={device.device_type} size={16} />
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/devices/${device.id}`}
                                                            className="hover:text-cyan-400 transition-colors font-semibold"
                                                        >
                                                            {device.name}
                                                        </Link>
                                                        {device.interfaces_count !== undefined && (
                                                            <p className="text-[10px] text-slate-500">
                                                                {device.interfaces_count} Interface terdeteksi
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono">
                                                <div className="text-slate-200">{device.ip_address}</div>
                                                <div className="text-[10px] text-slate-500">{device.hostname || '-'}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div>{device.device_type}</div>
                                                <div className="text-[10px] text-slate-500">
                                                    {device.vendor || 'Generic'} {device.model ? `(${device.model})` : ''}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <StatusBadge status={device.status} size="sm" />
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2 font-mono">
                                                    <span className={`${(device.cpu_usage ?? 0) > 80 ? 'text-rose-400' : 'text-slate-300'}`}>
                                                        CPU: {device.cpu_usage !== null ? `${Number(device.cpu_usage).toFixed(1)}%` : '-'}
                                                    </span>
                                                    <span className="text-slate-600">|</span>
                                                    <span className={`${(device.memory_usage ?? 0) > 85 ? 'text-rose-400' : 'text-slate-300'}`}>
                                                        RAM: {device.memory_usage !== null ? `${Number(device.memory_usage).toFixed(1)}%` : '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-400">
                                                {device.location || '-'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {canManage ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleMonitoring(device)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                                                            device.monitoring_enabled
                                                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800 hover:bg-rose-950/50 hover:text-rose-400 hover:border-rose-800'
                                                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-950/50 hover:text-emerald-400 hover:border-emerald-800'
                                                        }`}
                                                    >
                                                        <Power className="w-3 h-3" />
                                                        <span>{device.monitoring_enabled ? 'Aktif' : 'Mati'}</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400">
                                                        {device.monitoring_enabled ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => runPingTest(device)}
                                                        title="Tes Koneksi (Ping)"
                                                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-400 border border-slate-700 text-slate-300 transition-colors"
                                                    >
                                                        <Activity className="w-3.5 h-3.5" />
                                                    </button>
                                                    <Link
                                                        href={`/devices/${device.id}`}
                                                        title="Detail Perangkat"
                                                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Link>
                                                    {canManage && (
                                                        <>
                                                            <Link
                                                                href={`/devices/${device.id}/edit`}
                                                                title="Edit Konfigurasi"
                                                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(device)}
                                                                title="Hapus Perangkat"
                                                                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950 hover:text-rose-400 border border-slate-700 text-slate-300 transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {devices.links && devices.links.length > 3 && (
                        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                            <div>
                                Menampilkan {devices.from || 0} - {devices.to || 0} dari {devices.total} perangkat
                            </div>
                            <div className="flex gap-1">
                                {devices.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                                            link.active
                                                ? 'bg-cyan-600 text-white border-cyan-500 font-semibold'
                                                : link.url
                                                ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                                                : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Test Connection (ICMP Ping) */}
                {pingTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
                        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-base font-semibold text-slate-100">
                                        Tes Koneksi ICMP: {pingTarget.name}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setPingTarget(null)}
                                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="text-xs text-slate-400 flex items-center justify-between">
                                    <span>Target IP: <span className="font-mono text-slate-200">{pingTarget.ip_address}</span></span>
                                    <span>Port SNMP: <span className="font-mono text-slate-200">{pingTarget.snmp_port}</span></span>
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
                                    onClick={() => runPingTest(pingTarget)}
                                    disabled={pingLoading}
                                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
                                >
                                    Ping Ulang
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPingTarget(null)}
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
