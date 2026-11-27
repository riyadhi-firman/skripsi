import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Network } from 'lucide-react';
import { FlashMessages } from '../Components/FlashMessages';

interface GuestLayoutProps {
    children: ReactNode;
    title?: string;
}

export const GuestLayout: React.FC<GuestLayoutProps> = ({ children, title = 'Login' }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
            <Head title={`${title} - NMS Universitas Banten Jaya`} />
            <FlashMessages />

            {/* Glowing background grid effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-950 border border-cyan-400/30 mb-3">
                        <Network className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                        UBJ NetPulse NOC
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                        Universitas Banten Jaya
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Network Monitoring & Real-Time Topology System
                    </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                    {children}
                </div>

                <div className="mt-8 text-center text-xs text-slate-500">
                    &copy; 2026 Universitas Banten Jaya &bull; Skripsi Teknik Informatika
                </div>
            </div>
        </div>
    );
};
