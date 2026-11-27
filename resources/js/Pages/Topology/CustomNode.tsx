import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Device } from '../../types';
import { DeviceTypeIcon } from '../../Components/DeviceTypeIcon';

interface CustomNodeData {
    device: Device;
    onSelect: (device: Device) => void;
}

export const CustomNode = memo(({ data }: { data: CustomNodeData }) => {
    const { device, onSelect } = data;
    const status = (device.status || 'UNKNOWN').toUpperCase();

    let borderColor = 'border-slate-700 bg-slate-900/90 text-slate-300';
    let glow = '';
    let badgeColor = 'bg-slate-800 text-slate-400';

    if (status === 'UP') {
        borderColor = 'border-emerald-500/80 bg-slate-900/95 text-emerald-300 shadow-lg shadow-emerald-950/50';
        glow = 'ring-2 ring-emerald-500/20';
        badgeColor = 'bg-emerald-950 text-emerald-400 border border-emerald-800';
    } else if (status === 'DOWN') {
        borderColor = 'border-rose-500 bg-slate-900/95 text-rose-300 shadow-xl shadow-rose-950/60 animate-pulse';
        glow = 'ring-2 ring-rose-500/30';
        badgeColor = 'bg-rose-950 text-rose-400 border border-rose-800';
    } else if (status === 'DEGRADED') {
        borderColor = 'border-amber-500 bg-slate-900/95 text-amber-300 shadow-lg shadow-amber-950/50';
        glow = 'ring-2 ring-amber-500/20';
        badgeColor = 'bg-amber-950 text-amber-400 border border-amber-800';
    }

    return (
        <div
            onClick={() => onSelect(device)}
            className={`w-52 rounded-2xl border-2 p-3.5 backdrop-blur-md cursor-pointer transition-all hover:scale-105 select-none ${borderColor} ${glow}`}
        >
            {/* Connection handles */}
            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-slate-950" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-slate-950" />
            <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-slate-950" />
            <Handle type="source" position={Position.Right} id="right" className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-slate-950" />

            <div className="flex items-center justify-between gap-2 mb-2">
                <div className="p-1.5 rounded-xl bg-slate-800/90 text-cyan-400 border border-slate-700">
                    <DeviceTypeIcon type={device.device_type} size={16} />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                    {status}
                </span>
            </div>

            <div className="font-bold text-xs text-slate-100 truncate" title={device.name}>
                {device.name}
            </div>
            <div className="text-[11px] font-mono text-cyan-400 truncate mt-0.5">
                {device.ip_address}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>CPU: <strong className="font-mono text-slate-200">{device.cpu_usage !== null ? `${device.cpu_usage}%` : '-'}</strong></span>
                <span>RAM: <strong className="font-mono text-slate-200">{device.memory_usage !== null ? `${device.memory_usage}%` : '-'}</strong></span>
            </div>
        </div>
    );
});
CustomNode.displayName = 'CustomNode';
