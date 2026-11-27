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

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    public function metrics(): HasMany
    {
        return $this->hasMany(InterfaceMetric::class, 'interface_id');
    }
}
