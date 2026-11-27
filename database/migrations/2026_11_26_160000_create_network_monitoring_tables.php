<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('hostname')->nullable();
            $table->string('ip_address')->index();
            $table->string('device_type')->default('Other'); // Router, Switch, Firewall, Access Point, Server, Other
            $table->string('vendor')->nullable();
            $table->string('model')->nullable();
            $table->string('location')->nullable();
            $table->string('snmp_version')->default('v2c'); // v1, v2c, v3
            $table->text('snmp_community')->nullable(); // encrypted
            $table->integer('snmp_port')->default(161);
            $table->string('snmp_security_level')->nullable(); // noAuthNoPriv, authNoPriv, authPriv
            $table->string('snmp_auth_protocol')->nullable(); // MD5, SHA, SHA256
            $table->text('snmp_auth_password')->nullable(); // encrypted
            $table->string('snmp_priv_protocol')->nullable(); // DES, AES
            $table->text('snmp_priv_password')->nullable(); // encrypted
            $table->integer('monitoring_interval')->default(30); // in seconds
            $table->integer('timeout')->default(5); // in seconds
            $table->integer('retry')->default(2);
            $table->boolean('monitoring_enabled')->default(true)->index();
            $table->string('status')->default('UNKNOWN')->index(); // ONLINE, OFFLINE, WARNING, CRITICAL, UNKNOWN
            $table->double('latency', 8, 2)->nullable();
            $table->double('packet_loss', 8, 2)->nullable();
            $table->double('cpu_usage', 8, 2)->nullable();
            $table->double('memory_usage', 8, 2)->nullable();
            $table->unsignedBigInteger('uptime')->nullable();
            $table->integer('pos_x')->nullable();
            $table->integer('pos_y')->nullable();
            $table->timestamp('last_checked_at')->nullable();
            $table->timestamps();
        });

        Schema::create('interfaces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->cascadeOnDelete();
            $table->integer('if_index');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('admin_status')->default('UNKNOWN'); // UP, DOWN, UNKNOWN
            $table->string('oper_status')->default('UNKNOWN'); // UP, DOWN, UNKNOWN
            $table->unsignedBigInteger('speed')->default(0);
            $table->unsignedBigInteger('in_octets')->default(0);
            $table->unsignedBigInteger('out_octets')->default(0);
            $table->unsignedBigInteger('in_errors')->default(0);
            $table->unsignedBigInteger('out_errors')->default(0);
            $table->timestamps();

            $table->unique(['device_id', 'if_index']);
        });

        Schema::create('topology_edges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_device_id')->constrained('devices')->cascadeOnDelete();
            $table->foreignId('target_device_id')->constrained('devices')->cascadeOnDelete();
            $table->foreignId('source_interface_id')->nullable()->constrained('interfaces')->nullOnDelete();
            $table->foreignId('target_interface_id')->nullable()->constrained('interfaces')->nullOnDelete();
            $table->string('label')->nullable();
            $table->string('status')->default('UP'); // UP, DOWN, UNKNOWN
            $table->string('bandwidth')->nullable();
            $table->timestamps();
        });

        Schema::create('monitoring_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->cascadeOnDelete();
            $table->string('status')->index();
            $table->double('latency', 8, 2)->nullable();
            $table->double('packet_loss', 8, 2)->default(0);
            $table->double('cpu_usage', 8, 2)->nullable();
            $table->double('memory_usage', 8, 2)->nullable();
            $table->unsignedBigInteger('uptime')->nullable();
            $table->timestamp('checked_at')->index();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['device_id', 'checked_at']);
        });

        Schema::create('interface_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interface_id')->constrained('interfaces')->cascadeOnDelete();
            $table->unsignedBigInteger('input_octets')->default(0);
            $table->unsignedBigInteger('output_octets')->default(0);
            $table->unsignedBigInteger('input_errors')->default(0);
            $table->unsignedBigInteger('output_errors')->default(0);
            $table->double('utilization', 8, 2)->default(0);
            $table->timestamp('recorded_at')->index();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['interface_id', 'recorded_at']);
        });

        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->cascadeOnDelete();
            $table->string('alert_type')->index(); // DEVICE_DOWN, HIGH_LATENCY, HIGH_PACKET_LOSS, HIGH_CPU, HIGH_MEMORY, INTERFACE_DOWN, NO_DATA
            $table->string('type')->nullable()->index();
            $table->string('severity')->index(); // INFO, WARNING, CRITICAL
            $table->string('title')->nullable();
            $table->text('message');
            $table->string('status')->default('OPEN')->index(); // OPEN, ACKNOWLEDGED, RESOLVED
            $table->timestamp('triggered_at')->index();
            $table->timestamp('acknowledged_at')->nullable();
            $table->foreignId('acknowledged_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['device_id', 'status']);
        });

        Schema::create('alert_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alert_id')->constrained('alerts')->cascadeOnDelete();
            $table->string('action'); // TRIGGERED, ACKNOWLEDGED, RESOLVED, COMMENT
            $table->text('notes')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action')->index();
            $table->string('module')->index();
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value');
            $table->string('type')->default('string'); // string, integer, float, json
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('alert_histories');
        Schema::dropIfExists('alerts');
        Schema::dropIfExists('interface_metrics');
        Schema::dropIfExists('monitoring_results');
        Schema::dropIfExists('topology_edges');
        Schema::dropIfExists('interfaces');
        Schema::dropIfExists('devices');
    }
};
