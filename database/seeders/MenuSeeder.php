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
            'order' => 1,
        ]);

        // 2. Master Data (Main Parent)
        $masterData = Menu::updateOrCreate(['slug' => 'master-data'], [
            'name' => 'Master Data',
            'icon' => 'AppstoreOutlined',
            'url' => '/master-data', // Main landing page
            'order' => 2,
        ]);

        // Flat List of 25 Modules under Master Data with custom distinctive icons
        $modules = [
            ['slug' => 'ccow', 'name' => 'CCOW', 'url' => '/master-data/ccow', 'icon' => 'ClusterOutlined'],
            ['slug' => 'company', 'name' => 'Company', 'url' => '/master-data/company', 'icon' => 'ApartmentOutlined'],
            ['slug' => 'department', 'name' => 'Department', 'url' => '/master-data/department', 'icon' => 'ApartmentOutlined'],
            ['slug' => 'jabatan', 'name' => 'Jabatan', 'url' => '/master-data/jabatan', 'icon' => 'TeamOutlined'],
            ['slug' => 'shift', 'name' => 'Shift', 'url' => '/master-data/shift', 'icon' => 'FieldTimeOutlined'],
            ['slug' => 'interval-time', 'name' => 'Interval Waktu', 'url' => '/master-data/interval-time', 'icon' => 'FieldTimeOutlined'],
            ['slug' => 'day', 'name' => 'Hari', 'url' => '/master-data/day', 'icon' => 'FieldTimeOutlined'],
            ['slug' => 'roster', 'name' => 'Roster', 'url' => '/master-data/roster', 'icon' => 'FieldTimeOutlined'],
            ['slug' => 'gender', 'name' => 'Gender', 'url' => '/master-data/gender', 'icon' => 'TeamOutlined'],
            ['slug' => 'interval-age', 'name' => 'Interval Usia', 'url' => '/master-data/interval-age', 'icon' => 'FieldTimeOutlined'],
            ['slug' => 'interval-experience', 'name' => 'Interval Pengalaman', 'url' => '/master-data/interval-experience', 'icon' => 'FieldTimeOutlined'],
            ['slug' => 'incident-type', 'name' => 'Tipe Insiden', 'url' => '/master-data/incident-type', 'icon' => 'WarningOutlined'],
            ['slug' => 'kriteria', 'name' => 'Kriteria', 'url' => '/master-data/kriteria', 'icon' => 'FileTextOutlined'],
            ['slug' => 'report-type', 'name' => 'Tipe Laporan', 'url' => '/master-data/report-type', 'icon' => 'FileTextOutlined'],
            ['slug' => 'status', 'name' => 'Status', 'url' => '/master-data/status', 'icon' => 'SafetyCertificateOutlined'],
            ['slug' => 'injury-condition', 'name' => 'Kondisi Cedera', 'url' => '/master-data/injury-condition', 'icon' => 'MedicineBoxOutlined'],
            ['slug' => 'body-part', 'name' => 'Bagian Tubuh', 'url' => '/master-data/body-part', 'icon' => 'MedicineBoxOutlined'],
            ['slug' => 'recommendation', 'name' => 'Rekomendasi', 'url' => '/master-data/recommendation', 'icon' => 'FileTextOutlined'],
            ['slug' => 'source', 'name' => 'Sumber (Source)', 'url' => '/master-data/source', 'icon' => 'EnvironmentOutlined'],
            ['slug' => 'unsafe-act', 'name' => 'Unsafe Act', 'url' => '/master-data/unsafe-act', 'icon' => 'WarningOutlined'],
            ['slug' => 'unsafe-condition', 'name' => 'Unsafe Condition', 'url' => '/master-data/unsafe-condition', 'icon' => 'WarningOutlined'],
            ['slug' => 'personal-factor', 'name' => 'Personal Factor', 'url' => '/master-data/personal-factor', 'icon' => 'TeamOutlined'],
            ['slug' => 'job-factor', 'name' => 'Job Factor', 'url' => '/master-data/job-factor', 'icon' => 'SettingOutlined'],
            ['slug' => 'location', 'name' => 'Lokasi', 'url' => '/master-data/location', 'icon' => 'EnvironmentOutlined'],
            ['slug' => 'employee', 'name' => 'Karyawan (Employee)', 'url' => '/master-data/employee', 'icon' => 'TeamOutlined'],
            ['slug' => 'mobile-equipment', 'name' => 'Jenis Mobile Equipment', 'url' => '/master-data/mobile-equipment', 'icon' => 'CarOutlined'],
        ];

        foreach ($modules as $idx => $item) {
            Menu::updateOrCreate(['slug' => $item['slug']], [
                'name' => $item['name'],
                'url' => $item['url'],
                'icon' => $item['icon'],
                'parent_id' => $masterData->id,
                'order' => $idx + 1,
            ]);
        }

        // 4. Safety
        $safetyParent = Menu::updateOrCreate(['slug' => 'safety'], [
            'name' => 'Safety',
            'icon' => 'SafetyOutlined',
            'url' => null,
            'order' => 3,
        ]);

        Menu::updateOrCreate(['slug' => 'accident-notification'], [
            'name' => 'Notifikasi Kecelakaan',
            'icon' => 'WarningOutlined',
            'url' => '/accident-notification',
            'parent_id' => $safetyParent->id,
            'order' => 1,
        ]);

        Menu::updateOrCreate(['slug' => 'investigation-report'], [
            'name' => 'Analisa Kecelakaan Kerja',
            'icon' => 'FileSearchOutlined',
            'url' => '/analisa-kecelakaan',
            'parent_id' => $safetyParent->id,
            'order' => 2,
        ]);

        Menu::updateOrCreate(['slug' => 'safety-performance'], [
            'name' => 'Safety Performance',
            'icon' => 'BarChartOutlined',
            'url' => '/safety-performance',
            'parent_id' => $safetyParent->id,
            'order' => 3,
        ]);

        // 5. Report
        // Menu::updateOrCreate(['slug' => 'report'], [
        //     'name' => 'Report',
        //     'icon' => 'BarChartOutlined',
        //     'url' => '/report',
        //     'order' => 4
        // ]);

        // 6. Administrator
        $adminParent = Menu::updateOrCreate(['slug' => 'administrator'], [
            'name' => 'Administrator',
            'icon' => 'SettingOutlined',
            'url' => null,
            'order' => 99,
        ]);

        Menu::updateOrCreate(['slug' => 'user-management'], [
            'name' => 'User Management',
            'icon' => 'TeamOutlined',
            'url' => '/admin/user',
            'parent_id' => $adminParent->id,
            'order' => 1,
        ]);

        Menu::updateOrCreate(['slug' => 'role-management'], [
            'name' => 'Role Management',
            'icon' => 'SafetyCertificateOutlined',
            'url' => '/admin/roles',
            'parent_id' => $adminParent->id,
            'order' => 2,
        ]);

        Menu::updateOrCreate(['slug' => 'menu-management'], [
            'name' => 'Menu Management',
            'icon' => 'AppstoreOutlined',
            'url' => '/admin/menu',
            'parent_id' => $adminParent->id,
            'order' => 3,
        ]);
    }
}
