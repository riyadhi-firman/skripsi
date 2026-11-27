<?php

use App\Http\Controllers\Api\MonitoringIngestionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Monitoring Engine API Endpoints (Protected by Bearer Token)
Route::middleware('monitoring.token')->prefix('monitoring')->group(function () {
    Route::get('/devices', [MonitoringIngestionController::class, 'getDevices']);
    Route::post('/results', [MonitoringIngestionController::class, 'postResults']);
    Route::post('/interface-results', [MonitoringIngestionController::class, 'postInterfaceResults']);
});

