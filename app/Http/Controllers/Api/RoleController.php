<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::with('menus');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    public function permissions()
    {
        $rootMenus = Menu::whereNull('parent_id')->orderBy('order')->get();
        $flattened = [];
        
        $this->flattenMenus($rootMenus, $flattened);
        
        return response()->json($flattened);
    }

    private function flattenMenus($menus, &$result, $level = 0)
    {
        foreach ($menus as $menu) {
            $menu->level = $level; // Tambahkan level untuk indentasi di frontend
            $result[] = $menu;
            
            $children = Menu::where('parent_id', $menu->id)->orderBy('order')->get();
            if ($children->count() > 0) {
                $this->flattenMenus($children, $result, $level + 1);
            }
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'menu_permissions' => 'array',
        ]);

        $slug = Str::slug($request->name);

        if (Role::where('slug', $slug)->exists()) {
            return response()->json([
                'message' => 'The role name results in a duplicate slug.',
                'errors' => ['name' => ['Role dengan nama ini sudah ada.']]
            ], 422);
        }

        $role = Role::create([
            'name' => $request->name,
            'slug' => $slug,
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

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role->load('menus')
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'menu_permissions' => 'array',
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description,
        ];

        // Jangan ubah slug jika role adalah 'admin' untuk menjaga integritas sistem
        if ($role->slug !== 'admin') {
            $newSlug = Str::slug($request->name);

            // Cek apakah slug baru sudah digunakan role lain
            $exists = Role::where('slug', $newSlug)->where('id', '!=', $role->id)->exists();
            if ($exists) {
                return response()->json([
                    'message' => 'The role name results in a duplicate slug.',
                    'errors' => ['name' => ['Nama sudah digunakan oleh role lain.']]
                ], 422);
            }

            $data['slug'] = $newSlug;
        }

        $role->update($data);

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

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role->load('menus')
        ]);
    }

    public function destroy(Role $role)
    {
        if ($role->slug === 'admin') {
            return response()->json(['message' => 'Cannot delete admin role'], 403);
        }

        $role->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }
}
