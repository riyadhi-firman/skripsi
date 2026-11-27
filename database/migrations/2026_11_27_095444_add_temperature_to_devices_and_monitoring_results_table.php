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
            $table->decimal('temperature', 5, 1)->nullable()->after('memory_usage');
        });

        Schema::table('monitoring_results', function (Blueprint $table) {
            $table->decimal('temperature', 5, 1)->nullable()->after('memory_usage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devices', function (Blueprint $table) {
            $table->dropColumn('temperature');
        });

        Schema::table('monitoring_results', function (Blueprint $table) {
            $table->dropColumn('temperature');
        });
    }
};
