import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { SharedProps } from '../types';

export const FlashMessages: React.FC = () => {
    const { flash } = usePage<SharedProps>().props;
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (flash.success || flash.error || flash.warning) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || (!flash.success && !flash.error && !flash.warning)) {
        return null;
    }

    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-200">
            {flash.success && (
                <div className="flex items-center justify-between p-4 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 rounded-xl shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        <p className="text-sm font-medium">{flash.success}</p>
                    </div>
                    <button onClick={() => setVisible(false)} className="text-emerald-400 hover:text-emerald-200 p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
            {flash.error && (
                <div className="flex items-center justify-between p-4 bg-rose-950/90 border border-rose-500/50 text-rose-200 rounded-xl shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <p className="text-sm font-medium">{flash.error}</p>
                    </div>
                    <button onClick={() => setVisible(false)} className="text-rose-400 hover:text-rose-200 p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
            {flash.warning && (
                <div className="flex items-center justify-between p-4 bg-amber-950/90 border border-amber-500/50 text-amber-200 rounded-xl shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        <p className="text-sm font-medium">{flash.warning}</p>
                    </div>
                    <button onClick={() => setVisible(false)} className="text-amber-400 hover:text-amber-200 p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};
