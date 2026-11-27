<?php

namespace Tests\Feature;

use App\Models\Device;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeviceManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $operator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
        ]);

        $this->operator = User::factory()->create([
            'role' => User::ROLE_OPERATOR,
        ]);
    }

    public function test_authenticated_user_can_view_devices_list(): void
    {
        Device::factory()->create([
            'name' => 'UBJ Switch Core',
            'ip_address' => '10.10.1.1',
        ]);

        $response = $this->actingAs($this->operator)->get('/devices');

        $response->assertStatus(200);
    }

    public function test_admin_can_create_a_new_device(): void
    {
        $response = $this->actingAs($this->admin)->post('/devices', [
            'name' => 'Cisco Edge Router UBJ',
            'hostname' => 'edge01.ubj.ac.id',
            'ip_address' => '10.10.0.1',
            'device_type' => 'Router',
            'vendor' => 'Cisco',
            'model' => 'ISR 4331',
            'location' => 'Data Center Gedung A Lantai 1',
            'snmp_version' => 'v2c',
            'snmp_community' => 'public',
            'snmp_port' => 161,
            'monitoring_interval' => 30,
            'timeout' => 5,
            'retry' => 2,
            'monitoring_enabled' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('devices', [
            'name' => 'Cisco Edge Router UBJ',
            'ip_address' => '10.10.0.1',
            'device_type' => 'Router',
        ]);
    }

    public function test_operator_cannot_delete_a_device(): void
    {
        $device = Device::factory()->create();

        $response = $this->actingAs($this->operator)->delete("/devices/{$device->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('devices', ['id' => $device->id]);
    }

    public function test_admin_can_delete_a_device(): void
    {
        $device = Device::factory()->create();

        $response = $this->actingAs($this->admin)->delete("/devices/{$device->id}");

        $response->assertRedirect('/devices');
        $this->assertDatabaseMissing('devices', ['id' => $device->id]);
    }

    public function test_device_ping_test_endpoint_works(): void
    {
        $device = Device::factory()->create([
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->actingAs($this->admin)->post("/devices/{$device->id}/test-connection");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'reachable',
            'latency',
            'output',
            'tested_at',
        ]);
    }
}
