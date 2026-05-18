<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class InvestigationRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create/Update roles for LPKS/LPKL workflow
        $roles = [
            'ktt' => [
                'name' => 'KTT',
                'description' => 'Kepala Teknik Tambang - LPKS/LPKL Approver level 1',
            ],
            'ohs-dh' => [
                'name' => 'OHS D/H',
                'description' => 'OHS Department Head - LPKS/LPKL Approver level 2',
            ],
            'env-dh' => [
                'name' => 'ENV D/H',
                'description' => 'Environmental Department Head - LPKS/LPKL Approver level 3 (Conditional)',
            ],
            'pja' => [
                'name' => 'PJA',
                'description' => 'Penanggung Jawab Area - LPKS/LPKL Approver level 4',
            ],
            'mitra-kerja' => [
                'name' => 'Mitra Kerja',
                'description' => 'Admin/Pengawas/HSE/PJO Mitra Kerja - LPKS/LPKL Input',
            ],
            'ccow-user' => [
                'name' => 'CCOW User',
                'description' => 'All site users - LPKS/LPKL View only',
            ],
            'crs' => [
                'name' => 'CRS',
                'description' => 'Central Reviewer System - Full Access & Presentation Control',
            ],
        ];

        $roleModels = [];
        foreach ($roles as $slug => $data) {
            $roleModels[$slug] = Role::updateOrCreate(['slug' => $slug], $data);
        }

        // Get necessary menus
        $menuDashboard = Menu::where('slug', 'dashboard')->first();
        $menuSafety = Menu::where('slug', 'safety')->first();
        $menuAccident = Menu::where('slug', 'accident-notification')->first();
        $menuInvestigation = Menu::where('slug', 'investigation-report')->first();

        // 2. Map role-menu permissions
        // Approver level roles (KTT, OHS D/H, ENV D/H, PJA)
        $approverPermissions = [];
        if ($menuDashboard) $approverPermissions[$menuDashboard->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];
        if ($menuSafety) $approverPermissions[$menuSafety->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];
        if ($menuAccident) $approverPermissions[$menuAccident->id] = ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => false, 'can_approval' => true];
        if ($menuInvestigation) $approverPermissions[$menuInvestigation->id] = ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => false, 'can_approval' => true];

        // Mitra Kerja (Input role)
        $inputPermissions = [];
        if ($menuDashboard) $inputPermissions[$menuDashboard->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];
        if ($menuSafety) $inputPermissions[$menuSafety->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];
        if ($menuAccident) $inputPermissions[$menuAccident->id] = ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => false, 'can_approval' => false];
        if ($menuInvestigation) $inputPermissions[$menuInvestigation->id] = ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => false, 'can_approval' => false];

        // CCOW User (View only)
        $viewPermissions = [];
        if ($menuDashboard) $viewPermissions[$menuDashboard->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];
        if ($menuSafety) $viewPermissions[$menuSafety->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];
        if ($menuAccident) $viewPermissions[$menuAccident->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];
        if ($menuInvestigation) $viewPermissions[$menuInvestigation->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];

        // Apply permissions to roles
        $roleModels['ktt']->menus()->sync($approverPermissions);
        $roleModels['ohs-dh']->menus()->sync($approverPermissions);
        $roleModels['env-dh']->menus()->sync($approverPermissions);
        $roleModels['pja']->menus()->sync($approverPermissions);
        $roleModels['mitra-kerja']->menus()->sync($inputPermissions);
        $roleModels['ccow-user']->menus()->sync($viewPermissions);

        // CRS (Full access to all safety menus)
        $crsPermissions = [];
        if ($menuDashboard) $crsPermissions[$menuDashboard->id] = ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => true, 'can_approval' => true];
        if ($menuSafety) $crsPermissions[$menuSafety->id] = ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => true, 'can_approval' => true];
        if ($menuAccident) $crsPermissions[$menuAccident->id] = ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => true, 'can_approval' => true];
        if ($menuInvestigation) $crsPermissions[$menuInvestigation->id] = ['can_view' => true, 'can_create' => true, 'can_edit' => true, 'can_delete' => true, 'can_approval' => true];
        $roleModels['crs']->menus()->sync($crsPermissions);

        // Update Administrator role menu list to include new investigation-report menu with full access
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole && $menuInvestigation) {
            $adminRole->menus()->syncWithoutDetaching([
                $menuInvestigation->id => [
                    'can_view' => true,
                    'can_create' => true,
                    'can_edit' => true,
                    'can_delete' => true,
                    'can_approval' => true,
                ]
            ]);
        }

        $this->command->info('LPKS/LPKL Roles and Menu permissions successfully seeded!');
    }
}
