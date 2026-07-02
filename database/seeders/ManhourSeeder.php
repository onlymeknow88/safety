<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ManhourSeeder extends Seeder
{
    public function run(): void
    {
        // Clean existing manhours
        DB::table('m_manhours')->truncate();

        $companyIds = DB::table('m_company')->pluck('id')->toArray();
        $ccowIds = DB::table('m_ccows')->pluck('id')->toArray();

        if (empty($companyIds) || empty($ccowIds)) {
            return;
        }

        $data = [];
        $years = [2026];

        foreach ($years as $year) {
            foreach (range(1, 12) as $month) {
                foreach ($companyIds as $companyId) {
                    foreach ($ccowIds as $ccowId) {
                        // Base headcount for this company & CCOW (range: 80 - 120)
                        $baseHeadcount = 80 + (($companyId * 11 + $ccowId * 17) % 40);
                        
                        // Menambahkan variansi berdasarkan tahun agar data tiap tahun berbeda secara signifikan
                        $yearDiff = $year - 2024;
                        $baseHeadcount = $baseHeadcount + ($yearDiff * 12) - (($companyId + $ccowId) % 5);
                        
                        // Flufluate headcount monthly using a wave-like function (range: +/- 8)
                        // Resulting headcount range: 72 - 128 (perfectly within 50-150 range)
                        $fluc = (int) (sin($month * 1.5 + $companyId + $year) * 8);
                        $headcount = $baseHeadcount + $fluc;
                        
                        // Estimate working days per month (varying between 20 and 22 days, February and December are shorter)
                        $baseDays = in_array($month, [2, 12]) ? 20 : 22;
                        $workingDays = $baseDays + (int)(cos($month + $companyId) * 1.2);
                        
                        // Working hours multiplier (hours/day = 8)
                        $multiplier = $workingDays * 8;
                        
                        // Calculate total manhours (Range: 72 * 160 = 11,520 to 128 * 176 = 22,528)
                        $manhours = $headcount * $multiplier;

                        $data[] = [
                            'ccow_id' => $ccowId,
                            'company_id' => $companyId,
                            'bulan' => $month,
                            'tahun' => $year,
                            'total_headcount' => $headcount,
                            'total_manhours' => $manhours,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }
        }

        // Bulk insert in chunks of 200 to be efficient
        foreach (array_chunk($data, 200) as $chunk) {
            DB::table('m_manhours')->insert($chunk);
        }
    }
}
