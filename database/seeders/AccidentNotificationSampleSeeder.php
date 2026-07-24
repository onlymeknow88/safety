<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AccidentNotificationSampleSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus data lama berdasarkan id dan juga nomor yang mungkin konflik
        DB::table('analisa_kecelakaan')->whereIn('accident_notification_id', [1, 2])->delete();
        DB::table('accident_notifications')->whereIn('id', [1, 2])->delete();
        // Hapus juga record yang mungkin punya notification_number konflik dari seeder sebelumnya
        DB::table('accident_notifications')
            ->where('notification_number', 'like', '%/NI-JC/I/2026')
            ->orWhere('notification_number', 'like', '%/NI-JC/II/2026')
            ->delete();

        $ccow     = DB::table('m_ccows')->where('is_active', true)->first();
        $company  = DB::table('m_company')->where('is_active', true)->first();
        $location = DB::table('m_locations')->where('is_active', true)->first();
        $type     = DB::table('m_incident_types')->where('is_active', true)->first();
        $dept     = DB::table('m_department')->where('is_active', true)->first();
        $status   = DB::table('m_statuses')->where('name', 'Approved')->first()
                 ?? DB::table('m_statuses')->where('name', 'Submitted')->first()
                 ?? DB::table('m_statuses')->orderBy('id')->first();
        $reporter = DB::table('m_employees')->where('is_active', true)->first();
        $approver = DB::table('m_employees')->where('is_active', true)->skip(1)->first()
                 ?? $reporter;

        $ccowId     = $ccow?->id     ?? 1;
        $companyId  = $company?->id  ?? 1;
        $locationId = $location?->id ?? 1;
        $typeId     = $type?->id     ?? 1;
        $deptId     = $dept?->id     ?? 1;
        $statusId   = $status?->id   ?? 1;
        $reporterId = $reporter?->id ?? null;
        $approverId = $approver?->id ?? null;

        // Helper: ambil day_id berdasarkan tanggal
        $getDayId = function (string $date): int {
            $daysMap = [0 => 'Minggu', 1 => 'Senin', 2 => 'Selasa', 3 => 'Rabu', 4 => 'Kamis', 5 => 'Jumat', 6 => 'Sabtu'];
            $dayName = $daysMap[Carbon::parse($date)->dayOfWeek];
            return DB::table('m_days')->where('name', $dayName)->value('id') ?? 1;
        };

        // Helper: generate nomor urut
        $ccowRow  = DB::table('m_ccows')->where('id', $ccowId)->first();
        $ccowCode = $ccowRow ? strtoupper($ccowRow->inisial ?? 'LC') : 'LC';

        $makeNumbers = function (string $date, int $ccowId, string $ccowCode): array {
            $d    = Carbon::parse($date);
            $year = $d->format('Y');
            $rm   = ['01'=>'I','02'=>'II','03'=>'III','04'=>'IV','05'=>'V','06'=>'VI',
                     '07'=>'VII','08'=>'VIII','09'=>'IX','10'=>'X','11'=>'XI','12'=>'XII'];
            $seq  = sprintf('%02d', DB::table('accident_notifications')
                ->where('ccow_id', $ccowId)->whereYear('incident_date', $year)->count() + 1);
            $mon  = $rm[$d->format('m')];
            return [
                'notification_number' => "{$seq}/NI-{$ccowCode}/{$mon}/{$year}",
                'accident_number'     => "{$seq}/IR-{$ccowCode}/{$mon}/{$year}",
                'hse_alert_no'        => "{$seq}/HSE-{$ccowCode}/{$mon}/{$year}",
            ];
        };

        // ── Record 1 ─────────────────────────────────────────────────────────
        $date1 = '2026-01-22';
        $nums1 = $makeNumbers($date1, $ccowId, $ccowCode);
        DB::table('accident_notifications')->insert([
            'id'                      => 1,
            'uuid'                    => (string) Str::uuid(),
            'notification_number'     => $nums1['notification_number'],
            'accident_number'         => $nums1['accident_number'],
            'hse_alert_no'            => $nums1['hse_alert_no'],
            'incident_title'          => 'DT-1234 Keluar Jalur di KM 30',
            'incident_date'           => $date1,
            'incident_time'           => '10:30:00',
            'day_id'                  => $getDayId($date1),
            'ccow_id'                 => $ccowId,
            'company_id'              => $companyId,
            'company_contractor_id'   => $companyId,
            'department_id'           => $deptId,
            'location_id'             => $locationId,
            'location_detail'         => 'Access Road KM 30, dekat tikungan tajam arah Disposal',
            'incident_type_id'        => $typeId,
            'is_hpri'                 => false,
            'unit'                    => 'DT-1234',
            'actual_k3'               => 1,
            'actual_kk'               => 0,
            'actual_lh'               => 0,
            'actual_ksl'              => 1,
            'actual_pp'               => 1,
            'potential_k3'            => 2,
            'potential_kk'            => 1,
            'potential_lh'            => 0,
            'potential_ksl'           => 2,
            'potential_pp'            => 2,
            'chronology'              => 'Pada pukul 10:30, driver mengantuk saat membawa unit DT-1234 di area Access Road KM 30 sehingga unit keluar jalur dan terperosok ke parit. Kondisi jalan licin pasca hujan memperparah situasi.',
            'incident_facts'          => json_encode([
                'Kondisi jalan sedang licin pasca hujan lebat.',
                'Driver kurang istirahat malam sebelumnya (fatigue).',
                'Kondisi ban unit masih dalam keadaan baik (sudah dicek saat P2H).',
                'Tidak ada rambu peringatan jalan licin di titik tersebut.',
            ]),
            'corrective_actions'      => json_encode([
                'Melakukan coaching kepada driver terkait manajemen kelelahan (fatigue).',
                'Melakukan perbaikan dan pemadatan bahu jalan di KM 30.',
                'Memastikan checklist P2H dilakukan dengan benar setiap shift.',
                'Pemasangan rambu peringatan jalan licin di area rawan.',
            ]),
            'consequence_human'       => 'Tidak ada cedera pada manusia. Driver dalam kondisi selamat.',
            'consequence_tool'        => 'Kerusakan ringan pada bumper depan dan lampu kanan unit DT-1234.',
            'consequence_environment' => 'Tidak ada tumpahan oli atau bahan kimia ke tanah.',
            'reporter_id'             => $reporterId,
            'reporter_name'           => $reporter ? ($reporter->name ?? 'Budi Santoso') : 'Budi Santoso',
            'reporter_position'       => 'Safety Officer',
            'approver_id'             => $approverId,
            'approver_name'           => $approver ? ($approver->name ?? 'Ahmad Fauzi') : 'Ahmad Fauzi',
            'approver_position'       => 'Safety Manager',
            'status_id'               => $statusId,
            'has_lpks_lpkl'           => false,
            'created_by'              => 'Seeder',
            'updated_by'              => 'Seeder',
            'created_at'              => Carbon::parse($date1)->subDay(),
            'updated_at'              => Carbon::parse($date1),
        ]);

        // ── Record 2 ─────────────────────────────────────────────────────────
        $date2 = '2026-02-10';
        $nums2 = $makeNumbers($date2, $ccowId, $ccowCode);
        DB::table('accident_notifications')->insert([
            'id'                      => 2,
            'uuid'                    => (string) Str::uuid(),
            'notification_number'     => $nums2['notification_number'],
            'accident_number'         => $nums2['accident_number'],
            'hse_alert_no'            => $nums2['hse_alert_no'],
            'incident_title'          => 'DT-5678 Melaju Kencang di KM 15',
            'incident_date'           => $date2,
            'incident_time'           => '14:15:00',
            'day_id'                  => $getDayId($date2),
            'ccow_id'                 => $ccowId,
            'company_id'              => $companyId,
            'company_contractor_id'   => $companyId,
            'department_id'           => $deptId,
            'location_id'             => $locationId,
            'location_detail'         => 'Jalan Tambang KM 15, tikungan dekat pit barat',
            'incident_type_id'        => $typeId,
            'is_hpri'                 => true,
            'unit'                    => 'DT-5678',
            'actual_k3'               => 2,
            'actual_kk'               => 1,
            'actual_lh'               => 0,
            'actual_ksl'              => 2,
            'actual_pp'               => 1,
            'potential_k3'            => 3,
            'potential_kk'            => 2,
            'potential_lh'            => 1,
            'potential_ksl'           => 3,
            'potential_pp'            => 2,
            'chronology'              => 'Driver unit DT-5678 melaju melebihi batas kecepatan tambang (>40 km/jam) saat memasuki tikungan KM 15, menyebabkan unit tergelincir dan menabrak tanggul pengaman. Driver sempat terbentur dashboard namun menggunakan seatbelt sehingga tidak terpental.',
            'incident_facts'          => json_encode([
                'Kecepatan unit terdeteksi 52 km/jam dari data GPS (batas 40 km/jam).',
                'Kondisi jalan berdebu dan visibilitas rendah.',
                'Tanggul pengaman di tikungan KM 15 dalam kondisi kurang baik.',
                'Driver tidak melaporkan kondisi fatigue saat briefing pagi.',
            ]),
            'corrective_actions'      => json_encode([
                'Sosialisasi ulang batas kecepatan di seluruh area tambang.',
                'Penyiraman jalan tambang secara berkala setiap 2 jam.',
                'Perbaikan tanggul pengaman di tikungan KM 15.',
                'Review dan perbaikan sistem monitoring GPS kecepatan unit.',
            ]),
            'consequence_human'       => 'Driver mengalami memar ringan di dada akibat benturan dengan seatbelt. Telah mendapat pertolongan pertama.',
            'consequence_tool'        => 'Kerusakan pada ban depan kiri, bumper, dan lampu depan unit DT-5678. Estimasi biaya perbaikan Rp 15.000.000.',
            'consequence_environment' => 'Tidak ada tumpahan bahan berbahaya. Debu beterbangan sesaat setelah insiden.',
            'reporter_id'             => $reporterId,
            'reporter_name'           => $reporter ? ($reporter->name ?? 'Budi Santoso') : 'Budi Santoso',
            'reporter_position'       => 'Safety Officer',
            'approver_id'             => $approverId,
            'approver_name'           => $approver ? ($approver->name ?? 'Ahmad Fauzi') : 'Ahmad Fauzi',
            'approver_position'       => 'Safety Manager',
            'status_id'               => $statusId,
            'has_lpks_lpkl'           => false,
            'created_by'              => 'Seeder',
            'updated_by'              => 'Seeder',
            'created_at'              => Carbon::parse($date2)->subDay(),
            'updated_at'              => Carbon::parse($date2),
        ]);
    }
}

