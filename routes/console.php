<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Otomatis bersihkan histori telemetry monitoring yang melebihi batas retensi setiap hari
Schedule::command('model:prune')->daily()->at('02:00');
