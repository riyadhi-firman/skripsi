import React, { FormEventHandler } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { AuthenticatedLayout } from '../../Layouts/AuthenticatedLayout';
import { ArrowLeft, Server, Shield, Activity, Save } from 'lucide-react';
import { Device } from '../../types';

interface Props {
    device: Device;
    deviceTypes: string[];
    snmpVersions: string[];
    authProtocols: string[];
    privProtocols: string[];
}

export default function Edit({ device, deviceTypes, snmpVersions, authProtocols, privProtocols }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: device.name || '',
        hostname: device.hostname || '',
        ip_address: device.ip_address || '',
        device_type: device.device_type || 'Router',
        vendor: device.vendor || '',
        model: device.model || '',
        location: device.location || '',
        snmp_version: device.snmp_version || 'v2c',
        snmp_community: '',
        snmp_port: device.snmp_port || 161,
        snmp_security_level: device.snmp_security_level || 'authPriv',
        snmp_auth_protocol: device.snmp_auth_protocol || 'SHA256',
        snmp_auth_password: '',
        snmp_priv_protocol: device.snmp_priv_protocol || 'AES',
        snmp_priv_password: '',
        monitoring_interval: device.monitoring_interval || 30,
        timeout: device.timeout || 2,
        retry: device.retry || 3,
        monitoring_enabled: Boolean(device.monitoring_enabled),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/devices/${device.id}`);
    };

    return (
        <AuthenticatedLayout title={`Edit: ${device.name}`}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/devices/${device.id}`}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-100">Edit Konfigurasi Perangkat</h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Perbarui parameter identitas, SNMP, dan interval monitoring untuk {device.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Section 1: Identitas & Jaringan */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                            <Server className="w-4 h-4 text-cyan-400" />
                            <h2 className="text-sm font-semibold text-slate-100">
                                Identitas & Konfigurasi Jaringan
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Nama Perangkat *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                                />
                                {errors.name && <p className="text-rose-400 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Alamat IP (IPv4) *
                                </label>
                                <input
                                    type="text"
                                    value={data.ip_address}
                                    onChange={(e) => setData('ip_address', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 font-mono focus:outline-hidden focus:border-cyan-500"
                                />
                                {errors.ip_address && <p className="text-rose-400 mt-1">{errors.ip_address}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Hostname / FQDN
                                </label>
                                <input
                                    type="text"
                                    value={data.hostname}
                                    onChange={(e) => setData('hostname', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 font-mono focus:outline-hidden focus:border-cyan-500"
                                />
                                {errors.hostname && <p className="text-rose-400 mt-1">{errors.hostname}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Tipe Perangkat *
                                </label>
                                <select
                                    value={data.device_type}
                                    onChange={(e) => setData('device_type', e.target.value as any)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-hidden focus:border-cyan-500"
                                >
                                    {deviceTypes.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                                {errors.device_type && <p className="text-rose-400 mt-1">{errors.device_type}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Vendor / Pabrikan
                                </label>
                                <input
                                    type="text"
                                    value={data.vendor}
                                    onChange={(e) => setData('vendor', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Model / Seri
                                </label>
                                <input
                                    type="text"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Lokasi Fisik / Gedung / Rack
                                </label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Konfigurasi SNMP Terenkripsi */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-cyan-400" />
                                <h2 className="text-sm font-semibold text-slate-100">
                                    Konfigurasi Protokol SNMP (Terenkripsi)
                                </h2>
                            </div>
                            <span className="text-[10px] text-slate-400">
                                Kosongkan password/community jika tidak ingin mengubah
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Versi SNMP *
                                </label>
                                <select
                                    value={data.snmp_version}
                                    onChange={(e) => setData('snmp_version', e.target.value as any)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-hidden focus:border-cyan-500 font-mono"
                                >
                                    {snmpVersions.map((v) => (
                                        <option key={v} value={v}>
                                            SNMP {v}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Port UDP SNMP
                                </label>
                                <input
                                    type="number"
                                    value={data.snmp_port}
                                    onChange={(e) => setData('snmp_port', parseInt(e.target.value) || 161)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 font-mono focus:outline-hidden focus:border-cyan-500"
                                />
                            </div>

                            {data.snmp_version !== 'v3' && (
                                <div>
                                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                        Community String Baru (Opsional)
                                    </label>
                                    <input
                                        type="password"
                                        value={data.snmp_community}
                                        onChange={(e) => setData('snmp_community', e.target.value)}
                                        placeholder="Biarkan kosong jika tidak diubah"
                                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 font-mono focus:outline-hidden focus:border-cyan-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* SNMP v3 Specific Fields */}
                        {data.snmp_version === 'v3' && (
                            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3 mt-3">
                                <h3 className="text-xs font-semibold text-cyan-400">Parameter Keamanan SNMPv3 (USM)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <label className="block text-slate-400 mb-1">Security Level</label>
                                        <select
                                            value={data.snmp_security_level}
                                            onChange={(e) => setData('snmp_security_level', e.target.value as any)}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
                                        >
                                            <option value="noAuthNoPriv">noAuthNoPriv</option>
                                            <option value="authNoPriv">authNoPriv</option>
                                            <option value="authPriv">authPriv</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 mb-1">Protokol Otentikasi</label>
                                        <select
                                            value={data.snmp_auth_protocol}
                                            onChange={(e) => setData('snmp_auth_protocol', e.target.value as any)}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
                                        >
                                            {authProtocols.map((p) => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 mb-1">Password Otentikasi Baru</label>
                                        <input
                                            type="password"
                                            value={data.snmp_auth_password}
                                            onChange={(e) => setData('snmp_auth_password', e.target.value)}
                                            placeholder="Biarkan kosong jika tidak diubah"
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 mb-1">Protokol Privasi (Enkripsi)</label>
                                        <select
                                            value={data.snmp_priv_protocol}
                                            onChange={(e) => setData('snmp_priv_protocol', e.target.value as any)}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
                                        >
                                            {privProtocols.map((p) => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 mb-1">Password Privasi Baru</label>
                                        <input
                                            type="password"
                                            value={data.snmp_priv_password}
                                            onChange={(e) => setData('snmp_priv_password', e.target.value)}
                                            placeholder="Biarkan kosong jika tidak diubah"
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3: Parameter Polling Mesin Golang */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                            <Activity className="w-4 h-4 text-cyan-400" />
                            <h2 className="text-sm font-semibold text-slate-100">
                                Parameter Polling Mesin Monitoring Golang
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Interval Polling (detik)
                                </label>
                                <input
                                    type="number"
                                    min="5"
                                    max="3600"
                                    value={data.monitoring_interval}
                                    onChange={(e) => setData('monitoring_interval', parseInt(e.target.value) || 30)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 font-mono focus:outline-hidden focus:border-cyan-500"
                                />
                                {errors.monitoring_interval && <p className="text-rose-400 mt-1">{errors.monitoring_interval}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Timeout (detik)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={data.timeout}
                                    onChange={(e) => setData('timeout', parseInt(e.target.value) || 2)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 font-mono focus:outline-hidden focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Batas Percobaan Ulang (Retry)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={data.retry}
                                    onChange={(e) => setData('retry', parseInt(e.target.value) || 3)}
                                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 font-mono focus:outline-hidden focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Status Monitoring
                                </label>
                                <div className="pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                                        <input
                                            type="checkbox"
                                            checked={data.monitoring_enabled}
                                            onChange={(e) => setData('monitoring_enabled', e.target.checked)}
                                            className="rounded-sm bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
                                        />
                                        <span>Aktifkan Polling Otomatis</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                            href={`/devices/${device.id}`}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/50 transition-all disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Menyimpan...' : 'Perbarui Perangkat'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
