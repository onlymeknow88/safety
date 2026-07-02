<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SafetyPerformanceService;
use App\Models\SafetyPerformance;
use Illuminate\Http\Request;

class SafetyPerformanceController extends Controller
{
    protected SafetyPerformanceService $service;

    public function __construct(SafetyPerformanceService $service)
    {
        $this->service = $service;
    }

    /**
     * Get KPI data for a specific year (JSON)
     */
    public function index(Request $request)
    {
        $tahun = (int) $request->input('tahun', date('Y'));
        $kpiData = $this->service->getKpiForYear($tahun);

        $lastSyncedRow = SafetyPerformance::where('tahun', $tahun)
            ->orderBy('last_synced_at', 'desc')
            ->first();

        return response()->json([
            'meta' => [
                'status' => 'success',
                'message' => 'Data kinerja keselamatan berhasil diambil.',
            ],
            'result' => [
                'kpiData' => $kpiData,
                'lastSynced' => $lastSyncedRow ? ($lastSyncedRow->last_synced_at ? $lastSyncedRow->last_synced_at->format('d M Y H:i:s') : null) : null,
            ]
        ]);
    }

    /**
     * Trigger manual sync for a specific year and return updated data (JSON)
     */
    public function sync(Request $request)
    {
        $tahun = (int) $request->input('tahun', date('Y'));
        $this->service->syncYear($tahun);

        $kpiData = $this->service->getKpiForYear($tahun);
        $lastSyncedRow = SafetyPerformance::where('tahun', $tahun)
            ->orderBy('last_synced_at', 'desc')
            ->first();

        return response()->json([
            'meta' => [
                'status' => 'success',
                'message' => 'Data Kinerja Keselamatan berhasil disinkronkan.',
            ],
            'result' => [
                'kpiData' => $kpiData,
                'lastSynced' => $lastSyncedRow ? ($lastSyncedRow->last_synced_at ? $lastSyncedRow->last_synced_at->format('d M Y H:i:s') : null) : null,
            ]
        ]);
    }

    /**
     * Update manual workforce and manhours for a specific year and month
     */
    public function update(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'bulan' => 'required|integer|between:1,12',
            'karyawan_amc' => 'required|integer|min:0',
            'karyawan_mitra' => 'required|integer|min:0',
            'manhour_amc' => 'required|numeric|min:0',
            'manhour_mitra' => 'required|numeric|min:0',
        ]);

        $tahun = (int) $request->tahun;
        $bulan = (int) $request->bulan;

        $record = SafetyPerformance::updateOrCreate(
            ['tahun' => $tahun, 'bulan' => $bulan],
            [
                'karyawan_amc' => $request->karyawan_amc,
                'karyawan_mitra' => $request->karyawan_mitra,
                'manhour_amc' => $request->manhour_amc,
                'manhour_mitra' => $request->manhour_mitra,
                'last_synced_at' => now(),
            ]
        );

        $kpiData = $this->service->getKpiForYear($tahun);
        $lastSyncedRow = SafetyPerformance::where('tahun', $tahun)
            ->orderBy('last_synced_at', 'desc')
            ->first();

        return response()->json([
            'meta' => [
                'status' => 'success',
                'message' => 'Data Kinerja Keselamatan berhasil diperbarui.',
            ],
            'result' => [
                'kpiData' => $kpiData,
                'lastSynced' => $lastSyncedRow ? ($lastSyncedRow->last_synced_at ? $lastSyncedRow->last_synced_at->format('d M Y H:i:s') : null) : null,
            ]
        ]);
    }
}
