<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Role/Index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'menu_permissions' => 'array',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        if ($request->has('menu_permissions')) {
            $syncData = [];
            foreach ($request->menu_permissions as $menuId => $perms) {
                if ($menuId > 0 && is_array($perms)) {
                    $syncData[$menuId] = [
                        'can_view' => $perms['view'] ?? false,
                        'can_create' => $perms['create'] ?? false,
                        'can_edit' => $perms['edit'] ?? false,
                        'can_delete' => $perms['delete'] ?? false,
                        'can_approval' => $perms['approval'] ?? false,
                    ];
                }
            }
            $role->menus()->sync($syncData);
        }

        return redirect()->back()->with('message', 'Role created successfully');
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'menu_permissions' => 'array',
        ]);

        $role->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        if ($request->has('menu_permissions')) {
            $syncData = [];
            foreach ($request->menu_permissions as $menuId => $perms) {
                if ($menuId > 0 && is_array($perms)) {
                    $syncData[$menuId] = [
                        'can_view' => $perms['view'] ?? false,
                        'can_create' => $perms['create'] ?? false,
                        'can_edit' => $perms['edit'] ?? false,
                        'can_delete' => $perms['delete'] ?? false,
                        'can_approval' => $perms['approval'] ?? false,
                    ];
                }
            }
            $role->menus()->sync($syncData);
        }

        return redirect()->back()->with('message', 'Role updated successfully');
    }

    public function destroy(Role $role)
    {
        if ($role->slug === 'admin' || $role->slug === 'super-admin') {
            return redirect()->back()->with('error', 'Cannot delete protected role');
        }

        $role->delete();
        return redirect()->back()->with('message', 'Role deleted successfully');
    }
}
