<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        $remember = (bool) $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => 'Kombinasi email dan kata sandi tidak cocok dengan data kami.',
            ]);
        }

        $request->session()->regenerate();

        // Audit Log
        if (class_exists(AuditLog::class)) {
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'LOGIN',
                'module' => 'Autentikasi',
                'description' => 'Pengguna ' . Auth::user()->name . ' berhasil login (' . Auth::user()->role . ')',
                'ip_address' => $request->ip(),
            ]);
        }

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user && class_exists(AuditLog::class)) {
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'LOGOUT',
                'module' => 'Autentikasi',
                'description' => 'Pengguna ' . $user->name . ' logout dari sistem',
                'ip_address' => $request->ip(),
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
