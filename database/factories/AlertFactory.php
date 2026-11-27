<?php

namespace Database\Factories;

use App\Models\Alert;
use App\Models\Device;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Alert>
 */
class AlertFactory extends Factory
{
    protected $model = Alert::class;

    public function definition(): array
    {
        return [
            'device_id' => Device::factory(),
            'alert_type' => 'HIGH_LATENCY',
            'severity' => 'WARNING',
            'message' => 'Latency is higher than warning threshold (160ms)',
            'status' => Alert::STATUS_OPEN,
            'triggered_at' => now(),
        ];
    }
}
