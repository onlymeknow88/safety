<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::select('id', 'name', 'email', 'created_at')
            ->latest()
            ->paginate(15)
            ->through(fn ($u) => [
                'key'    => (string) $u->id,
                'name'   => $u->name,
                'email'  => $u->email,
                'role'   => 'viewer', // sesuaikan dengan kolom role di DB Anda
                'status' => 'active', // sesuaikan dengan kolom status di DB Anda
                'joined' => $u->created_at ? $u->created_at->format('d M Y') : '-',
            ]);

        return Inertia::render('Dashboard/Users', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'required|in:admin,editor,viewer',
            'status'   => 'required|in:active,inactive',
        ]);

        User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            // 'role'   => $validated['role'],
            // 'status' => $validated['status'],
        ]);

        return back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => "required|email|unique:users,email,{$user->id}",
            'role'   => 'required|in:admin,editor,viewer',
            'status' => 'required|in:active,inactive',
        ]);

        $user->update($validated);

        return back()->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}
