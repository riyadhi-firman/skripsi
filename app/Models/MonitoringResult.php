<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonitoringResult extends Model
{
    use HasFactory, MassPrunable;

    public $timestamps = false;

    protected $table = 'monitoring_results';

    protected $fillable = [
        'device_id',
        'status',
        'latency',
        'packet_loss',
        'cpu_usage',
        'memory_usage',
        'temperature',
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
            'temperature' => 'float',
            'uptime' => 'integer',
            'checked_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    /**
     * Get the prunable model query.
     */
    public function prunable(): Builder
    {
        $days = (int) Setting::get('data_retention_days', 14);
        return static::where('checked_at', '<=', now()->subDays($days))
            ->orWhere(function ($query) use ($days) {
                $query->whereNull('checked_at')
                    ->where('created_at', '<=', now()->subDays($days));
            });
    }
}
