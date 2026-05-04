<?php

namespace App\Http\Controllers\Api;

use App\Helpers\SafetyResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 10;

        $data = User::query()->with("roles");

        if ($search) {
            $data->where(function ($query) use ($search) {
                $query->where("name", "like", "%$search%")
                    ->orWhere("email", "like", "%$search%");
            });
        }

        $paginatedData = $data->paginate($load);

        return SafetyResponse::success($paginatedData, "Berhasil mengambil data");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|email|unique:users,email",
            "password" => "required|string|min:8",
            "roles" => "nullable|integer|exists:roles,id",
        ]);

        $user = User::create([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "password" => Hash::make($validated["password"]),
        ]);

        if (!empty($validated["roles"])) {
            $user->roles()->sync([$validated["roles"]]);
        }

        return response()->json([
            "message" => "User created successfully",
            "user" => $user->load("roles"),
        ]);
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|email|unique:users,email,{$user->id}",
            "roles" => "nullable|integer|exists:roles,id",
        ]);

        if ($request->filled("password")) {
            $request->validate(["password" => "string|min:8"]);
            $validated["password"] = Hash::make($request->password);
        }

        $user->update($validated);

        if (isset($validated["roles"])) {
            $user->roles()->sync([$validated["roles"]]);
        }

        return response()->json([
            "message" => "User updated successfully",
            "user" => $user->load("roles"),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = $request->user();

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
