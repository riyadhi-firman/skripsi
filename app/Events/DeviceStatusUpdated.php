<?php

namespace App\Events;

use App\Models\Device;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeviceStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $payload;

    /**
     * Create a new event instance.
     */
    public function __construct(Device $device, ?float $latency = null, ?float $packetLoss = null)
    {
        $this->payload = [
            'id' => $device->id,
            'name' => $device->name,
            'ip_address' => $device->ip_address,
            'device_type' => $device->device_type,
            'status' => $device->status,
            'latency' => $latency ?? $device->monitoringResults()->latest('checked_at')->first()?->latency,
            'packet_loss' => $packetLoss ?? $device->monitoringResults()->latest('checked_at')->first()?->packet_loss ?? 0,
            'cpu_usage' => $device->cpu_usage,
            'memory_usage' => $device->memory_usage,
            'temperature' => $device->temperature,
            'uptime' => $device->uptime,
            'last_seen' => $device->last_checked_at?->toIso8601String() ?? ($device->last_seen instanceof \DateTimeInterface ? $device->last_seen->toIso8601String() : $device->last_seen),
            'pos_x' => $device->pos_x,
            'pos_y' => $device->pos_y,
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('monitoring'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'device.updated';
    }
}
