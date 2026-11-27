<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterfaceMetric extends Model
{
    use HasFactory, MassPrunable;

    public $timestamps = false;

    protected $table = 'interface_metrics';

    protected $fillable = [
        'interface_id',
        'input_octets',
        'output_octets',
        'input_errors',
        'output_errors',
        'utilization',
        'recorded_at',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'input_octets' => 'integer',
            'output_octets' => 'integer',
            'input_errors' => 'integer',
            'output_errors' => 'integer',
            'utilization' => 'float',
            'recorded_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function networkInterface(): BelongsTo
    {
        return $this->belongsTo(NetworkInterface::class, 'interface_id');
    }

    /**
     * Get the prunable model query.
     */
    public function prunable(): Builder
    {
        $days = (int) Setting::get('data_retention_days', 14);
        return static::where('recorded_at', '<=', now()->subDays($days))
            ->orWhere(function ($query) use ($days) {
                $query->whereNull('recorded_at')
                    ->where('created_at', '<=', now()->subDays($days));
            });
    }
}
