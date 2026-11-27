<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TopologyEdge extends Model
{
    use HasFactory;

    protected $table = 'topology_edges';

    protected $fillable = [
        'source_device_id',
        'target_device_id',
        'source_interface_id',
        'target_interface_id',
        'label',
        'status',
        'bandwidth',
    ];

    public function sourceDevice(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'source_device_id');
    }

    public function targetDevice(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'target_device_id');
    }

    public function sourceInterface(): BelongsTo
    {
        return $this->belongsTo(NetworkInterface::class, 'source_interface_id');
    }

    public function targetInterface(): BelongsTo
    {
        return $this->belongsTo(NetworkInterface::class, 'target_interface_id');
    }
}
