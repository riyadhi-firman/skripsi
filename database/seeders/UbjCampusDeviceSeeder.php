<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class UbjCampusDeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Artisan::call('ubj:import-devices', [
            '--replace' => true,
            '--with-topology' => true,
            '--with-metrics' => true,
        ]);
    }
}
