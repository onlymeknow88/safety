<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalisaKecelakaanSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Fetch multiple active Companies and Departments
        $companies = DB::table('m_company')->where('is_active', true)->limit(5)->pluck('id')->toArray();
        if (empty($companies)) {
            $companies = [1];
        }

        $departments = DB::table('m_department')->where('is_active', true)->limit(5)->pluck('id')->toArray();
        if (empty($departments)) {
            $departments = [1];
        }

        $ccows = DB::table('m_ccows')->where('is_active', true)->pluck('id')->toArray();
        if (empty($ccows)) {
            $ccows = [1];
        }

        $locations = DB::table('m_locations')->where('is_active', true)->pluck('id')->toArray();
        if (empty($locations)) {
            $locations = [1];
        }

        $incidentTypes = DB::table('m_incident_types')->where('is_active', true)->pluck('id')->toArray();
        if (empty($incidentTypes)) {
            $incidentTypes = [1];
        }

        $sources = DB::table('m_sources')->where('is_active', true)->pluck('id')->toArray();
        if (empty($sources)) {
            $sources = [1];
        }

        $injuryConditions = DB::table('m_injury_conditions')->where('is_active', true)->pluck('id')->toArray();
        if (empty($injuryConditions)) {
            $injuryConditions = [1];
        }

        $bodyParts = DB::table('m_body_parts')->where('is_active', true)->pluck('id')->toArray();
        if (empty($bodyParts)) {
            $bodyParts = [1];
        }

        // Ensure notifications and reports 2, 3, 4, 5, 6, 7, 8 are seeded
        $incidents = [
            [
                'id' => 2,
                'title' => 'DT-5678 Tergelincir di Disposal',
                'date' => '2026-05-20',
                'unit' => 'DT-5678',
                'is_hpri' => false,
                'status' => 'Waiting for PJA',
                'current_level' => 'PJA',
                'report_type' => 'LPKS',
                'report_num' => '01/LPKS-LC/V/2026',
                'lost_days' => 0,
                'actual_cost' => 0.00,
                'potential_cost' => 0.00,
                'unsafe_actions' => [1],
                'unsafe_conditions' => [4],
                'personal_factors' => null,
                'job_factors' => null,
                'spill_qty' => 0,
                'pica' => [
                    [
                        'pic' => 'Safety Officer',
                        'action' => 'Coaching driver fatigue',
                        'status' => 'Open',
                        'cause_code' => 'USA - 1',
                        'cause_text' => 'Menjalankan pekerjaan tanpa otorisasi',
                        'target_date' => '2026-05-25',
                        'recommendation_id' => 2
                    ]
                ],
                'approved' => false,
                'safe_draft' => false
            ],
            [
                'id' => 3,
                'title' => 'Tabrakan LV-9999 dengan Tanggul',
                'date' => '2026-06-01',
                'unit' => 'LV-9999',
                'is_hpri' => true,
                'status' => 'Completed',
                'current_level' => 'COMPLETED',
                'report_type' => 'LPKS',
                'report_num' => '02/LPKS-LC/VI/2026',
                'lost_days' => 5,
                'actual_cost' => 5000000.00,
                'potential_cost' => 12000000.00,
                'unsafe_actions' => [4],
                'unsafe_conditions' => [4],
                'personal_factors' => [1],
                'job_factors' => [2],
                'spill_qty' => 0,
                'pica' => [
                    [
                        'pic' => 'Mandor Disposal',
                        'action' => 'Pemasangan rambu batas kecepatan 20 km/jam di tikungan disposal',
                        'status' => 'Closed',
                        'cause_code' => 'USC - 4',
                        'cause_text' => 'Keterbatasan gerak/tempat',
                        'target_date' => '2026-06-05',
                        'recommendation_id' => 2
                    ],
                    [
                        'pic' => 'Supervisor OHS',
                        'action' => 'Coaching driver LV-9999 terkait tata tertib batas kecepatan tambang',
                        'status' => 'Open',
                        'cause_code' => 'USA - 4',
                        'cause_text' => 'Mengoperasikan dengan kecepatan tidak layak',
                        'target_date' => '2026-06-15',
                        'recommendation_id' => 4
                    ]
                ],
                'approved' => true
            ],
            [
                'id' => 4,
                'title' => 'Kegagalan Sistem Rem DT-8888',
                'date' => '2026-05-15',
                'unit' => 'DT-8888',
                'is_hpri' => false,
                'status' => 'Completed',
                'current_level' => 'COMPLETED',
                'report_type' => 'LPKS',
                'report_num' => '03/LPKS-LC/V/2026',
                'lost_days' => 0,
                'actual_cost' => 85000000.00,
                'potential_cost' => 150000000.00,
                'unsafe_actions' => [3],
                'unsafe_conditions' => [3],
                'personal_factors' => [2],
                'job_factors' => [3],
                'spill_qty' => 0,
                'pica' => [
                    [
                        'pic' => 'Mekanik Workshop',
                        'action' => 'Perbaikan sistem rem unit DT-8888',
                        'status' => 'Closed',
                        'cause_code' => 'USC - 3',
                        'cause_text' => 'Peralatan/material yang rusak',
                        'target_date' => '2026-05-20',
                        'recommendation_id' => 3
                    ]
                ],
                'approved' => true
            ],
            [
                'id' => 5,
                'title' => 'Pecah Selang Hyd Excavator PC-200',
                'date' => '2026-04-10',
                'unit' => 'PC-200',
                'is_hpri' => true,
                'status' => 'Completed',
                'current_level' => 'COMPLETED',
                'report_type' => 'LPKL',
                'report_num' => '04/LPKL-LC/IV/2026',
                'lost_days' => 10,
                'actual_cost' => 15000000.00,
                'potential_cost' => 30000000.00,
                'unsafe_actions' => [6],
                'unsafe_conditions' => [1],
                'personal_factors' => [3],
                'job_factors' => [1],
                'spill_qty' => 75,
                'pica' => [
                    [
                        'pic' => 'Env Officer',
                        'action' => 'Pemasangan oil boom di sekitar tumpahan oli',
                        'status' => 'Closed',
                        'cause_code' => 'USC - 1',
                        'cause_text' => 'Pelindung/pembatas tidak layak',
                        'target_date' => '2026-04-12',
                        'recommendation_id' => 1
                    ]
                ],
                'approved' => true
            ],
            [
                'id' => 6,
                'title' => 'Ban LV-1234 Slip di Ramp C',
                'date' => '2026-03-22',
                'unit' => 'LV-1234',
                'is_hpri' => false,
                'status' => 'Completed',
                'current_level' => 'COMPLETED',
                'report_type' => 'LPKS',
                'report_num' => '05/LPKS-LC/III/2026',
                'lost_days' => 2,
                'actual_cost' => 1200000.00,
                'potential_cost' => 3000000.00,
                'unsafe_actions' => [7],
                'unsafe_conditions' => [5],
                'personal_factors' => [1],
                'job_factors' => [4],
                'spill_qty' => 0,
                'pica' => [
                    [
                        'pic' => 'Safety Officer',
                        'action' => 'Sosialisasi pemakaian safety harness yang benar',
                        'status' => 'Closed',
                        'cause_code' => 'USA - 7',
                        'cause_text' => 'Penggunaan APD yang tidak layak',
                        'target_date' => '2026-03-25',
                        'recommendation_id' => 5
                    ]
                ],
                'approved' => true
            ],
            [
                'id' => 7,
                'title' => 'Fatigue Driver DT-1111 Tabrakan',
                'date' => '2026-02-18',
                'unit' => 'DT-1111',
                'is_hpri' => false,
                'status' => 'Completed',
                'current_level' => 'COMPLETED',
                'report_type' => 'LPKS',
                'report_num' => '06/LPKS-LC/II/2026',
                'lost_days' => 25,
                'actual_cost' => 24000000.00,
                'potential_cost' => 50000000.00,
                'unsafe_actions' => [1],
                'unsafe_conditions' => [2],
                'personal_factors' => [2],
                'job_factors' => [5],
                'spill_qty' => 0,
                'pica' => [
                    [
                        'pic' => 'HR Supervisor',
                        'action' => 'Verifikasi SIM T driver unit berat',
                        'status' => 'Closed',
                        'cause_code' => 'USA - 1',
                        'cause_text' => 'Menjalankan pekerjaan tanpa otorisasi',
                        'target_date' => '2026-02-22',
                        'recommendation_id' => 4
                    ]
                ],
                'approved' => true
            ],
            [
                'id' => 8,
                'title' => 'LV-4567 Amblas di Stockpile',
                'date' => '2026-01-05',
                'unit' => 'LV-4567',
                'is_hpri' => true,
                'status' => 'Completed',
                'current_level' => 'COMPLETED',
                'report_type' => 'LPKS',
                'report_num' => '07/LPKS-LC/I/2026',
                'lost_days' => 0,
                'actual_cost' => 0.00,
                'potential_cost' => 500000.00,
                'unsafe_actions' => [8],
                'unsafe_conditions' => [6],
                'personal_factors' => [2],
                'job_factors' => [2],
                'spill_qty' => 5,
                'pica' => [
                    [
                        'pic' => 'PJA Officer',
                        'action' => 'Pemasangan genset lampu penerangan portabel di stockpile',
                        'status' => 'Closed',
                        'cause_code' => 'USC - 6',
                        'cause_text' => 'Tata lingkungan yang buruk/tidak teratur',
                        'target_date' => '2026-01-10',
                        'recommendation_id' => 3
                    ]
                ],
                'approved' => true
            ]
        ];

        // Clear existing reports, approvals, and notifications for these IDs
        $targetIds = array_column($incidents, 'id');
        DB::table('analisa_kecelakaan_approvals')->whereIn('analisa_kecelakaan_id', $targetIds)->delete();
        DB::table('analisa_kecelakaan')->whereIn('id', $targetIds)->delete();
        DB::table('accident_notifications')->whereIn('id', $targetIds)->delete();

        $firstUserId = DB::table('users')->orderBy('id', 'asc')->value('id') ?? 1;

        // Seed with distributed fields
        foreach ($incidents as $index => $inc) {
            $assignedCompany = $companies[$index % count($companies)];
            $assignedDept = $departments[$index % count($departments)];
            $assignedCcow = $ccows[$index % count($ccows)];
            $assignedLocation = $locations[$index % count($locations)];
            $assignedIncidentType = $incidentTypes[$index % count($incidentTypes)];
            $assignedSource = $sources[$index % count($sources)];
            $assignedInjuryCondition = $injuryConditions[$index % count($injuryConditions)];
            $assignedBodyPart = $bodyParts[$index % count($bodyParts)];

            // Get CCOW Code dynamically
            $ccow = DB::table('m_ccows')->where('id', $assignedCcow)->first();
            $ccowCode = ($ccow && !empty($ccow->inisial)) ? strtoupper($ccow->inisial) : 'LC';

            // Parse date details for Roman month and sequence numbering
            $dateParsed = Carbon::parse($inc['date']);
            $year = $dateParsed->format('Y');
            $month = $dateParsed->format('m');
            $romanMonths = [
                '01' => 'I', '02' => 'II', '03' => 'III', '04' => 'IV', '05' => 'V', '06' => 'VI',
                '07' => 'VII', '08' => 'VIII', '09' => 'IX', '10' => 'X', '11' => 'XI', '12' => 'XII',
            ];
            $romanMonth = $romanMonths[$month];

            // Calculate sequence number dynamically per CCOW and Year
            $count = DB::table('accident_notifications')
                ->where('ccow_id', $assignedCcow)
                ->whereYear('incident_date', $year)
                ->count() + 1;
            $seq = sprintf('%02d', $count);

            $notificationNumber = "{$seq}/NI-{$ccowCode}/{$romanMonth}/{$year}";
            $accidentNumber = "{$seq}/IR-{$ccowCode}/{$romanMonth}/{$year}";
            $hseAlertNo = "{$seq}/HSE-{$ccowCode}/{$romanMonth}/{$year}";

            // Map day_id from the day of the week
            $daysMap = [
                0 => 'Minggu',
                1 => 'Senin',
                2 => 'Selasa',
                3 => 'Rabu',
                4 => 'Kamis',
                5 => 'Jumat',
                6 => 'Sabtu'
            ];
            $dayOfWeek = $dateParsed->dayOfWeek;
            $dayName = $daysMap[$dayOfWeek];
            $dayId = DB::table('m_days')->where('name', $dayName)->value('id') ?? 1;

            // Ensure Notification exists
            $this->ensureAccidentNotification(
                $inc['id'],
                $inc['title'],
                $inc['date'],
                $inc['unit'],
                $inc['is_hpri'],
                $assignedCcow,
                $assignedCompany,
                $assignedDept,
                $assignedLocation,
                $assignedIncidentType,
                $notificationNumber,
                $accidentNumber,
                $hseAlertNo,
                $dayId
            );

            // Map unit to Mobile Equipment master data ID
            $unitName = $inc['unit'];
            $mobileEquipmentName = 'Others';
            if (stripos($unitName, 'DT') !== false) {
                $mobileEquipmentName = 'Dump Truck/Trailer/Truck';
            } elseif (stripos($unitName, 'LV') !== false) {
                $mobileEquipmentName = 'Light Vehicle';
            } elseif (stripos($unitName, 'PC') !== false) {
                $mobileEquipmentName = 'Excavator';
            }
            $mobileEquipmentId = DB::table('m_mobile_equipments')->where('name', $mobileEquipmentName)->value('id');

            // Construct report number corresponding to the assigned CCOW
            $reportNumber = "{$seq}/{$inc['report_type']}-{$ccowCode}/{$romanMonth}/{$year}";

            // Insert Investigation Report
            $reportId = DB::table('analisa_kecelakaan')->insertGetId([
                'id' => $inc['id'],
                'accident_notification_id' => $inc['id'],
                'report_type' => $inc['report_type'],
                'report_number' => $reportNumber,
                'investigation_status' => $inc['status'],
                'current_approval_level' => $inc['current_level'],
                'is_environmental' => $inc['spill_qty'] > 0,
                'investigation_detail' => "Detail kronologi dan analisis investigasi lengkap untuk kecelakaan unit {$inc['unit']}.",
                'root_cause_analysis' => "Analisis akar penyebab kecelakaan unit {$inc['unit']}.",
                'corrective_action_plan' => json_encode($inc['pica']),
                'preventive_action' => 'Melakukan pencegahan dan pelatihan ulang pekerja.',
                'safe_draft' => isset($inc['safe_draft']) ? $inc['safe_draft'] : !$inc['approved'],
                'ktt_approved' => $inc['approved'],
                'ohs_approved' => $inc['approved'],
                'env_approved' => $inc['approved'] && ($inc['spill_qty'] > 0),
                'pja_approved' => $inc['approved'],
                'created_by' => 'Admin Seeder',
                'updated_by' => 'Admin Seeder',
                'created_at' => Carbon::parse($inc['date'])->addHours(4),
                'updated_at' => Carbon::parse($inc['date'])->addDays(1),
                'incident_type_id' => $assignedIncidentType,
                'source_id' => $assignedSource,
                'mobile_equipment_id' => $mobileEquipmentId,
                'work_experience_interval_id' => 1,
                'hour_of_shift' => '4',
                'injury_condition_id' => $assignedInjuryCondition,
                'body_part_id' => $assignedBodyPart,
                'environmental_pollution_qty' => $inc['spill_qty'],
                'lost_days' => $inc['lost_days'],
                'actual_cost' => $inc['actual_cost'],
                'potential_cost' => $inc['potential_cost'],
                'unsafe_actions' => json_encode($inc['unsafe_actions']),
                'unsafe_conditions' => json_encode($inc['unsafe_conditions']),
                'personal_factors' => $inc['personal_factors'] ? json_encode($inc['personal_factors']) : null,
                'job_factors' => $inc['job_factors'] ? json_encode($inc['job_factors']) : null,
                'cause_details' => json_encode([
                    [
                        'code' => 'USA - 1',
                        'cause' => 'Tindakan tidak aman teridentifikasi.',
                        'analysis_explanation' => 'Diperlukan tindakan korektif segera.'
                    ]
                ]),
                'investigation_checklist' => json_encode([
                    'q1' => 1, 'q2' => 1, 'q3' => 1, 'q4' => 0, 'q5' => 1,
                    'q6' => 1, 'q7' => 1, 'q8' => 0, 'q9' => 1, 'q10' => 1
                ])
            ]);

            // Seed approvals
            $levels = ['KTT', 'OHS_DH', 'PJA'];
            if ($inc['spill_qty'] > 0) {
                $levels = ['KTT', 'OHS_DH', 'ENV_DH', 'PJA'];
            }

            foreach ($levels as $lvl) {
                DB::table('analisa_kecelakaan_approvals')->insert([
                    'analisa_kecelakaan_id' => $reportId,
                    'approval_level' => $lvl,
                    'approved_by' => $inc['approved'] ? $firstUserId : null,
                    'comment' => $inc['approved'] ? "Disetujui untuk level {$lvl}." : null,
                    'tick_box' => $inc['approved'],
                    'status' => $inc['approved'] ? 'Approved' : 'Pending',
                    'approved_at' => $inc['approved'] ? Carbon::parse($inc['date'])->addDays(1) : null,
                    'created_at' => Carbon::parse($inc['date'])->addHours(4),
                    'updated_at' => Carbon::parse($inc['date'])->addDays(1)
                ]);
            }

            // Update status di accident_notifications
            $inInvestigationStatus = DB::table('m_statuses')->where('name', 'In Investigation')->value('id') ?? 1;
            DB::table('accident_notifications')
                ->where('id', $inc['id'])
                ->update([
                    'has_lpks_lpkl' => true,
                    'lpks_lpkl' => $inc['report_type'],
                    'status_id' => $inInvestigationStatus
                ]);
        }
    }

    private function ensureAccidentNotification(
        int $id,
        string $title,
        string $date,
        string $unit,
        bool $isHpri,
        int $ccowId,
        int $companyId,
        int $deptId,
        int $locationId,
        int $incidentTypeId,
        string $notificationNumber,
        string $accidentNumber,
        string $hseAlertNo,
        int $dayId
    ): void {
        $exists = DB::table('accident_notifications')->where('id', $id)->exists();
        if ($exists) {
            DB::table('accident_notifications')->where('id', $id)->delete();
        }

        $statusId = DB::table('m_statuses')->where('name', 'Approved')->value('id')
            ?? DB::table('m_statuses')->where('name', 'Open')->value('id')
            ?? 1;

        DB::table('accident_notifications')->insert([
            'id' => $id,
            'uuid' => (string) \Illuminate\Support\Str::uuid(),
            'incident_title' => $title,
            'notification_number' => $notificationNumber,
            'accident_number' => $accidentNumber,
            'hse_alert_no' => $hseAlertNo,
            'ccow_id' => $ccowId,
            'company_id' => $companyId,
            'department_id' => $deptId,
            'location_id' => $locationId,
            'incident_type_id' => $incidentTypeId,
            'incident_date' => $date,
            'day_id' => $dayId,
            'incident_time' => '14:20:00',
            'is_hpri' => $isHpri,
            'unit' => $unit,
            'company_contractor_id' => $companyId,
            'actual_k3' => 1,
            'actual_kk' => 0,
            'actual_lh' => 0,
            'actual_ksl' => 1,
            'actual_pp' => 1,
            'potential_k3' => $isHpri ? 3 : 1,
            'potential_kk' => 1,
            'potential_lh' => 0,
            'potential_ksl' => $isHpri ? 3 : 1,
            'potential_pp' => $isHpri ? 3 : 1,
            'chronology' => "Kecelakaan unit {$unit} di area tambang.",
            'consequence_human' => 'Tidak ada cedera fatal.',
            'consequence_tool' => 'Kerusakan ringan pada bodi unit.',
            'consequence_environment' => 'Tidak ada tumpahan bahan kimia.',
            'reporter_name' => 'Budi Santoso',
            'reporter_position' => 'Safety Officer',
            'approver_name' => 'Ahmad Fauzi',
            'approver_position' => 'Safety Manager',
            'status_id' => $statusId,
            'created_by' => 1,
            'created_at' => Carbon::parse($date)->subDay(),
            'updated_at' => Carbon::parse($date),
        ]);
    }
}
