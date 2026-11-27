import React from 'react';
import { Router, Network, Shield, Wifi, Server, Cpu } from 'lucide-react';
import { DeviceType } from '../types';

interface DeviceTypeIconProps {
    type: DeviceType | string;
    className?: string;
    size?: number;
}

export const DeviceTypeIcon: React.FC<DeviceTypeIconProps> = ({ type, className = 'w-5 h-5', size = 20 }) => {
    switch (type) {
        case 'Router':
            return <Router className={className} size={size} />;
        case 'Switch':
            return <Network className={className} size={size} />;
        case 'Firewall':
            return <Shield className={className} size={size} />;
        case 'Access Point':
            return <Wifi className={className} size={size} />;
        case 'Server':
            return <Server className={className} size={size} />;
        case 'Other':
        default:
            return <Cpu className={className} size={size} />;
    }
};
