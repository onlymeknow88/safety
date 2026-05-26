<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\MasterData\Ccow;
use App\Models\MasterData\Company;
use App\Models\MasterData\Location;
use App\Models\MasterData\IncidentType;
use App\Models\User;

class AccidentNotificationSampleSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil data master untuk relasi
        $ccow = Ccow::where('name', 'LIKE', '%Maruwai Coal%')->first();
        $company = Company::where('name', 'LIKE', '%Saptaindra Sejati%')->first();
        $location = Location::where('name', 'LIKE', '%KM 30%')->first() ?? Location::first();
        $type = IncidentType::where('description', 'LIKE', '%Vehicle%')->first() ?? IncidentType::first();
        $user = User::first();

        // Ambil status secara dinamis
        $statusId = DB::table('m_statuses')->where('name', 'Submitted')->value('id')
            ?? DB::table('m_statuses')->where('name', 'Open')->value('id')
            ?? 1;

        $now = now();

        DB::table('accident_notifications')->insert([
            [
                'id'                  => 1,
                'ccow_id'             => $ccow?->id ?? 1,
                'company_id'          => $company?->id ?? 1,
                'location_id'         => $location?->id ?? 1,
                'incident_type_id'    => $type?->id ?? 1,
                'incident_date'       => '2024-01-22',
                'incident_time'       => '10:30:00',
                'is_hpri'             => false,
                'unit'                => 'DT-1234',
                'company_contractor_id' => $company?->id ?? 1,
                
                // Keparahan Aktual
                'actual_k3'           => 0,
                'actual_kk'           => 0,
                'actual_lh'           => 0,
                'actual_ksl'          => 1,
                'actual_pp'           => 1,

                // Keparahan Potensial
                'potential_k3'        => 1,
                'potential_kk'        => 1,
                'potential_lh'        => 0,
                'potential_ksl'       => 2,
                'potential_pp'       => 2,

                'chronology'          => 'Pada pukul 10:30, Driver mengantuk saat membawa unit DT-1234 di area Access Road KM 30 sehingga unit keluar jalur dan terperosok ke parit.',
                
                'incident_facts'      => json_encode([
                    'Kondisi jalan sedang licin pasca hujan.',
                    'Driver kurang istirahat malam sebelumnya.',
                    'Kondisi ban unit masih dalam keadaan baik.'
                ]),
                
                'corrective_actions'  => json_encode([
                    'Melakukan coaching kepada driver terkait kelelahan (fatigue).',
                    'Melakukan perbaikan pada bahu jalan di KM 30.',
                    'Memastikan checklist P2H dilakukan dengan benar.'
                ]),

                'consequence_human'       => 'Tidak ada cedera pada manusia.',
                'consequence_tool'        => 'Kerusakan ringan pada bumper depan unit.',
                'consequence_environment' => 'Tidak ada tumpahan oli ke tanah.',

                'reporter_name'       => 'Budi Santoso',
                'reporter_position'   => 'Safety Officer',
                'approver_name'       => 'Ahmad Fauzi',
                'approver_position'   => 'Safety Manager',
                
                'status_id'           => $statusId,
                'created_by'          => $user?->id ?? 1,
                'created_at'          => $now,
                'updated_at'          => $now,
            ],
            [
                'id'                  => 2,
                'ccow_id'             => $ccow?->id ?? 1,
                'company_id'          => $company?->id ?? 1,
                'location_id'         => $location?->id ?? 1,
                'incident_type_id'    => $type?->id ?? 1,
                'incident_date'       => '2024-01-22',
                'incident_time'       => '10:30:00',
                'is_hpri'             => false,
                'unit'                => 'DT-5678',
                'company_contractor_id' => $company?->id ?? 1,
                
                // Keparahan Aktual
                'actual_k3'           => 0,
                'actual_kk'           => 0,
                'actual_lh'           => 0,
                'actual_ksl'          => 1,
                'actual_pp'           => 1,

                // Keparahan Potensial
                'potential_k3'        => 1,
                'potential_kk'        => 1,
                'potential_lh'        => 0,
                'potential_ksl'       => 2,
                'potential_pp'       => 2,

                'chronology'          => 'Driver unit DT-5678 melaju terlalu cepat di tikungan jalan tambang KM 15, menyebabkan unit tergelincir.',
                
                'incident_facts'      => json_encode([
                    'Kecepatan unit melebihi batas batas kecepatan tambang.',
                    'Kondisi jalan berdebu.'
                ]),
                
                'corrective_actions'  => json_encode([
                    'Sosialisasi ulang batas kecepatan di area tambang.',
                    'Penyiraman jalan tambang secara berkala.'
                ]),

                'consequence_human'       => 'Tidak ada cedera.',
                'consequence_tool'        => 'Kerusakan ban depan kiri.',
                'consequence_environment' => 'Tidak ada.',

                'reporter_name'       => 'Budi Santoso',
                'reporter_position'   => 'Safety Officer',
                'approver_name'       => 'Ahmad Fauzi',
                'approver_position'   => 'Safety Manager',
                
                'status_id'           => $statusId,
                'created_by'          => $user?->id ?? 1,
                'created_at'          => $now,
                'updated_at'          => $now,
            ]
        ]);
    }
}
