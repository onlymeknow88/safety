<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Role;
use App\Models\User;
use App\Models\MasterData\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserApprovalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Pastikan Role 'Approver' ada
        $approverRole = Role::updateOrCreate(['slug' => 'approver'], [
            'name' => 'Approver',
            'description' => 'Role for employees who can approve notifications'
        ]);

        // 2. Berikan akses ke menu Dashboard dan Accident Notification
        $menuDashboard = Menu::where('slug', 'dashboard')->first();
        $menuSafety = Menu::where('slug', 'safety')->first();
        $menuAccident = Menu::where('slug', 'accident-notification')->first();

        $syncData = [];
        if ($menuDashboard) {
            $syncData[$menuDashboard->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];
        }
        if ($menuSafety) {
            $syncData[$menuSafety->id] = ['can_view' => true, 'can_create' => false, 'can_edit' => false, 'can_delete' => false, 'can_approval' => false];
        }
        if ($menuAccident) {
            $syncData[$menuAccident->id] = [
                'can_view' => true, 
                'can_create' => false, 
                'can_edit' => false, 
                'can_delete' => false, 
                'can_approval' => true // Hak akses approval di level menu
            ];
        }

        $approverRole->menus()->sync($syncData);

        // 3. Buat/Cari Karyawan dengan status can_approve = true
        $employee = Employee::updateOrCreate(['email' => 'approver@safety.com'], [
            'nik' => '99999',
            'name' => 'Senior Approver',
            'can_approve' => true, // Syarat utama di m_employees
            'is_active' => true,
        ]);

        // 4. Buat User yang terhubung ke Employee tersebut
        $user = User::updateOrCreate(['email' => $employee->email], [
            'name' => $employee->name,
            'password' => Hash::make('password123'),
            'employee_id' => $employee->id, // Relasi baru
        ]);

        // 5. Hubungkan User dengan Role Approver
        $user->roles()->sync([$approverRole->id]);

        $this->command->info('User Approver berhasil dibuat!');
        $this->command->info('Email: approver@safety.com');
        $this->command->info('Password: password123');
    }
}
