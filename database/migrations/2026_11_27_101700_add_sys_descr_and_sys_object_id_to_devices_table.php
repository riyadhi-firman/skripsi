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
        Schema::table('devices', function (Blueprint $table) {
            $table->text('sys_descr')->nullable()->after('model');
            $table->string('sys_object_id')->nullable()->after('sys_descr');
            $table->string('firmware_version')->nullable()->after('sys_object_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devices', function (Blueprint $table) {
            $table->dropColumn(['sys_descr', 'sys_object_id', 'firmware_version']);
        });
    }
};
