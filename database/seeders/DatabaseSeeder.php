<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with base configuration and UBJ dataset.
     */
    public function run(): void
    {
        // 1. Users
        User::firstOrCreate(
            ['email' => 'admin@ubj.ac.id'],
            [
                'name' => 'Administrator Jaringan UBJ',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
            ]
        );

        User::firstOrCreate(
            ['email' => 'operator@ubj.ac.id'],
            [
                'name' => 'Operator NOC UBJ',
                'password' => Hash::make('password'),
                'role' => User::ROLE_OPERATOR,
            ]
        );

        // 2. Settings / Configurable Thresholds
        $settings = [
            ['key' => 'latency_warning_ms', 'value' => '50', 'type' => 'float', 'description' => 'Ambang batas latency status WARNING (milidetik)'],
            ['key' => 'latency_critical_ms', 'value' => '150', 'type' => 'float', 'description' => 'Ambang batas latency status CRITICAL (milidetik)'],
            ['key' => 'packet_loss_warning_pct', 'value' => '5', 'type' => 'float', 'description' => 'Ambang batas packet loss status WARNING (%)'],
            ['key' => 'packet_loss_critical_pct', 'value' => '20', 'type' => 'float', 'description' => 'Ambang batas packet loss status CRITICAL (%)'],
            ['key' => 'cpu_warning_pct', 'value' => '75', 'type' => 'float', 'description' => 'Ambang batas penggunaan CPU status WARNING (%)'],
            ['key' => 'cpu_critical_pct', 'value' => '90', 'type' => 'float', 'description' => 'Ambang batas penggunaan CPU status CRITICAL (%)'],
            ['key' => 'memory_warning_pct', 'value' => '80', 'type' => 'float', 'description' => 'Ambang batas penggunaan Memory status WARNING (%)'],
            ['key' => 'memory_critical_pct', 'value' => '95', 'type' => 'float', 'description' => 'Ambang batas penggunaan Memory status CRITICAL (%)'],
            ['key' => 'monitoring_api_token', 'value' => 'ubj_nms_engine_secret_token_2026', 'type' => 'string', 'description' => 'Kunci otorisasi monitoring engine Golang'],
            ['key' => 'default_polling_interval', 'value' => '30', 'type' => 'integer', 'description' => 'Interval standar monitoring perangkat (detik)'],
        ];

        foreach ($settings as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }
    }
}
