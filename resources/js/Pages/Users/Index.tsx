import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import { User } from '../../types';
import {
    Users as UsersIcon,
    Plus,
    UserCheck,
    Shield,
    Key,
    Edit2,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    users: PaginatedUsers;
}

export default function UsersIndex({ users }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'OPERATOR',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/users', form, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setForm({ name: '', email: '', password: '', role: 'OPERATOR' });
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        router.put(`/users/${editingUser.id}`, form, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingUser(null);
                setForm({ name: '', email: '', password: '', role: 'OPERATOR' });
            },
        });
    };

    const handleDelete = (user: User) => {
        if (confirm(`Hapus pengguna "${user.name}" (${user.email})?`)) {
            router.delete(`/users/${user.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout title="Manajemen Pengguna & Hak Akses">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 text-cyan-400" />
                            <span>Manajemen Pengguna & Hak Akses (RBAC)</span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Kontrol akses berbasis peran (Admin: kelola penuh; Operator: read-only & penanganan alert).
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setForm({ name: '', email: '', password: '', role: 'OPERATOR' });
                            setIsCreateModalOpen(true);
                        }}
                        className="self-start md:self-auto px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/40 flex items-center gap-2 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Pengguna Baru</span>
                    </button>
                </div>

                {/* Users Table */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">Nama Lengkap</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Hak Akses (Role)</th>
                                    <th className="py-3 px-4">Tanggal Registrasi</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="py-3.5 px-4 font-semibold text-slate-100">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-xs">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{user.name}</span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4 font-mono text-slate-300">
                                            {user.email}
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    user.role === 'ADMIN'
                                                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </td>

                                        <td className="py-3.5 px-4 text-right space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setForm({
                                                        name: user.name,
                                                        email: user.email,
                                                        password: '',
                                                        role: user.role,
                                                    });
                                                }}
                                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 font-medium inline-flex items-center gap-1"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                <span>Edit</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(user)}
                                                className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/80 rounded-lg font-medium inline-flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                <span>Hapus</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                            <div>
                                Halaman {users.current_page} dari {users.last_page} &bull; Total {users.total} Pengguna
                            </div>
                            <div className="flex items-center gap-2">
                                {users.prev_page_url && (
                                    <Link
                                        href={users.prev_page_url}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                        <span>Sebelumnya</span>
                                    </Link>
                                )}
                                {users.next_page_url && (
                                    <Link
                                        href={users.next_page_url}
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

                {/* Create Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-cyan-400" />
                                    <span>Tambah Pengguna Baru</span>
                                </h3>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                                        placeholder="Contoh: Budi Santoso, S.Kom"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Alamat Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                                        placeholder="budi@ubj.ac.id"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Password Baru</label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                        placeholder="Minimal 8 karakter"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Peran Akses (Role)</label>
                                    <select
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                                    >
                                        <option value="OPERATOR">OPERATOR (Read-Only & Penanganan Alert)</option>
                                        <option value="ADMIN">ADMIN (Hak Akses Penuh & Manajemen Sistem)</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/40"
                                    >
                                        Simpan Pengguna
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                    <Edit2 className="w-4 h-4 text-cyan-400" />
                                    <span>Edit Pengguna: {editingUser.name}</span>
                                </h3>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Alamat Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">
                                        Password Baru (Kosongkan jika tidak diganti)
                                    </label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                        placeholder="Biarkan kosong jika tetap"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Peran Akses (Role)</label>
                                    <select
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                                    >
                                        <option value="OPERATOR">OPERATOR (Read-Only & Penanganan Alert)</option>
                                        <option value="ADMIN">ADMIN (Hak Akses Penuh & Manajemen Sistem)</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/40"
                                    >
                                        Perbarui Pengguna
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
