<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\Device;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AlertManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $operator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->operator = User::factory()->create([
            'role' => User::ROLE_OPERATOR,
        ]);
    }

    public function test_operator_can_acknowledge_open_alert(): void
    {
        $device = Device::factory()->create();
        $alert = Alert::factory()->create([
            'device_id' => $device->id,
            'status' => Alert::STATUS_OPEN,
        ]);

        $response = $this->actingAs($this->operator)
            ->post("/alerts/{$alert->id}/acknowledge");

        $response->assertSessionHas('success');

        $alert->refresh();
        $this->assertEquals(Alert::STATUS_ACKNOWLEDGED, $alert->status);
        $this->assertEquals($this->operator->id, $alert->acknowledged_by);

        $this->assertDatabaseHas('alert_histories', [
            'alert_id' => $alert->id,
            'action' => 'ACKNOWLEDGED',
            'user_id' => $this->operator->id,
        ]);
    }

    public function test_operator_can_resolve_alert_with_notes(): void
    {
        $device = Device::factory()->create();
        $alert = Alert::factory()->create([
            'device_id' => $device->id,
            'status' => Alert::STATUS_OPEN,
        ]);

        $response = $this->actingAs($this->operator)
            ->post("/alerts/{$alert->id}/resolve", [
                'notes' => 'Port transceiver SFP diganti, link UP kembali.',
            ]);

        $response->assertSessionHas('success');

        $alert->refresh();
        $this->assertEquals(Alert::STATUS_RESOLVED, $alert->status);
        $this->assertEquals($this->operator->id, $alert->resolved_by);
        $this->assertEquals('Port transceiver SFP diganti, link UP kembali.', $alert->notes);
    }
}
