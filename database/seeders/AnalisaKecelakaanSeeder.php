<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnalisaKecelakaanSeeder extends Seeder
{
    public function run(): void
    {
        // Seed the single investigation report into the renamed table
        $reportId = DB::table('analisa_kecelakaan')->insertGetId([
            'id' => 2,
            'accident_notification_id' => 2,
            'report_type' => 'LPKS',
            'report_number' => '01/LPKS-LC/V/2026',
            'investigation_status' => 'Draft',
            'current_approval_level' => 'KTT',
            'is_environmental' => false,
            'investigation_detail' => 'TES',
            'root_cause_analysis' => 'TES',
            'corrective_action_plan' => json_encode([
                [
                    'pic' => 'ACB',
                    'action' => 'tes 1',
                    'status' => 'Open',
                    'cause_code' => 'USA - 1',
                    'cause_text' => 'Menjalankan pekerjaan tanpa otorisasi',
                    'target_date' => '2026-05-25',
                    'recommendation_id' => 2
                ],
                [
                    'pic' => 'ASDAS',
                    'action' => 'TES2',
                    'status' => 'Open',
                    'cause_code' => 'USC - 4',
                    'cause_text' => 'Keterbatasan gerak/tempat',
                    'target_date' => '2026-05-27',
                    'recommendation_id' => 2
                ],
                [
                    'pic' => 'ASDAS',
                    'action' => 'TES3',
                    'status' => 'Open',
                    'cause_code' => 'USA - 4',
                    'cause_text' => 'Mengoperasikan dengan kecepatan tidak layak',
                    'target_date' => '2026-05-21',
                    'recommendation_id' => 4
                ],
                [
                    'pic' => 'ASD',
                    'action' => 'TES4',
                    'status' => 'Open',
                    'cause_code' => 'USA - 3',
                    'cause_text' => 'Gagal Mengamankan',
                    'target_date' => '2026-05-30',
                    'recommendation_id' => 5
                ],
                [
                    'pic' => 'ASDAS',
                    'action' => 'TES5',
                    'status' => 'Open',
                    'cause_code' => 'USA - 6',
                    'cause_text' => 'Menggunakan peralatan yang rusak',
                    'target_date' => '2026-05-28',
                    'recommendation_id' => 5
                ]
            ]),
            'preventive_action' => 'TES',
            'safe_draft' => true,
            'ktt_approved' => false,
            'ohs_approved' => false,
            'env_approved' => false,
            'pja_approved' => false,
            'created_by' => 'Admin 1',
            'updated_by' => 'Admin 1',
            'created_at' => '2026-05-23 12:26:08',
            'updated_at' => '2026-05-25 15:57:58',
            'incident_type_id' => null,
            'source_id' => null,
            'mobile_equipment' => null,
            'work_experience_interval_id' => null,
            'hour_of_shift' => null,
            'injury_condition_id' => null,
            'body_part_id' => null,
            'environmental_pollution_qty' => 0,
            'lost_days' => 0,
            'actual_cost' => 0.00,
            'potential_cost' => 0.00,
            'unsafe_actions' => json_encode([1, 6, 4, 3]),
            'unsafe_conditions' => json_encode([4]),
            'personal_factors' => null,
            'job_factors' => null,
            'cause_details' => json_encode([
                [
                    'code' => 'USA - 1',
                    'cause' => 'Menjalankan pekerjaan tanpa otorisasi',
                    'analysis_explanation' => 'USA1'
                ],
                [
                    'code' => 'USC - 4',
                    'cause' => 'Keterbatasan gerak/tempat',
                    'analysis_explanation' => 'USC4'
                ],
                [
                    'code' => 'USA - 4',
                    'cause' => 'Mengoperasikan dengan kecepatan tidak layak',
                    'analysis_explanation' => 'USA4'
                ],
                [
                    'code' => 'USA - 3',
                    'cause' => 'Gagal Mengamankan',
                    'analysis_explanation' => 'USA3'
                ],
                [
                    'code' => 'USA - 6',
                    'cause' => 'Menggunakan peralatan yang rusak',
                    'analysis_explanation' => 'USA6'
                ]
            ]),
            'investigation_checklist' => json_encode([
                'q1' => 1,
                'q2' => 1,
                'q3' => 0,
                'q4' => 0,
                'q5' => 1,
                'q6' => 1,
                'q7' => 0,
                'q8' => 0,
                'q9' => 1,
                'q10' => 1
            ])
        ]);

        // Seed approvals into the renamed approvals table
        DB::table('analisa_kecelakaan_approvals')->insert([
            [
                'analisa_kecelakaan_id' => $reportId,
                'approval_level' => 'KTT',
                'approved_by' => null,
                'comment' => null,
                'tick_box' => false,
                'status' => 'Pending',
                'approved_at' => null,
                'created_at' => '2026-05-23 12:26:08',
                'updated_at' => '2026-05-23 12:26:08'
            ],
            [
                'analisa_kecelakaan_id' => $reportId,
                'approval_level' => 'OHS_DH',
                'approved_by' => null,
                'comment' => null,
                'tick_box' => false,
                'status' => 'Pending',
                'approved_at' => null,
                'created_at' => '2026-05-23 12:26:08',
                'updated_at' => '2026-05-23 12:26:08'
            ],
            [
                'analisa_kecelakaan_id' => $reportId,
                'approval_level' => 'PJA',
                'approved_by' => null,
                'comment' => null,
                'tick_box' => false,
                'status' => 'Pending',
                'approved_at' => null,
                'created_at' => '2026-05-23 12:26:08',
                'updated_at' => '2026-05-23 12:26:08'
            ]
        ]);
    }
}
