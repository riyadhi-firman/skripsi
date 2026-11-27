<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonitoringResult extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'monitoring_results';

    protected $fillable = [
        'device_id',
        'status',
        'latency',
        'packet_loss',
        'cpu_usage',
        'memory_usage',
        'uptime',
        'checked_at',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'latency' => 'float',
            'packet_loss' => 'float',
            'cpu_usage' => 'float',
            'memory_usage' => 'float',
            'uptime' => 'integer',
            'checked_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'device_id');
    }
}
