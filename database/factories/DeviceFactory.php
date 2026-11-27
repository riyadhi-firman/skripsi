<?php

namespace Database\Factories;

use App\Models\Device;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Device>
 */
class DeviceFactory extends Factory
{
    protected $model = Device::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company().' Switch',
            'hostname' => fake()->domainWord().'.ubj.ac.id',
            'ip_address' => fake()->ipv4(),
            'device_type' => fake()->randomElement(['Router', 'Switch', 'Firewall', 'Server', 'Access Point']),
            'vendor' => fake()->randomElement(['Cisco', 'MikroTik', 'Huawei', 'Aruba']),
            'model' => 'Gigabit Enterprise',
            'location' => 'Data Center UBJ Gedung A',
            'snmp_version' => 'v2c',
            'snmp_community' => 'public',
            'snmp_port' => 161,
            'monitoring_interval' => 30,
            'timeout' => 5,
            'retry' => 2,
            'monitoring_enabled' => true,
            'status' => 'UP',
            'cpu_usage' => fake()->numberBetween(10, 50),
            'memory_usage' => fake()->numberBetween(20, 60),
            'uptime' => 864000,
            'last_checked_at' => now(),
            'pos_x' => fake()->numberBetween(100, 800),
            'pos_y' => fake()->numberBetween(100, 600),
        ];
    }
}
