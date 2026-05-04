<?php

namespace App\Traits;

use App\Models\Role;

trait HasPermissions
{
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole(...$roles)
    {
        return $this->roles()->whereIn('slug', $roles)->exists();
    }

    /**
     * Check if user is a Super Admin
     */
    public function isSuperAdmin()
    {
        return $this->hasRole('admin', 'super-admin', 'superadmin');
    }

    public function hasPermission($permission)
    {
        if ($this->isSuperAdmin()) return true;

        if (!str_contains($permission, '.')) return false;

        [$menuSlug, $action] = explode('.', $permission);
        $column = 'can_' . $action;

        return $this->roles()->whereHas('menus', function($q) use ($menuSlug, $column) {
            $q->where('slug', $menuSlug)->where('role_menu.' . $column, true);
        })->exists();
    }

    public function getAllPermissions()
    {
        $permissions = collect();
        $roles = $this->roles()->with('menus')->get();

        foreach ($roles as $role) {
            foreach ($role->menus as $menu) {
                if ($menu->pivot->can_view) $permissions->push($menu->slug . '.view');
                if ($menu->pivot->can_create) $permissions->push($menu->slug . '.create');
                if ($menu->pivot->can_edit) $permissions->push($menu->slug . '.edit');
                if ($menu->pivot->can_delete) $permissions->push($menu->slug . '.delete');
                if ($menu->pivot->can_approval) $permissions->push($menu->slug . '.approval');
            }
        }

        return $permissions->unique();
    }

    public function getRoleNames()
    {
        return $this->roles->pluck('slug');
    }
}
