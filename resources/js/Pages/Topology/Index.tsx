import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { router, Link } from '@inertiajs/react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    MiniMap,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    Connection,
    MarkerType,
    BackgroundVariant,
} from 'reactflow';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import { CustomNode } from './CustomNode';
import { Device, TopologyLink } from '../../types';
import { StatusBadge } from '../../Components/StatusBadge';
import { DeviceTypeIcon } from '../../Components/DeviceTypeIcon';
import {
    Plus,
    Maximize2,
    RefreshCw,
    X,
    ExternalLink,
    Activity,
    Layers,
    Trash2,
    Info,
    Network,
    Sliders,
} from 'lucide-react';

interface Props {
    devices?: Device[];
    links?: TopologyLink[];
    edges?: TopologyLink[];
    canManage?: boolean;
}

export default function TopologyIndex({
    devices: initialDevices = [],
    links: initialLinks,
    edges: initialEdgesProp,
    canManage = false,
}: Props) {
    const rawLinks = initialLinks ?? initialEdgesProp ?? [];
    const [devices, setDevices] = useState<Device[]>(initialDevices);
    const [links, setLinks] = useState<TopologyLink[]>(rawLinks);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);

    // Form state for creating link
    const [linkForm, setLinkForm] = useState({
        source_device_id: '',
        target_device_id: '',
        source_port: 'eth0',
        target_port: 'eth0',
        link_type: 'ETHERNET',
        speed_mbps: 1000,
    });

    const nodeTypes = useMemo(() => ({ device: CustomNode }), []);

    // Create ReactFlow Nodes
    const initialNodes: Node[] = useMemo(() => {
        return (devices || []).map((d, idx) => ({
            id: String(d.id),
            type: 'device',
            position: {
                x: d.pos_x ?? (idx % 4) * 260 + 100,
                y: d.pos_y ?? Math.floor(idx / 4) * 180 + 100,
            },
            data: {
                device: d,
                onSelect: (dev: Device) => setSelectedDevice(dev),
            },
        }));
    }, [devices]);

    // Create ReactFlow Edges
    const initialEdges: Edge[] = useMemo(() => {
        return (links || []).map((l) => {
            const isDown =
                l.status === 'DOWN' ||
                l.source_device?.status === 'DOWN' ||
                l.target_device?.status === 'DOWN';

            let edgeLabel = l.label || l.bandwidth || '';
            if (!edgeLabel && l.speed_mbps) {
                edgeLabel = l.speed_mbps >= 1000 ? `${l.speed_mbps / 1000}G` : `${l.speed_mbps}M`;
            }
            if (l.source_port && l.target_port && !l.label) {
                edgeLabel = edgeLabel ? `${edgeLabel} (${l.source_port} → ${l.target_port})` : `${l.source_port} → ${l.target_port}`;
            }
            if (!edgeLabel) {
                edgeLabel = 'Link';
            }

            return {
                id: String(l.id),
                source: String(l.source_device_id),
                target: String(l.target_device_id),
                animated: !isDown,
                label: edgeLabel,
                labelStyle: { fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
                labelBgStyle: { fill: '#0f172a', fillOpacity: 0.9, rx: 4, ry: 4 },
                labelBgPadding: [4, 2] as [number, number],
                style: {
                    stroke: isDown ? '#f43f5e' : '#06b6d4',
                    strokeWidth: 2,
                    strokeDasharray: isDown ? '5 5' : undefined,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: isDown ? '#f43f5e' : '#06b6d4',
                    width: 15,
                    height: 15,
                },
            };
        });
    }, [links]);

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    useEffect(() => {
        setDevices(initialDevices);
    }, [initialDevices]);

    useEffect(() => {
        setLinks(initialLinks ?? initialEdgesProp ?? []);
    }, [initialLinks, initialEdgesProp]);

    useEffect(() => {
        setNodes(initialNodes);
    }, [initialNodes]);

    useEffect(() => {
        setEdges(initialEdges);
    }, [initialEdges]);

    // Real-time synchronization
    useEffect(() => {
        const win = window as any;
        if (!win.Echo) return;

        const channel = win.Echo.channel('monitoring');
        channel.listen('.device.updated', (event: any) => {
            const updated = event.payload;
            if (!updated) return;

            setDevices((prev) =>
                prev.map((d) =>
                    d.id === updated.id
                        ? {
                              ...d,
                              status: updated.status,
                              cpu_usage: updated.cpu_usage,
                              memory_usage: updated.memory_usage,
                              uptime: updated.uptime,
                              last_seen: updated.last_seen,
                          }
                        : d
                )
            );

            // Also update selected device if opened
            setSelectedDevice((prev) =>
                prev && prev.id === updated.id
                    ? {
                          ...prev,
                          status: updated.status,
                          cpu_usage: updated.cpu_usage,
                          memory_usage: updated.memory_usage,
                          uptime: updated.uptime,
                          last_seen: updated.last_seen,
                      }
                    : prev
            );
        });

        return () => {
            channel.stopListening('.device.updated');
        };
    }, []);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    // Save node position on drag stop
    const onNodeDragStop = useCallback((_: any, node: Node) => {
        const deviceId = parseInt(node.id, 10);
        const { x, y } = node.position;

        router.post(
            '/topology/nodes/position',
            {
                device_id: deviceId,
                pos_x: Math.round(x),
                pos_y: Math.round(y),
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    }, []);

    // Auto-organize hierarchical layout
    const handleAutoLayout = () => {
        const typeOrder: Record<string, number> = {
            FIREWALL: 0,
            ROUTER: 1,
            SWITCH: 2,
            SERVER: 3,
            ACCESS_POINT: 3,
            OTHER: 4,
        };

        const grouped: Record<number, Device[]> = {};
        devices.forEach((d) => {
            const tier = typeOrder[d.device_type] ?? 2;
            if (!grouped[tier]) grouped[tier] = [];
            grouped[tier].push(d);
        });

        const newNodes: Node[] = [];
        Object.keys(grouped)
            .sort((a, b) => Number(a) - Number(b))
            .forEach((tierStr, tierIdx) => {
                const tier = Number(tierStr);
                const devs = grouped[tier];
                const tierY = 100 + tierIdx * 200;
                const totalWidth = devs.length * 260;
                const startX = Math.max(100, 600 - totalWidth / 2);

                devs.forEach((dev, devIdx) => {
                    const posX = startX + devIdx * 260;
                    newNodes.push({
                        id: String(dev.id),
                        type: 'device',
                        position: { x: posX, y: tierY },
                        data: {
                            device: dev,
                            onSelect: (d: Device) => setSelectedDevice(d),
                        },
                    });

                    // Save position
                    router.post(
                        '/topology/nodes/position',
                        {
                            device_id: dev.id,
                            pos_x: posX,
                            pos_y: tierY,
                        },
                        { preserveScroll: true, preserveState: true }
                    );
                });
            });

        setNodes(newNodes);
    };

    const handleCreateLink = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/topology/links', linkForm, {
            onSuccess: () => {
                setIsAddLinkModalOpen(false);
                setLinkForm({
                    source_device_id: '',
                    target_device_id: '',
                    source_port: 'eth0',
                    target_port: 'eth0',
                    link_type: 'ETHERNET',
                    speed_mbps: 1000,
                });
            },
        });
    };

    const handleDeleteLink = (linkId: number) => {
        if (confirm('Hapus relasi link jaringan ini?')) {
            router.delete(`/topology/links/${linkId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout title="Interactive Network Topology">
            <div className="h-[calc(100vh-130px)] flex flex-col space-y-3">
                {/* Topology Control Toolbar */}
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-xl shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                            <Network className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                <span>Peta Topologi Jaringan Interaktif</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">
                                    {devices.length} Nodes &bull; {links.length} Links
                                </span>
                            </h1>
                            <p className="text-[11px] text-slate-400">
                                Drag-and-drop perangkat untuk mengatur posisi. Posisi tersimpan otomatis ke database.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleAutoLayout}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
                        >
                            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Auto Susun Hirarki</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAddLinkModalOpen(true)}
                            className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah Relasi Link</span>
                        </button>
                    </div>
                </div>

                {/* ReactFlow Canvas Area */}
                <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden relative shadow-2xl">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeDragStop={onNodeDragStop}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-slate-950"
                        minZoom={0.2}
                        maxZoom={2}
                    >
                        <Background color="#1e293b" gap={20} size={1.5} variant={BackgroundVariant.Dots} />
                        <Controls
                            className="!bg-slate-900 !border-slate-800 !text-slate-300 !rounded-xl !overflow-hidden [&>button]:!border-slate-800 [&>button]:!bg-slate-900 [&>button:hover]:!bg-slate-800"
                        />
                        <MiniMap
                            nodeColor={(node) => {
                                const dev = node.data?.device;
                                if (!dev) return '#475569';
                                if (dev.status === 'UP') return '#10b981';
                                if (dev.status === 'DOWN') return '#f43f5e';
                                if (dev.status === 'DEGRADED') return '#f59e0b';
                                return '#64748b';
                            }}
                            className="!bg-slate-900/90 !border !border-slate-800 !rounded-xl overflow-hidden"
                            maskColor="rgba(15, 23, 42, 0.7)"
                        />
                    </ReactFlow>

                    {/* Selected Device Drawer Panel */}
                    {selectedDevice && (
                        <div className="absolute top-4 right-4 w-80 bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md z-10 space-y-4 animate-in slide-in-from-right duration-200">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
                                        <DeviceTypeIcon type={selectedDevice.device_type} size={16} />
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-100 truncate">
                                        {selectedDevice.name}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedDevice(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Status Operasional:</span>
                                    <StatusBadge status={selectedDevice.status} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Alamat IP:</span>
                                    <span className="font-mono text-cyan-400 font-semibold">
                                        {selectedDevice.ip_address}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Tipe Perangkat:</span>
                                    <span className="text-slate-200 font-medium">
                                        {selectedDevice.device_type}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Beban CPU:</span>
                                    <span className="font-mono font-bold text-slate-100">
                                        {selectedDevice.cpu_usage !== null ? `${selectedDevice.cpu_usage}%` : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Penggunaan RAM:</span>
                                    <span className="font-mono font-bold text-slate-100">
                                        {selectedDevice.memory_usage !== null ? `${selectedDevice.memory_usage}%` : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Lokasi / Rack:</span>
                                    <span className="text-slate-300">
                                        {selectedDevice.location || 'Data Center UBJ'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link
                                    href={`/devices/${selectedDevice.id}`}
                                    className="w-full py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-950/40"
                                >
                                    <span>Buka Detail & Telemetri Lengkap</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Add Link */}
                {isAddLinkModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                    <Network className="w-4 h-4 text-cyan-400" />
                                    <span>Tambah Relasi Interkoneksi (Link)</span>
                                </h3>
                                <button
                                    onClick={() => setIsAddLinkModalOpen(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateLink} className="space-y-4 text-xs">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 mb-1 font-medium">
                                            Perangkat Sumber (Source)
                                        </label>
                                        <select
                                            value={linkForm.source_device_id}
                                            onChange={(e) => setLinkForm({ ...linkForm, source_device_id: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                                            required
                                        >
                                            <option value="">Pilih Perangkat</option>
                                            {devices.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name} ({d.ip_address})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 mb-1 font-medium">
                                            Port Sumber
                                        </label>
                                        <input
                                            type="text"
                                            value={linkForm.source_port}
                                            onChange={(e) => setLinkForm({ ...linkForm, source_port: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                            placeholder="eth0 / GigabitEthernet0/1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 mb-1 font-medium">
                                            Perangkat Tujuan (Target)
                                        </label>
                                        <select
                                            value={linkForm.target_device_id}
                                            onChange={(e) => setLinkForm({ ...linkForm, target_device_id: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                                            required
                                        >
                                            <option value="">Pilih Perangkat</option>
                                            {devices.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name} ({d.ip_address})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 mb-1 font-medium">
                                            Port Tujuan
                                        </label>
                                        <input
                                            type="text"
                                            value={linkForm.target_port}
                                            onChange={(e) => setLinkForm({ ...linkForm, target_port: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                            placeholder="eth0 / Fa0/1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 mb-1 font-medium">
                                            Tipe Media Transmisi
                                        </label>
                                        <select
                                            value={linkForm.link_type}
                                            onChange={(e) => setLinkForm({ ...linkForm, link_type: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                                        >
                                            <option value="ETHERNET">Ethernet (Cat6/Cat7)</option>
                                            <option value="FIBER">Fiber Optic (Single/Multi Mode)</option>
                                            <option value="WIRELESS">Point-to-Point Wireless</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 mb-1 font-medium">
                                            Kapasitas Bandwidth (Mbps)
                                        </label>
                                        <input
                                            type="number"
                                            value={linkForm.speed_mbps}
                                            onChange={(e) => setLinkForm({ ...linkForm, speed_mbps: parseInt(e.target.value, 10) || 1000 })}
                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                            min="10"
                                            step="10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddLinkModalOpen(false)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/40"
                                    >
                                        Simpan Relasi Link
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
