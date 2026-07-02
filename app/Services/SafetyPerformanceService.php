<?php

namespace App\Services;

use App\Models\SafetyPerformance;
use App\Models\AccidentNotification;
use App\Models\MasterData\Manhour;
use App\Models\MasterData\Ccow;
use App\Models\MasterData\Company;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SafetyPerformanceService
{
    // === ID dari m_incident_types (terverifikasi dari DB) ===
    const INCIDENT_TYPE_FAI              = 4;   // First Aid Injury
    const INCIDENT_TYPE_MTI              = 5;   // Medical Treatment Injury
    const INCIDENT_TYPE_PAK              = 6;   // Penyakit Akibat Kerja
    const INCIDENT_TYPE_KAPTK            = 7;   // Kejadian Akibat Penyakit Tenaga Kerja
    const INCIDENT_TYPE_PENCEMARAN       = 8;   // Pencemaran Lingkungan
    const INCIDENT_TYPE_PROPERTY_DAMAGE  = 10;  // Property Damage
    const INCIDENT_TYPE_NEARMISS         = 11;  // Nearmiss
    const INCIDENT_TYPE_CIDERA_RINGAN    = 1;   // Kecelakaan Tambang - cidera ringan
    const INCIDENT_TYPE_CIDERA_BERAT     = 2;   // Kecelakaan Tambang - cidera berat
    const INCIDENT_TYPE_MATI             = 3;   // Kecelakaan Tambang - mati
    const INCIDENT_TYPE_FATALITY         = 13;  // Fatality
    const INCIDENT_TYPE_LTI              = 14;  // Lost Time Incident

    // Semua ID kategori Kecelakaan Tambang (untuk LTI-FR)
    const LTI_TYPE_IDS = [1, 2, 3, 13, 14];

    /**
     * Sinkronisasi data insiden -> safety_performances untuk 1 bulan
     */
    public function syncMonth(int $tahun, int $bulan): SafetyPerformance
    {
        // Pengecualian status Draft (1) dan Returned (4)
        $validStatusIds = DB::table('m_statuses')
            ->whereNotIn('name', ['Draft', 'Returned'])
            ->pluck('id')
            ->toArray();

        // 1. Ambil semua insiden bulan ini
        $incidents = AccidentNotification::whereYear('incident_date', $tahun)
            ->whereMonth('incident_date', $bulan)
            ->whereIn('status_id', $validStatusIds)
            ->with('investigationReport')
            ->get();

        // 2. Hitung berdasarkan incident_type_id (menggunakan tipe dari analisa_kecelakaan jika ada, fallback ke accident_notifications)
        $fai = 0;
        $mti = 0;
        $nearmiss = 0;
        $propertyDamage = 0;
        $cideraRingan = 0;
        $cideraBerat = 0;
        $mati = 0;
        $kaptk = 0;
        $pak = 0;
        $hpri = 0;
        $nonHpri = 0;
        $pencemaranMinor = 0;
        $pencemaranMayor = 0;
        $pencemaranKritikal = 0;

        foreach ($incidents as $inc) {
            $ir = $inc->investigationReport;
            $typeId = ($ir && $ir->incident_type_id) ? $ir->incident_type_id : $inc->incident_type_id;

            if ($typeId == self::INCIDENT_TYPE_FAI) {
                $fai++;
            } elseif ($typeId == self::INCIDENT_TYPE_MTI) {
                $mti++;
            } elseif ($typeId == self::INCIDENT_TYPE_NEARMISS) {
                $nearmiss++;
            } elseif ($typeId == self::INCIDENT_TYPE_PROPERTY_DAMAGE) {
                $propertyDamage++;
            } elseif ($typeId == self::INCIDENT_TYPE_CIDERA_RINGAN) {
                $cideraRingan++;
            } elseif ($typeId == self::INCIDENT_TYPE_CIDERA_BERAT) {
                $cideraBerat++;
            } elseif (in_array($typeId, [self::INCIDENT_TYPE_MATI, self::INCIDENT_TYPE_FATALITY])) {
                $mati++;
            } elseif ($typeId == self::INCIDENT_TYPE_KAPTK) {
                $kaptk++;
            } elseif ($typeId == self::INCIDENT_TYPE_PAK) {
                $pak++;
            } elseif ($typeId == self::INCIDENT_TYPE_PENCEMARAN) {
                // Pencemaran lingkungan - kelompokkan dari actual_lh (severity score lingkungan)
                // 1-2 = Minor, 3-4 = Mayor, 5 = Kritikal
                $severity = $inc->actual_lh;
                if (in_array($severity, [1, 2])) {
                    $pencemaranMinor++;
                } elseif (in_array($severity, [3, 4])) {
                    $pencemaranMayor++;
                } elseif ($severity == 5) {
                    $pencemaranKritikal++;
                }
            }

            // Hitung HPRI vs Non-HPRI
            if ($inc->is_hpri) {
                $hpri++;
            } else {
                $nonHpri++;
            }
        }

        // 3. Hari hilang dan biaya dari analisa_kecelakaan
        $analyses = $incidents->map(fn($i) => $i->investigationReport)->filter();
        
        $data = [
            'count_all_incident'    => $incidents->count(),
            'count_fai'             => $fai,
            'count_mti'             => $mti,
            'count_nearmiss'        => $nearmiss,
            'count_property_damage' => $propertyDamage,
            'count_cidera_ringan'   => $cideraRingan,
            'count_cidera_berat'    => $cideraBerat,
            'count_mati'            => $mati,
            'count_kaptk'           => $kaptk,
            'count_pak'             => $pak,
            'count_hpri'            => $hpri,
            'count_non_hpri'        => $nonHpri,
            'lingkungan_minor'      => $pencemaranMinor,
            'lingkungan_mayor'      => $pencemaranMayor,
            'lingkungan_kritikal'   => $pencemaranKritikal,
            'hari_hilang'           => $analyses->sum('lost_days'),
            'actual_cost'           => $analyses->sum('actual_cost'),
            'potential_cost'        => $analyses->sum('potential_cost'),
        ];

        // 4. Manhours dari m_manhours (aggregate total, semua CCOW dijumlah)
        $manhours = Manhour::where('tahun', $tahun)->where('bulan', $bulan)->get();
        
        // Identifikasi AMC vs Mitra
        // AMC adalah perusahaan yang namanya sama dengan CCOW (Juloi Coal, Lahai Coal, dll.)
        $amcCompanyIds = Company::whereIn('name', Ccow::pluck('name'))->pluck('id')->toArray();

        $existing = SafetyPerformance::where('tahun', $tahun)->where('bulan', $bulan)->first();

        $karyawan_amc = 0;
        $karyawan_mitra = 0;
        $manhour_amc = 0;
        $manhour_mitra = 0;
        $last_synced_at = null;

        if ($manhours->isNotEmpty()) {
            $karyawan_amc   = $manhours->whereIn('company_id', $amcCompanyIds)->sum('total_headcount');
            $karyawan_mitra = $manhours->whereNotIn('company_id', $amcCompanyIds)->sum('total_headcount');
            $manhour_amc    = $manhours->whereIn('company_id', $amcCompanyIds)->sum('total_manhours');
            $manhour_mitra  = $manhours->whereNotIn('company_id', $amcCompanyIds)->sum('total_manhours');
            $last_synced_at = now();
        } else {
            $karyawan_amc   = $existing ? $existing->karyawan_amc : 0;
            $karyawan_mitra = $existing ? $existing->karyawan_mitra : 0;
            $manhour_amc    = $existing ? $existing->manhour_amc : 0;
            $manhour_mitra  = $existing ? $existing->manhour_mitra : 0;
            $last_synced_at = $existing ? $existing->last_synced_at : null;
        }

        $data += [
            'karyawan_amc'   => $karyawan_amc,
            'karyawan_mitra' => $karyawan_mitra,
            'manhour_amc'    => $manhour_amc,
            'manhour_mitra'  => $manhour_mitra,
            'last_synced_at' => $last_synced_at,
        ];

        return SafetyPerformance::updateOrCreate(
            ['tahun' => $tahun, 'bulan' => $bulan],
            $data
        );
    }

    /**
     * Sinkronisasi seluruh bulan untuk 1 tahun
     */
    public function syncYear(int $tahun): void
    {
        foreach (range(1, 12) as $bulan) {
            $this->syncMonth($tahun, $bulan);
        }
    }

    /**
     * Hitung seluruh KPI untuk tampilan tabel/dashboard
     */
    public function getKpiForYear(int $tahun): Collection
    {
        // Pastikan snapshot ada
        $rows = SafetyPerformance::where('tahun', $tahun)
            ->orderBy('bulan')
            ->get();

        // Jika data kosong untuk tahun ini, buat dummy/snapshot kosong dulu
        if ($rows->isEmpty()) {
            $this->syncYear($tahun);
            $rows = SafetyPerformance::where('tahun', $tahun)
                ->orderBy('bulan')
                ->get();
        }

        // Jam kerja Januari (baseline untuk MTD AIFR & AllInjuryFR)
        $janRow = $rows->firstWhere('bulan', 1);
        $janManhour = $janRow ? ($janRow->manhour_amc + $janRow->manhour_mitra) : 0;
        if ($janManhour <= 0) {
            $janManhour = 1; // Cegah division by zero
        }

        $cumIncident = 0;
        $cumFaiMti = 0;
        $cumKecTambang = 0;
        $cumManhour = 0;
        $cumHariHilang = 0;

        return $rows->map(function ($row) use (&$cumIncident, &$cumFaiMti, &$cumKecTambang, &$cumManhour, &$cumHariHilang, $janManhour) {
            $manhour      = $row->manhour_amc + $row->manhour_mitra;
            $faiMti       = $row->count_fai + $row->count_mti;
            $kecTambang   = $row->count_cidera_ringan + $row->count_cidera_berat + $row->count_mati;

            $cumIncident    += $row->count_all_incident;
            $cumFaiMti      += $faiMti;
            $cumKecTambang  += $kecTambang;
            $cumManhour     += $manhour;
            $cumHariHilang  += $row->hari_hilang;

            return [
                'bulan'              => $row->bulan,
                'tahun'              => $row->tahun,
                'karyawan_amc'       => $row->karyawan_amc,
                'karyawan_mitra'     => $row->karyawan_mitra,
                'total_karyawan'     => $row->karyawan_amc + $row->karyawan_mitra,
                'manhour_amc'        => $row->manhour_amc,
                'manhour_mitra'      => $row->manhour_mitra,
                'jam_kerja_bulanan'  => $manhour,
                'jam_kerja_kumulatif'=> $cumManhour,
                'count_all_incident' => $row->count_all_incident,
                'count_property_damage' => $row->count_property_damage,
                'count_nearmiss'     => $row->count_nearmiss,
                'count_fai'          => $row->count_fai,
                'count_mti'          => $row->count_mti,
                'total_fai_mti'      => $faiMti,
                'cidera_ringan'      => $row->count_cidera_ringan,
                'cidera_berat'       => $row->count_cidera_berat,
                'mati'               => $row->count_mati,
                'total_kec_tambang'  => $kecTambang,
                'hari_hilang'        => $row->hari_hilang,
                'hari_hilang_ytd'    => $cumHariHilang,
                'hpri'               => $row->count_hpri,
                'non_hpri'           => $row->count_non_hpri,
                'lingkungan_minor'   => $row->lingkungan_minor,
                'lingkungan_mayor'   => $row->lingkungan_mayor,
                'lingkungan_kritikal'=> $row->lingkungan_kritikal,
                'actual_cost'        => (double) $row->actual_cost,
                'potential_cost'     => (double) $row->potential_cost,
                'last_synced_at'     => $row->last_synced_at ? $row->last_synced_at->format('Y-m-d H:i:s') : null,

                // ===== KPI Frequency Rates =====
                'mtd_aifr'           => $manhour > 0 ? round(($row->count_all_incident / $manhour) * 1_000_000, 2) : 0,
                'ytd_aifr'           => $cumManhour > 0 ? round(($cumIncident / $cumManhour) * 1_000_000, 2) : 0,
                'mtd_all_injury_fr'  => $manhour > 0 ? round(($faiMti / $manhour) * 1_000_000, 2) : 0,
                'ytd_all_injury_fr'  => $cumManhour > 0 ? round(($cumFaiMti / $cumManhour) * 1_000_000, 2) : 0,
                'mtd_lti_fr'         => $manhour > 0 ? round(($kecTambang / $manhour) * 1_000_000, 2) : 0,
                'ytd_lti_fr'         => $cumManhour > 0 ? round(($cumKecTambang / $cumManhour) * 1_000_000, 2) : 0,
                'mtd_lti_sr'         => $manhour > 0 ? round(($row->hari_hilang / $manhour) * 1_000_000, 2) : 0,
                'ytd_lti_sr'         => $cumManhour > 0 ? round(($cumHariHilang / $cumManhour) * 1_000_000, 2) : 0,
            ];
        });
    }
}
