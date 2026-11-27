<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DeviceController;
use Illuminate\Support\Facades\Route;

// Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/', function () {
        return redirect()->route('dashboard');
    });

    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Devices
    Route::resource('devices', DeviceController::class);
    Route::post('/devices/{device}/toggle-monitoring', [DeviceController::class, 'toggleMonitoring'])->name('devices.toggle-monitoring');
    Route::post('/devices/{device}/test-connection', [DeviceController::class, 'testConnection'])->name('devices.test-connection');

    // Topology
    Route::get('/topology', [\App\Http\Controllers\TopologyController::class, 'index'])->name('topology.index');
    Route::post('/topology/nodes/position', [\App\Http\Controllers\TopologyController::class, 'updatePosition'])->name('topology.nodes.position');
    Route::post('/topology/links', [\App\Http\Controllers\TopologyController::class, 'storeLink'])->name('topology.links.store');
    Route::delete('/topology/links/{edge}', [\App\Http\Controllers\TopologyController::class, 'destroyLink'])->name('topology.links.destroy');

    // Alerts
    Route::get('/alerts', [\App\Http\Controllers\AlertController::class, 'index'])->name('alerts.index');
    Route::post('/alerts/{alert}/acknowledge', [\App\Http\Controllers\AlertController::class, 'acknowledge'])->name('alerts.acknowledge');
    Route::post('/alerts/{alert}/resolve', [\App\Http\Controllers\AlertController::class, 'resolve'])->name('alerts.resolve');

    // Reports & History
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-csv', [\App\Http\Controllers\ReportController::class, 'exportCsv'])->name('reports.export-csv');
    Route::get('/audit-logs', [\App\Http\Controllers\AuditLogController::class, 'index'])->name('audit-logs.index');

    // Admin only settings & users
    Route::middleware('role:admin')->group(function () {
        Route::get('/settings', [\App\Http\Controllers\SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [\App\Http\Controllers\SettingController::class, 'update'])->name('settings.update');

        Route::resource('users', \App\Http\Controllers\UserController::class)->except(['show']);
    });
});

