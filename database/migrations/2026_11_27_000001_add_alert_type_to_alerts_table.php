<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alerts', function (Blueprint $table) {
            if (! Schema::hasColumn('alerts', 'alert_type')) {
                $table->string('alert_type')->nullable()->index();
            }
        });

        DB::statement('UPDATE alerts SET alert_type = type WHERE alert_type IS NULL AND type IS NOT NULL');
    }

    public function down(): void
    {
        Schema::table('alerts', function (Blueprint $table) {
            if (Schema::hasColumn('alerts', 'alert_type')) {
                $table->dropColumn('alert_type');
            }
        });
    }
};
