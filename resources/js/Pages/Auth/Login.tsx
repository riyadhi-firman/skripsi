import React, { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { GuestLayout } from '../../Layouts/GuestLayout';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    const fillDemo = (email: string, pass: string) => {
        setData((prev) => ({
            ...prev,
            email,
            password: pass,
        }));
    };

    return (
        <GuestLayout title="Login NOC">
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Alamat Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            placeholder="nama@ubj.ac.id"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-rose-400">{errors.password}</p>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded-sm bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0 focus:ring-offset-0"
                        />
                        <span>Ingat sesi saya</span>
                    </label>
                    <span className="text-slate-500">Portal NOC Terproteksi</span>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
                >
                    <span>{processing ? 'Memproses Masuk...' : 'Masuk ke Sistem NOC'}</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </form>

            {/* Quick Demo Credentials for Reviewers/Examiners */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
                    Akses Cepat Pengujian Skripsi:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                        type="button"
                        onClick={() => fillDemo('admin@ubj.ac.id', 'password')}
                        className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors flex items-center gap-2"
                    >
                        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                            <p className="font-semibold text-slate-200">Administrator</p>
                            <p className="text-[10px] text-slate-400">admin@ubj.ac.id</p>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillDemo('operator@ubj.ac.id', 'password')}
                        className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors flex items-center gap-2"
                    >
                        <User className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                            <p className="font-semibold text-slate-200">Operator NOC</p>
                            <p className="text-[10px] text-slate-400">operator@ubj.ac.id</p>
                        </div>
                    </button>
                </div>
            </div>
        </GuestLayout>
    );
}
