<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE alerts ALTER COLUMN title DROP NOT NULL;');

        Schema::table('alert_histories', function (Blueprint $table) {
            if (!Schema::hasColumn('alert_histories', 'notes')) {
                $table->text('notes')->nullable();
            }
        });

        DB::statement('ALTER TABLE alert_histories ALTER COLUMN description DROP NOT NULL;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
