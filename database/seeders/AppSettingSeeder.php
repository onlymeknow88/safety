<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AppSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'azure_client_id',
                'value' => null,
                'group' => 'azure'
            ],
            [
                'key' => 'azure_client_secret',
                'value' => null,
                'group' => 'azure'
            ],
            [
                'key' => 'azure_tenant_id',
                'value' => null,
                'group' => 'azure'
            ],
            [
                'key' => 'azure_redirect_uri',
                'value' => config('app.url') . '/auth/azure/callback',
                'group' => 'azure'
            ],
            [
                'key' => 'target_fr',
                'value' => '0.5',
                'group' => 'safety'
            ],
            [
                'key' => 'target_sr',
                'value' => '50',
                'group' => 'safety'
            ],
        ];

        foreach ($settings as $setting) {
            \App\Models\AppSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
