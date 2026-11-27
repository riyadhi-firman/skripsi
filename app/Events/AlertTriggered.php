<?php

namespace App\Events;

use App\Models\Alert;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AlertTriggered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $payload;

    public function __construct(Alert $alert)
    {
        $this->payload = [
            'id' => $alert->id,
            'device_id' => $alert->device_id,
            'device_name' => $alert->device?->name,
            'alert_type' => $alert->alert_type,
            'severity' => $alert->severity,
            'message' => $alert->message,
            'status' => $alert->status,
            'triggered_at' => $alert->triggered_at->toIso8601String(),
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('alerts'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'alert.triggered';
    }
}
