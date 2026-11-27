<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlertHistory extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'alert_histories';

    protected $fillable = [
        'alert_id',
        'action',
        'notes',
        'description',
        'user_id',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (AlertHistory $history) {
            if (empty($history->description) && !empty($history->notes)) {
                $history->description = $history->notes;
            }
            if (empty($history->notes) && !empty($history->description)) {
                $history->notes = $history->description;
            }
            if (empty($history->created_at)) {
                $history->created_at = now();
            }
        });
    }

    public function alert(): BelongsTo
    {
        return $this->belongsTo(Alert::class, 'alert_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
