import React from 'react';
import { DeviceStatus } from '../types';

interface StatusBadgeProps {
    status: DeviceStatus | string;
    showDot?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = true, size = 'md' }) => {
    const s = (status || 'UNKNOWN').toUpperCase();

    let bg = 'bg-slate-800 text-slate-300 border-slate-700';
    let dot = 'bg-slate-400';
    let label = s;

    switch (s) {
        case 'UP':
        case 'ACTIVE':
        case 'ONLINE':
            bg = 'bg-emerald-950/70 text-emerald-400 border-emerald-800/80 shadow-xs shadow-emerald-950';
            dot = 'bg-emerald-400 animate-pulse';
            label = 'UP';
            break;
        case 'DOWN':
        case 'CRITICAL':
        case 'OFFLINE':
            bg = 'bg-rose-950/70 text-rose-400 border-rose-800/80 shadow-xs shadow-rose-950';
            dot = 'bg-rose-400 animate-ping';
            label = 'DOWN';
            break;
        case 'DEGRADED':
        case 'WARNING':
            bg = 'bg-amber-950/70 text-amber-400 border-amber-800/80 shadow-xs shadow-amber-950';
            dot = 'bg-amber-400 animate-pulse';
            label = 'DEGRADED';
            break;
        case 'UNKNOWN':
        default:
            bg = 'bg-slate-800/80 text-slate-400 border-slate-700';
            dot = 'bg-slate-500';
            label = 'UNKNOWN';
            break;
    }

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm font-semibold',
    }[size];

    return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bg} ${sizeClasses}`}>
            {showDot && <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />}
            <span>{label}</span>
        </span>
    );
};
