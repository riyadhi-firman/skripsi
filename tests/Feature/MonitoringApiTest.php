<?php

namespace Tests\Feature;

use App\Models\Device;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MonitoringApiTest extends TestCase
{
    use RefreshDatabase;

    protected string $token = 'ubj_nms_engine_secret_token_2026';

    protected function setUp(): void
    {
        parent::setUp();

        Setting::updateOrCreate(
            ['key' => 'monitoring_api_token'],
            ['value' => $this->token, 'type' => 'string']
        );
    }

    public function test_monitoring_devices_endpoint_requires_valid_bearer_token(): void
    {
        $response = $this->getJson('/api/monitoring/devices');
        $response->assertStatus(401);

        $responseInvalid = $this->withHeader('Authorization', 'Bearer invalid-token')
            ->getJson('/api/monitoring/devices');
        $responseInvalid->assertStatus(401);
    }

    public function test_monitoring_devices_endpoint_returns_active_devices_with_token(): void
    {
        Device::query()->delete();

        Device::factory()->create([
            'name' => 'UBJ Active Router',
            'monitoring_enabled' => true,
        ]);

        Device::factory()->create([
            'name' => 'UBJ Disabled Router',
            'monitoring_enabled' => false,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/monitoring/devices');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'devices');
        $response->assertJsonFragment(['name' => 'UBJ Active Router']);
    }

    public function test_ingestion_results_endpoint_stores_telemetry_and_updates_device(): void
    {
        $device = Device::factory()->create([
            'status' => 'UNKNOWN',
        ]);

        $payload = [
            'results' => [
                [
                    'device_id' => $device->id,
                    'status' => 'UP',
                    'latency' => 12.5,
                    'packet_loss' => 0.0,
                    'jitter' => 1.2,
                    'cpu_usage' => 35,
                    'memory_usage' => 45,
                    'uptime' => 99999,
                    'system_name' => 'UBJ-CORE-SW',
                    'system_description' => 'Cisco IOS 15.2',
                    'checked_at' => now()->toIso8601String(),
                ],
            ],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/monitoring/results', $payload);

        $response->assertStatus(200);
        $response->assertJson(['success' => true, 'processed' => 1]);

        $device->refresh();
        $this->assertEquals('UP', $device->status);
        $this->assertEquals(35, $device->cpu_usage);
        $this->assertEquals(45, $device->memory_usage);

        $this->assertDatabaseHas('monitoring_results', [
            'device_id' => $device->id,
            'status' => 'UP',
            'latency' => 12.5,
        ]);
    }

    public function test_ingestion_triggers_alert_on_device_down(): void
    {
        $device = Device::factory()->create([
            'status' => 'UP',
        ]);

        $payload = [
            'results' => [
                [
                    'device_id' => $device->id,
                    'status' => 'DOWN',
                    'latency' => null,
                    'packet_loss' => 100.0,
                    'checked_at' => now()->toIso8601String(),
                ],
            ],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/monitoring/results', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('alerts', [
            'device_id' => $device->id,
            'alert_type' => 'DEVICE_DOWN',
            'severity' => 'CRITICAL',
            'status' => 'OPEN',
        ]);
    }
}
