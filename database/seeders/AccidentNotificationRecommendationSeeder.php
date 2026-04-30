<?php

namespace Database\Seeders;

use App\Models\AccidentNotification;
use App\Models\MasterData\Ccow;
use App\Models\MasterData\Company;
use App\Models\MasterData\Location;
use App\Models\MasterData\IncidentType;
use App\Models\MasterData\Status;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AccidentNotificationRecommendationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Prepare Master Data
        $ccow = Ccow::firstOrCreate(
            ['inisial' => 'LC'],
            ['name' => 'PT Lahai Coal']
        );

        $company = Company::firstOrCreate(
            ['name' => 'PT Putra Perkasa Abadi']
        );

        $location = Location::firstOrCreate(
            ['name' => 'PIT LAUNG DANUM HAJU'],
            ['ccow_id' => $ccow->id]
        );

        $locationDetail = Location::firstOrCreate(
            ['name' => 'Blok 1 Pit Danum'],
            [
                'ccow_id' => $ccow->id,
                'parent_id' => $location->id
            ]
        );

        $incidentType = IncidentType::firstOrCreate(
            ['category' => 'Property Damage'],
            ['description' => 'Kerusakan Properti/Alat']
        );

        // Workflow Status
        $approvedStatus = Status::firstOrCreate(['name' => 'Approved']);

        // 2. Create Accident Notification based on Images
        AccidentNotification::updateOrCreate(
            [
                'accident_number' => '01/IR-LC/I/2026',
                'notification_number' => '01/NI-LC/I/2026',
            ],
            [
                'ccow_id' => $ccow->id,
                'company_id' => $company->id,
                'location_id' => $location->id,
                'location_detail_id' => $locationDetail->id,
                'incident_type_id' => $incidentType->id,
                'status_id' => $approvedStatus->id,
                
                // Image 1 & 2
                'incident_date' => '2026-01-01',
                'incident_time' => '09:40:00',
                'incident_title' => 'Kaca Kabin EX-365 Pecah Terkena Lenting',
                'incident_consequence' => 'Kaca depan pecah',
                
                // Image 3 (Victim Data)
                'victim_name' => 'Gusti Jamal Basri',
                'victim_gender' => 'Pria',
                'victim_age' => 25,
                'victim_age_interval' => '>= 20 s/d < 25',
                'victim_position' => 'Operator',
                'victim_position_detail' => 'Operator Excavator',
                'victim_experience' => '> 2 - 5 Tahun',
                
                // Image 4
                'department' => 'Mining Operations',
                'is_hpri' => false,
                
                // Image 5
                'actual_cost' => 5868200,
                'lpks_lpkl' => 'LPKS',
                'due_date' => '2026-01-06',
                'presentation_date' => '2026-01-04',
                'submit_date' => '2026-01-08',
                'report_status' => 'Closed Overdue',
                'presentation_invitation' => 'DONE',
                
                // Supplemental (Chronology/Facts from image content)
                'chronology' => 'Kaca Kabin EX-365-006 Pecah Terkena Lentingan Material Batu saat operasional.',
                'incident_facts' => ['Kaca depan pecah total', 'Material batu melenting dari bucket'],
                'corrective_actions' => ['Penggantian kaca kabin baru', 'Re-sosialisasi jarak aman operasional'],
                'reporter_name' => 'Safety Officer',
                'reporter_position' => 'Supervisor',
                'approver_name' => 'Kadis a/n KaIT',
                'approver_position' => 'Project Manager',
            ]
        );
    }
}
