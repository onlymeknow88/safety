<?php

namespace Database\Seeders;

use App\Models\EmailGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EmailGroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            'AMI All Site Users' => [
                'gdamcallsiteusers@alamtri.com',
                'gdamcallsiteusersppi@alamtri.com'
            ],
            'PJO' => [
                'skbmaco.pjo@skbtrans.id',
                'Achmad.Juwahir@liebherr.com',
                'pjomaco-project@ekadharma.co.id',
                'pjoswi.amc@starwagen.co.id'
            ],
            'PJS PJO' => [
                'skbmaco.pjo@skbtrans.id'
            ],
            'HSE Contractor' => [
                'skbmaco.safety@skbtrans.id',
                'hse.cakratjg@gmail.com',
                'safety-sismaco@ekadharma.co.id',
                'safetyofficer.mtw@triatra.co.id',
                'ardoniputrasafety@gmail.com',
                'safety.mektek@gmail.com',
                'she.maco2@bandangminingcoal.com',
                'hsedepartmentikjp@gmail.com',
                'hse.icemc@indocarbon.com',
                'hse@indocarbon.com',
                'hse.icelc@indocarbon.com',
                'rudihajuhse@gmail.com',
                'so.bjm@binapertiwi.co.id',
                'k3@garudamart.com',
                'abmlc.hse@gmail.com'
            ]
        ];

        foreach ($groups as $name => $emails) {
            $group = EmailGroup::updateOrCreate(['name' => $name], [
                'slug' => Str::slug($name),
                'description' => 'Grup distribusi email untuk ' . $name,
            ]);

            $group->recipients()->delete();
            foreach ($emails as $email) {
                $group->recipients()->create(['email' => $email]);
            }
        }
    }
}
