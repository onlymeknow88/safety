<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class SafetyPermission
{
    /**
     * Check if current user has a specific permission
     * Format: 'menu-slug.action' (e.g., 'accident-notification.create')
     */
    public static function has($permission)
    {
        $user = Auth::user();
        if (!$user) return false;

        // Administrator and Super Admin bypass
        $isAdministrator = $user->roles->contains('name', 'Administrator') || 
                           $user->roles->contains('slug', 'admin') ||
                           $user->roles->contains('name', 'Super Admin') ||
                           $user->roles->contains('slug', 'super-admin') ||
                           $user->roles->contains('slug', 'superadmin');

        if ($isAdministrator) return true;

        if (method_exists($user, 'hasPermission')) {
            return $user->hasPermission($permission);
        }

        return false;
    }

    /**
     * Check multiple permissions
     */
    public static function hasAny(array $permissions)
    {
        foreach ($permissions as $permission) {
            if (self::has($permission)) return true;
        }
        return false;
    }

    public static function hasAll(array $permissions)
    {
        foreach ($permissions as $permission) {
            if (!self::has($permission)) return false;
        }
        return true;
    }
}
