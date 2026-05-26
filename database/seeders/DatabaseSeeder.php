<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MasterDataSeeder::class,
            LocationSeeder::class,
            MenuSeeder::class,
            RoleMenuSeeder::class,
            UserSeeder::class,
            AppSettingSeeder::class,
            EmployeeSeeder::class,
            UserApprovalSeeder::class,
            InvestigationRoleSeeder::class,
            AccidentNotificationSampleSeeder::class,
            AccidentNotificationRecommendationSeeder::class,
            AnalisaKecelakaanSeeder::class,
        ]);
    }
}
