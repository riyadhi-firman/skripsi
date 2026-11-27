<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'hostname',
        'ip_address',
        'device_type',
        'vendor',
        'model',
        'location',
        'snmp_version',
        'snmp_community',
        'snmp_port',
        'snmp_security_level',
        'snmp_auth_protocol',
        'snmp_auth_password',
        'snmp_priv_protocol',
        'snmp_priv_password',
        'monitoring_interval',
        'timeout',
        'retry',
        'monitoring_enabled',
        'status',
        'latency',
        'packet_loss',
        'cpu_usage',
        'memory_usage',
        'temperature',
        'uptime',
        'pos_x',
        'pos_y',
        'last_checked_at',
    ];

    protected $hidden = [
        'snmp_community',
        'snmp_auth_password',
        'snmp_priv_password',
    ];

    protected $appends = [
        'last_seen',
    ];

    public function getLastSeenAttribute(): ?\Carbon\Carbon
    {
        return $this->last_checked_at;
    }

    protected function casts(): array
    {
        return [
            'snmp_community' => 'encrypted',
            'snmp_auth_password' => 'encrypted',
            'snmp_priv_password' => 'encrypted',
            'snmp_port' => 'integer',
            'monitoring_interval' => 'integer',
            'timeout' => 'integer',
            'retry' => 'integer',
            'monitoring_enabled' => 'boolean',
            'latency' => 'float',
            'packet_loss' => 'float',
            'cpu_usage' => 'float',
            'memory_usage' => 'float',
            'temperature' => 'float',
            'uptime' => 'integer',
            'last_checked_at' => 'datetime',
        ];
    }

    public function interfaces(): HasMany
    {
        return $this->hasMany(NetworkInterface::class, 'device_id');
    }

    public function monitoringResults(): HasMany
    {
        return $this->hasMany(MonitoringResult::class, 'device_id');
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class, 'device_id');
    }

    public function activeAlerts(): HasMany
    {
        return $this->hasMany(Alert::class, 'device_id')->where('status', '!=', 'RESOLVED');
    }

    public function outboundEdges(): HasMany
    {
        return $this->hasMany(TopologyEdge::class, 'source_device_id');
    }

    public function inboundEdges(): HasMany
    {
        return $this->hasMany(TopologyEdge::class, 'target_device_id');
    }

    public function scopeMonitoringEnabled($query)
    {
        return $query->where('monitoring_enabled', true);
    }
}
