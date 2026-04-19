<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = \App\Models\Role::where('slug', 'admin')->first();
        
        if (!$adminRole) {
            $adminRole = \App\Models\Role::create([
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Super Admin'
            ]);
        }

        $menus = \App\Models\Menu::all();

        $syncData = [];
        foreach ($menus as $menu) {
            $syncData[$menu->id] = [
                'can_view' => true,
                'can_create' => true,
                'can_edit' => true,
                'can_delete' => true,
                'can_approval' => true,
            ];
        }

        $adminRole->menus()->sync($syncData);

        // Optional: Assign admin role to first user
        $user = \App\Models\User::first();
        if ($user) {
            $user->roles()->syncWithoutDetaching([$adminRole->id]);
        }
    }
}
