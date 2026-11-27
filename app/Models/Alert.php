<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Alert extends Model
{
    use HasFactory;

    public const STATUS_OPEN = 'OPEN';
    public const STATUS_ACKNOWLEDGED = 'ACKNOWLEDGED';
    public const STATUS_RESOLVED = 'RESOLVED';

    protected $fillable = [
        'device_id',
        'alert_type',
        'type',
        'severity',
        'title',
        'message',
        'status',
        'triggered_at',
        'acknowledged_at',
        'acknowledged_by',
        'resolved_at',
        'resolved_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'triggered_at' => 'datetime',
            'acknowledged_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function setAlertTypeAttribute($value): void
    {
        $this->attributes['alert_type'] = $value;
        $this->attributes['type'] = $value;
    }

    public function setTypeAttribute($value): void
    {
        $this->attributes['type'] = $value;
        if (! isset($this->attributes['alert_type'])) {
            $this->attributes['alert_type'] = $value;
        }
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    public function acknowledgedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acknowledged_by');
    }

    public function resolvedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(AlertHistory::class, 'alert_id');
    }
}
