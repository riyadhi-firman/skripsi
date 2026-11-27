<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterfaceMetric extends Model
{
    use HasFactory;

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
}
