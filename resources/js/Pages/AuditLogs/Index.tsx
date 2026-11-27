import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import { AuditLog, User } from '../../types';
import {
    Clock,
    Search,
    Shield,
    User as UserIcon,
    ChevronLeft,
    ChevronRight,
    Terminal,
    Layers,
    Filter,
} from 'lucide-react';

interface PaginatedLogs {
    data: AuditLog[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    logs: PaginatedLogs;
    filters: {
        module?: string;
        user_id?: string;
        search?: string;
    };
    modules: string[];
    users: { id: number; name: string; email: string }[];
}

export default function AuditLogsIndex({ logs, filters, modules, users }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [module, setModule] = useState(filters.module || '');
    const [userId, setUserId] = useState(filters.user_id || '');

    const applyFilters = () => {
        router.get(
            '/audit-logs',
            {
                search: search || undefined,
                module: module || undefined,
                user_id: userId || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const getActionBadgeColor = (action: string) => {
        if (action.includes('CREATE') || action.includes('STORE')) {
            return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
        }
        if (action.includes('DELETE') || action.includes('DESTROY')) {
            return 'bg-rose-950 text-rose-400 border border-rose-800';
        }
        if (action.includes('UPDATE') || action.includes('EDIT')) {
            return 'bg-cyan-950 text-cyan-400 border border-cyan-800';
        }
        if (action.includes('ALERT')) {
            return 'bg-amber-950 text-amber-400 border border-amber-800';
        }
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    };

    return (
        <AuthenticatedLayout title="Audit Trail & Log Aktivitas">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-cyan-400" />
                            <span>Audit Trail & Rekam Jejak Sistem</span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Pencatatan menyeluruh setiap perubahan konfigurasi, manajemen perangkat, pengakuan insiden, dan aktivitas pengguna.
                        </p>
                    </div>

                    <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                        Total Rekaman: <span className="text-cyan-400 font-bold">{logs.total}</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex-1 min-w-[220px] relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            placeholder="Cari deskripsi, aksi, atau IP address..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <select
                        value={module}
                        onChange={(e) => setModule(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                        <option value="">Semua Modul</option>
                        {modules.map((m) => (
                            <option key={m} value={m}>
                                Modul: {m}
                            </option>
                        ))}
                    </select>

                    <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 max-w-[200px]"
                    >
                        <option value="">Semua Operator</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} ({u.email})
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={applyFilters}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors"
                    >
                        Filter Log
                    </button>

                    {(search || module || userId) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setModule('');
                                setUserId('');
                                router.get('/audit-logs');
                            }}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Audit Logs Table */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">Waktu</th>
                                    <th className="py-3 px-4">Operator / User</th>
                                    <th className="py-3 px-4">Modul</th>
                                    <th className="py-3 px-4">Aksi</th>
                                    <th className="py-3 px-4">Deskripsi Aktivitas</th>
                                    <th className="py-3 px-4 text-right">Alamat IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-500">
                                            Tidak ada riwayat aktivitas yang sesuai kriteria pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString('id-ID')}
                                            </td>

                                            <td className="py-3 px-4 font-medium text-slate-200 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                                                        {log.user?.name ? log.user.name.charAt(0).toUpperCase() : 'S'}
                                                    </div>
                                                    <span>{log.user?.name || 'Sistem Daemon'}</span>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px]">
                                                    {log.module}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${getActionBadgeColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4 text-slate-200">
                                                {log.description}
                                            </td>

                                            <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                                                {log.ip_address || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                            <div>
                                Halaman {logs.current_page} dari {logs.last_page} &bull; Menampilkan {logs.data.length} dari {logs.total} log
                            </div>
                            <div className="flex items-center gap-2">
                                {logs.prev_page_url && (
                                    <Link
                                        href={logs.prev_page_url}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                        <span>Sebelumnya</span>
                                    </Link>
                                )}
                                {logs.next_page_url && (
                                    <Link
                                        href={logs.next_page_url}
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
            </div>
        </AuthenticatedLayout>
    );
}
