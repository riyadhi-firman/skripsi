<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $users = User::orderBy('name')->paginate(15);

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in([User::ROLE_ADMIN, User::ROLE_OPERATOR])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'USER_CREATE',
            'module' => 'Pengguna',
            'description' => "Menambahkan pengguna baru {$user->name} ({$user->email}) role: {$user->role}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Pengguna {$user->name} berhasil ditambahkan.");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', Rule::in([User::ROLE_ADMIN, User::ROLE_OPERATOR])],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'USER_UPDATE',
            'module' => 'Pengguna',
            'description' => "Memperbarui data pengguna {$user->name} ({$user->email})",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Pengguna {$user->name} berhasil diperbarui.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $name = $user->name;
        $user->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'USER_DELETE',
            'module' => 'Pengguna',
            'description' => "Menghapus akun pengguna {$name}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Pengguna {$name} berhasil dihapus.");
    }
}
