import React, { ReactNode, useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Network,
    Server,
    Bell,
    FileText,
    History,
    Settings as SettingsIcon,
    Users,
    LogOut,
    Menu,
    X,
    Activity,
    Wifi,
    Radio,
    ShieldAlert,
    ChevronDown,
    Search,
} from 'lucide-react';
import { SharedProps } from '../types';
import { FlashMessages } from '../Components/FlashMessages';

interface AuthenticatedLayoutProps {
    children: ReactNode;
    title?: string;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, title = 'NOC' }) => {
    const { auth, openAlertsCount, app } = usePage<SharedProps>().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const currentRoute = window.location.pathname;

    useEffect(() => {
        // Monitor window.Echo connection state if available
        const win = window as any;
        if (win.Echo && win.Echo.connector && win.Echo.connector.pusher) {
            const pusher = win.Echo.connector.pusher;
            setWsConnected(pusher.connection.state === 'connected');
            pusher.connection.bind('state_change', (states: any) => {
                setWsConnected(states.current === 'connected');
            });
        }
    }, []);

    const navigation = [
        { name: 'Dashboard NOC', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Visualisasi Topologi', href: '/topology', icon: Network },
        { name: 'Manajemen Perangkat', href: '/devices', icon: Server },
        {
            name: 'Alert & Insiden',
            href: '/alerts',
            icon: Bell,
            badge: openAlertsCount > 0 ? openAlertsCount : null,
        },
        { name: 'Laporan & Metrik', href: '/reports', icon: FileText },
        { name: 'Audit Trail', href: '/audit-logs', icon: History },
    ];

    if (user?.role === 'admin') {
        navigation.push(
            { name: 'Konfigurasi Sistem', href: '/settings', icon: SettingsIcon },
            { name: 'Manajemen Pengguna', href: '/users', icon: Users }
        );
    }

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased font-sans">
            <Head title={`${title} - UBJ NetPulse NOC`} />
            <FlashMessages />

            <div className="flex flex-1 overflow-hidden">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {/* Brand */}
                    <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-900/60">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950 border border-cyan-400/40">
                                <Network className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    UBJ NetPulse
                                </span>
                                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                    NOC Universitas Banten Jaya
                                </span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Menu Utama
                        </div>
                        {navigation.map((item) => {
                            const isActive = currentRoute === item.href || (item.href !== '/dashboard' && currentRoute.startsWith(item.href));
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-600 text-white animate-pulse">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* System Status Footprint */}
                    <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                    Polling Engine
                                </span>
                                <span className="text-emerald-400 font-semibold">Aktif (ICMP/SNMP)</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <Wifi className="w-3.5 h-3.5 text-blue-400" />
                                    WebSocket Reverb
                                </span>
                                <span className={`font-semibold ${wsConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {wsConnected ? 'Connected' : 'Syncing'}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Header */}
                    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-10">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                                {title}
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Live alert quick counter */}
                            <Link
                                href="/alerts"
                                className="relative p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
                            >
                                <Bell className="w-4 h-4" />
                                {openAlertsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                                        {openAlertsCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs border border-cyan-400/30">
                                        {user?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden md:block text-left text-xs">
                                        <div className="font-semibold text-slate-200">{user?.name}</div>
                                        <div className="text-slate-400 capitalize">{user?.role}</div>
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                                </button>

                                {profileMenuOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                                        onClick={() => setProfileMenuOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b border-slate-800 text-xs">
                                            <p className="font-medium text-slate-300">{user?.email}</p>
                                            <p className="text-cyan-400 font-semibold capitalize mt-0.5">
                                                Role: {user?.role}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Keluar Sistem</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};
