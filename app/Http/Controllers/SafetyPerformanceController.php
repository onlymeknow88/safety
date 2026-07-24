<?php

namespace App\Http\Controllers;

use App\Services\SafetyPerformanceService;
use App\Models\SafetyPerformance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class SafetyPerformanceController extends Controller
{
    protected SafetyPerformanceService $service;

    public function __construct(SafetyPerformanceService $service)
    {
        $this->service = $service;
    }

    /**
     * Tampilan utama halaman Safety Performance
     */
    public function index(Request $request): Response
    {
        $tahun = (int) $request->input('tahun', date('Y'));

        return Inertia::render('SafetyPerformance/Index', [
            'filters' => [
                'tahun' => $tahun,
            ],
        ]);
    }

    /**
     * Export Excel berdasarkan template
     */
    public function export(Request $request)
    {
        $tahun = (int) $request->input('tahun', date('Y'));
        
        // Ambil data snapshot langsung dari DB untuk diisi ke template
        $rows = SafetyPerformance::where('tahun', $tahun)
            ->orderBy('bulan')
            ->get();

        // Path ke template Excel
        $templatePath = public_path('New folder/Template Database Insiden.xlsx');
        if (!file_exists($templatePath)) {
            return redirect()->back()->with('error', 'Template file tidak ditemukan.');
        }

        // Load spreadsheet dengan menyertakan chart agar template tidak corrupt
        $reader = IOFactory::createReaderForFile($templatePath);
        $reader->setIncludeCharts(true);
        $spreadsheet = $reader->load($templatePath);
        $sheet = $spreadsheet->getSheetByName('Safety Performance');

        if (!$sheet) {
            return redirect()->back()->with('error', 'Sheet Safety Performance tidak ditemukan di dalam template.');
        }

        // Mapping kolom ke data snapshot
        // Baris data di template dimulai dari baris 7 (Januari) sampai baris 18 (Desember)
        $startRow = 7;
        
        foreach (range(1, 12) as $bulan) {
            $currentRow = $startRow + ($bulan - 1);
            $data = $rows->firstWhere('bulan', $bulan);

            // Update C (Tanggal) agar sesuai tahun yang dipilih
            $dateValue = Date::PHPToExcel(new \DateTime("$tahun-$bulan-01"));
            $sheet->setCellValue("C$currentRow", $dateValue);

            if ($data) {
                // Tulis data snapshot ke sel yang sesuai (input manual di Excel)
                $sheet->setCellValue("D$currentRow", $data->karyawan_amc);
                $sheet->setCellValue("E$currentRow", $data->karyawan_mitra);
                $sheet->setCellValue("G$currentRow", $data->manhour_amc);
                $sheet->setCellValue("H$currentRow", $data->manhour_mitra);
                $sheet->setCellValue("K$currentRow", $data->count_all_incident);
                $sheet->setCellValue("N$currentRow", $data->count_property_damage);
                $sheet->setCellValue("O$currentRow", $data->count_nearmiss);

                // Tipe Insiden
                $sheet->setCellValue("P$currentRow", $data->count_fai);
                $sheet->setCellValue("Q$currentRow", $data->count_mti);
                
                // Kecelakaan Tambang
                $sheet->setCellValue("U$currentRow", $data->count_cidera_ringan);
                $sheet->setCellValue("V$currentRow", $data->count_cidera_berat);
                $sheet->setCellValue("W$currentRow", $data->count_mati);

                // Lainnya
                $sheet->setCellValue("Y$currentRow", $data->count_kaptk);
                $sheet->setCellValue("Z$currentRow", $data->count_pak);
                $sheet->setCellValue("AC$currentRow", $data->hari_hilang);

                // K3 & Lingkungan
                $sheet->setCellValue("AH$currentRow", $data->count_hpri);
                $sheet->setCellValue("AI$currentRow", $data->count_non_hpri);
                $sheet->setCellValue("AJ$currentRow", $data->lingkungan_minor);
                $sheet->setCellValue("AK$currentRow", $data->lingkungan_mayor);
                $sheet->setCellValue("AL$currentRow", $data->lingkungan_kritikal);

                // Biaya
                $sheet->setCellValue("AM$currentRow", (double) $data->actual_cost);
                $sheet->setCellValue("AN$currentRow", (double) $data->potential_cost);
            } else {
                // Jika tidak ada data, kosongkan/set nol inputnya
                $sheet->setCellValue("D$currentRow", 0);
                $sheet->setCellValue("E$currentRow", 0);
                $sheet->setCellValue("G$currentRow", 0);
                $sheet->setCellValue("H$currentRow", 0);
                $sheet->setCellValue("K$currentRow", 0);
                $sheet->setCellValue("N$currentRow", 0);
                $sheet->setCellValue("O$currentRow", 0);
                $sheet->setCellValue("P$currentRow", 0);
                $sheet->setCellValue("Q$currentRow", 0);
                $sheet->setCellValue("U$currentRow", 0);
                $sheet->setCellValue("V$currentRow", 0);
                $sheet->setCellValue("W$currentRow", 0);
                $sheet->setCellValue("Y$currentRow", 0);
                $sheet->setCellValue("Z$currentRow", 0);
                $sheet->setCellValue("AC$currentRow", 0);
                $sheet->setCellValue("AH$currentRow", 0);
                $sheet->setCellValue("AI$currentRow", 0);
                $sheet->setCellValue("AJ$currentRow", 0);
                $sheet->setCellValue("AK$currentRow", 0);
                $sheet->setCellValue("AL$currentRow", 0);
                $sheet->setCellValue("AM$currentRow", 0);
                $sheet->setCellValue("AN$currentRow", 0);
            }
        }

        // Hapus semua sheet selain 'Safety Performance'
        foreach ($spreadsheet->getSheetNames() as $sheetName) {
            if ($sheetName !== 'Safety Performance') {
                $spreadsheet->removeSheetByIndex(
                    $spreadsheet->getIndex($spreadsheet->getSheetByName($sheetName))
                );
            }
        }

        // Tulis output ke file temporary
        $fileName = "Safety_Performance_Report_{$tahun}.xlsx";
        $tempFile = tempnam(sys_get_temp_dir(), 'excel');

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->setIncludeCharts(true); // Sertakan chart pada file output agar tidak corrupt
        $writer->setPreCalculateFormulas(false); // Serahkan perhitungan formula ke Excel saat dibuka untuk mencegah file corrupt
        $writer->save($tempFile);

        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }
}
