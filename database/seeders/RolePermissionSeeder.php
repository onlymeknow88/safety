<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            'User Management' => 'user',
            'Role Management' => 'role',
            'Dashboard' => 'dashboard',
            'Master Data' => 'master',
            'Report' => 'report',
        ];

        $actions = [
            'view' => 'View',
            'create' => 'Create',
            'edit' => 'Edit',
            'delete' => 'Delete',
            'approval' => 'Approval',
        ];

        foreach ($modules as $moduleName => $moduleSlug) {
            foreach ($actions as $actionSlug => $actionName) {
                \App\Models\Permission::updateOrCreate([
                    'slug' => "{$moduleSlug}.{$actionSlug}",
                ], [
                    'name' => "{$actionName} {$moduleName}",
                    'group' => $moduleName,
                ]);
            }
        }

        // Create Default Admin Role
        $adminRole = \App\Models\Role::updateOrCreate(['slug' => 'admin'], [
            'name' => 'Administrator',
            'description' => 'System Super Admin',
        ]);

        // Assign all permissions to admin
        $allPermissions = \App\Models\Permission::all();
        $adminRole->permissions()->sync($allPermissions->pluck('id'));

        // Assign admin role to first user (if exists)
        $user = \App\Models\User::first();
        if ($user) {
            $user->roles()->sync([$adminRole->id]);
        }
    }
}
