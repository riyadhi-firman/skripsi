<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NetworkInterface extends Model
{
    use HasFactory;

    protected $table = 'interfaces';

    protected $fillable = [
        'device_id',
        'if_index',
        'name',
        'description',
        'admin_status',
        'oper_status',
        'speed',
        'in_octets',
        'out_octets',
        'in_errors',
        'out_errors',
    ];

    protected function casts(): array
    {
        return [
            'if_index' => 'integer',
            'speed' => 'integer',
            'in_octets' => 'integer',
            'out_octets' => 'integer',
            'in_errors' => 'integer',
            'out_errors' => 'integer',
        ];
    }

    protected $appends = [
        'if_name',
        'if_descr',
        'if_speed',
        'if_admin_status',
        'if_oper_status',
        'if_in_errors',
        'if_out_errors',
        'if_in_octets',
        'if_out_octets',
        'in_utilization',
        'out_utilization',
    ];

    public function getIfNameAttribute(): string
    {
        return $this->name;
    }

    public function getIfDescrAttribute(): ?string
    {
        return $this->description;
    }

    public function getIfSpeedAttribute(): int
    {
        return $this->speed ?? 0;
    }

    public function getIfAdminStatusAttribute(): string
    {
        return $this->admin_status ?? 'UNKNOWN';
    }

    public function getIfOperStatusAttribute(): string
    {
        return $this->oper_status ?? 'UNKNOWN';
    }

    public function getIfInErrorsAttribute(): int
    {
        return $this->in_errors ?? 0;
    }

    public function getIfOutErrorsAttribute(): int
    {
        return $this->out_errors ?? 0;
    }

    public function getIfInOctetsAttribute(): int
    {
        return $this->in_octets ?? 0;
    }

    public function getIfOutOctetsAttribute(): int
    {
        return $this->out_octets ?? 0;
    }

    public function getInUtilizationAttribute(): float
    {
        return (float) ($this->latestMetric?->utilization ?? 0.0);
    }

    public function getOutUtilizationAttribute(): float
    {
        return (float) ($this->latestMetric?->utilization ?? 0.0);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    public function metrics(): HasMany
    {
        return $this->hasMany(InterfaceMetric::class, 'interface_id');
    }

    public function latestMetric()
    {
        return $this->hasOne(InterfaceMetric::class, 'interface_id')->latestOfMany();
    }
}
