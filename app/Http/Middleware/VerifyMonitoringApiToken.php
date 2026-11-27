<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyMonitoringApiToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? $request->header('X-Monitoring-Token');
        $expectedToken = config('services.monitoring.token', env('MONITORING_API_TOKEN', 'ubj_nms_engine_secret_token_2026'));

        if (! $token || ! hash_equals($expectedToken, $token)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Invalid monitoring engine token.',
            ], 401);
        }

        return $next($request);
    }
}
