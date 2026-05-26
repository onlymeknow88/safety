<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Dashboard
        Menu::updateOrCreate(['slug' => 'dashboard'], [
            'name' => 'Dashboard',
            'icon' => 'DashboardOutlined',
            'url' => '/dashboard',
            'order' => 1
        ]);

        // 2. Master Data (Main Parent)
        $masterData = Menu::updateOrCreate(['slug' => 'master-data'], [
            'name' => 'Master Data',
            'icon' => 'AppstoreOutlined',
            'url' => '/master-data', // Main landing page
            'order' => 2
        ]);

        // Flat List of 25 Modules under Master Data
        $modules = [
            ['slug' => 'ccow', 'name' => 'CCOW', 'url' => '/master-data/ccow'],
            ['slug' => 'company', 'name' => 'Company', 'url' => '/master-data/company'],
            ['slug' => 'department', 'name' => 'Department', 'url' => '/master-data/department'],
            ['slug' => 'jabatan', 'name' => 'Jabatan', 'url' => '/master-data/jabatan'],
            ['slug' => 'shift', 'name' => 'Shift', 'url' => '/master-data/shift'],
            ['slug' => 'interval-time', 'name' => 'Interval Waktu', 'url' => '/master-data/interval-time'],
            ['slug' => 'day', 'name' => 'Hari', 'url' => '/master-data/day'],
            ['slug' => 'roster', 'name' => 'Roster', 'url' => '/master-data/roster'],
            ['slug' => 'gender', 'name' => 'Gender', 'url' => '/master-data/gender'],
            ['slug' => 'interval-age', 'name' => 'Interval Usia', 'url' => '/master-data/interval-age'],
            ['slug' => 'interval-experience', 'name' => 'Interval Pengalaman', 'url' => '/master-data/interval-experience'],
            ['slug' => 'incident-type', 'name' => 'Tipe Insiden', 'url' => '/master-data/incident-type'],
            ['slug' => 'kriteria', 'name' => 'Kriteria', 'url' => '/master-data/kriteria'],
            ['slug' => 'report-type', 'name' => 'Tipe Laporan', 'url' => '/master-data/report-type'],
            ['slug' => 'status', 'name' => 'Status', 'url' => '/master-data/status'],
            ['slug' => 'injury-condition', 'name' => 'Kondisi Cedera', 'url' => '/master-data/injury-condition'],
            ['slug' => 'body-part', 'name' => 'Bagian Tubuh', 'url' => '/master-data/body-part'],
            ['slug' => 'recommendation', 'name' => 'Rekomendasi', 'url' => '/master-data/recommendation'],
            ['slug' => 'source', 'name' => 'Sumber (Source)', 'url' => '/master-data/source'],
            ['slug' => 'unsafe-act', 'name' => 'Unsafe Act', 'url' => '/master-data/unsafe-act'],
            ['slug' => 'unsafe-condition', 'name' => 'Unsafe Condition', 'url' => '/master-data/unsafe-condition'],
            ['slug' => 'personal-factor', 'name' => 'Personal Factor', 'url' => '/master-data/personal-factor'],
            ['slug' => 'job-factor', 'name' => 'Job Factor', 'url' => '/master-data/job-factor'],
            ['slug' => 'location', 'name' => 'Lokasi', 'url' => '/master-data/location'],
            ['slug' => 'employee', 'name' => 'Karyawan (Employee)', 'url' => '/master-data/employee'],
        ];

        foreach ($modules as $idx => $item) {
            Menu::updateOrCreate(['slug' => $item['slug']], [
                'name' => $item['name'],
                'url' => $item['url'],
                'icon' => 'AppstoreOutlined', // Flat icon
                'parent_id' => $masterData->id,
                'order' => $idx + 1
            ]);
        }


        // 4. Safety
        $safetyParent = Menu::updateOrCreate(['slug' => 'safety'], [
            'name' => 'Safety',
            'icon' => 'SafetyOutlined',
            'url' => null,
            'order' => 3
        ]);

        Menu::updateOrCreate(['slug' => 'accident-notification'], [
            'name' => 'Notifikasi Kecelakaan',
            'icon' => 'WarningOutlined',
            'url' => '/accident-notification',
            'parent_id' => $safetyParent->id,
            'order' => 1
        ]);

        Menu::updateOrCreate(['slug' => 'investigation-report'], [
            'name' => 'Analisa Kecelakaan Kerja',
            'icon' => 'FileSearchOutlined',
            'url' => '/analisa-kecelakaan',
            'parent_id' => $safetyParent->id,
            'order' => 2
        ]);

        // 5. Report
        Menu::updateOrCreate(['slug' => 'report'], [
            'name' => 'Report',
            'icon' => 'BarChartOutlined',
            'url' => '/report',
            'order' => 4
        ]);

        // 6. Administrator
        $adminParent = Menu::updateOrCreate(['slug' => 'administrator'], [
            'name' => 'Administrator',
            'icon' => 'SettingOutlined',
            'url' => null,
            'order' => 99
        ]);

        Menu::updateOrCreate(['slug' => 'user-management'], [
            'name' => 'User Management',
            'icon' => 'TeamOutlined',
            'url' => '/admin/user',
            'parent_id' => $adminParent->id,
            'order' => 1
        ]);

        Menu::updateOrCreate(['slug' => 'role-management'], [
            'name' => 'Role Management',
            'icon' => 'SafetyCertificateOutlined',
            'url' => '/admin/roles',
            'parent_id' => $adminParent->id,
            'order' => 2
        ]);

        Menu::updateOrCreate(['slug' => 'menu-management'], [
            'name' => 'Menu Management',
            'icon' => 'AppstoreOutlined',
            'url' => '/admin/menu',
            'parent_id' => $adminParent->id,
            'order' => 3
        ]);
    }
}
