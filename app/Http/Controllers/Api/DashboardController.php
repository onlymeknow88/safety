<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccidentNotification;
use App\Models\AppSetting;
use App\Models\InvestigationReport;
use App\Models\MasterData\Ccow;
use App\Models\MasterData\Company;
use App\Models\MasterData\Department;
use App\Models\MasterData\JobFactor;
use App\Models\MasterData\Manhour;
use App\Models\MasterData\PersonalFactor;
use App\Models\MasterData\Source;
use App\Models\MasterData\Status;
use App\Models\MasterData\UnsafeAct;
use App\Models\MasterData\UnsafeCondition;
use App\Models\PicaItem;
use App\Models\SafetyPerformance;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $isPowerUser = $user->hasRole('crs', 'CRS', 'hse-admin', 'HSE Admin', 'hse_admin', 'admin', 'super-admin', 'superadmin', 'Super Admin');

        // Filter parameters
        $ccowId = $request->input('ccow_id');
        $companyId = $request->input('company_id');

        // Scoping for non-power users
        if (! $isPowerUser) {
            $companyId = $user->employee?->company_id;
            $ccowId = $user->employee?->ccow_id;
        }

        // Period filter (default: this year)
        $startDate = $request->input('start_date', date('Y-01-01'));
        $endDate = $request->input('end_date', date('Y-12-31'));

        $startCarbon = Carbon::parse($startDate);
        $endCarbon = Carbon::parse($endDate);

        // 1. Fetch real stats (from safety performance snapshots via service)
        $targetYear = (int) $endCarbon->year;
        $targetMonth = (int) $endCarbon->month;

        $safetyService = app(\App\Services\SafetyPerformanceService::class);
        $kpiData = $safetyService->getKpiForYear($targetYear);

        // Filter up to the target month that has been synced
        $activeKpiData = $kpiData->filter(function ($item) use ($targetMonth) {
            return $item['bulan'] <= $targetMonth && $item['last_synced_at'] !== null;
        });

        // Fallback: if no active kpi data is found for the target year, check overall if any synced data is available in the current year's kpiData
        if ($activeKpiData->isEmpty()) {
            $activeKpiData = $kpiData->filter(fn($item) => $item['last_synced_at'] !== null);
        }

        $latestKpi = $activeKpiData->last() ?? $kpiData->first();

        $totalManHours = 0;
        $totalWorkforce = 0;
        $aktualFr = 0;
        $aktualSr = 0;

        if ($latestKpi) {
            $totalManHours = $latestKpi['jam_kerja_kumulatif'];
            $totalWorkforce = $latestKpi['total_karyawan'];
            $aktualFr = $latestKpi['ytd_lti_fr'];
            $aktualSr = $latestKpi['ytd_lti_sr'];
        }

        // Approved Statuses for active incidents
        $approvedStatusIds = Status::whereNotIn('name', ['Draft', 'Submitted', 'Returned'])->pluck('id');

        // Total Notifications
        $notifQuery = AccidentNotification::query()
            ->whereBetween('incident_date', [$startDate, $endDate])
            ->whereIn('status_id', $approvedStatusIds);
        if ($companyId) {
            $notifQuery->where('company_id', $companyId);
        }
        if ($ccowId) {
            $notifQuery->where('ccow_id', $ccowId);
        }
        $totalNotifications = $notifQuery->count();

        // Total Investigations (LPKS & LPKL)
        $lpksQuery = InvestigationReport::where('report_type', 'LPKS')
            ->whereHas('accidentNotification', function ($q) use ($startDate, $endDate, $companyId, $ccowId, $approvedStatusIds) {
                $q->whereBetween('incident_date', [$startDate, $endDate])
                    ->whereIn('status_id', $approvedStatusIds);
                if ($companyId) {
                    $q->where('company_id', $companyId);
                }
                if ($ccowId) {
                    $q->where('ccow_id', $ccowId);
                }
            });
        $totalLpks = $lpksQuery->count();

        $lpklQuery = InvestigationReport::where('report_type', 'LPKL')
            ->whereHas('accidentNotification', function ($q) use ($startDate, $endDate, $companyId, $ccowId, $approvedStatusIds) {
                $q->whereBetween('incident_date', [$startDate, $endDate])
                    ->whereIn('status_id', $approvedStatusIds);
                if ($companyId) {
                    $q->where('company_id', $companyId);
                }
                if ($ccowId) {
                    $q->where('ccow_id', $ccowId);
                }
            });
        $totalLpkl = $lpklQuery->count();

        // Open PICA items
        $picaQuery = PicaItem::where('status', 'Open')
            ->whereHas('investigationReport.accidentNotification', function ($q) use ($startDate, $endDate, $companyId, $ccowId) {
                $q->whereBetween('incident_date', [$startDate, $endDate]);
                if ($companyId) {
                    $q->where('company_id', $companyId);
                }
                if ($ccowId) {
                    $q->where('ccow_id', $ccowId);
                }
            });
        $openPica = $picaQuery->count();

        // --- TREND CALCULATION (vs last month) ---
        $currentMonth = $endCarbon->month;
        $currentYear = $endCarbon->year;

        $lastMonthCarbon = $endCarbon->copy()->subMonth();
        $lastMonth = $lastMonthCarbon->month;
        $lastYear = $lastMonthCarbon->year;

        // Workforce, Man-Hours, FR, & SR Trend calculated from safety performance snapshot via service
        $workforceTrend = 0;
        $manhoursTrend = 0;
        $frTrend = 0;
        $srTrend = 0;

        if ($latestKpi) {
            $prevBulan = $latestKpi['bulan'] - 1;
            if ($prevBulan > 0) {
                $prevKpi = $kpiData->firstWhere('bulan', $prevBulan);
            } else {
                $prevYearKpi = $safetyService->getKpiForYear($targetYear - 1);
                $prevKpi = $prevYearKpi->firstWhere('bulan', 12);
            }

            if ($prevKpi) {
                if (($prevKpi['total_karyawan'] ?? 0) > 0) {
                    $workforceTrend = ((($latestKpi['total_karyawan'] ?? 0) - ($prevKpi['total_karyawan'] ?? 0)) / ($prevKpi['total_karyawan'] ?? 0)) * 100;
                }
                if (($prevKpi['jam_kerja_bulanan'] ?? 0) > 0) {
                    $manhoursTrend = ((($latestKpi['jam_kerja_bulanan'] ?? 0) - ($prevKpi['jam_kerja_bulanan'] ?? 0)) / ($prevKpi['jam_kerja_bulanan'] ?? 0)) * 100;
                }
                if (($prevKpi['ytd_lti_fr'] ?? 0) > 0) {
                    $frTrend = ((($latestKpi['ytd_lti_fr'] ?? 0) - ($prevKpi['ytd_lti_fr'] ?? 0)) / ($prevKpi['ytd_lti_fr'] ?? 0)) * 100;
                }
                if (($prevKpi['ytd_lti_sr'] ?? 0) > 0) {
                    $srTrend = ((($latestKpi['ytd_lti_sr'] ?? 0) - ($prevKpi['ytd_lti_sr'] ?? 0)) / ($prevKpi['ytd_lti_sr'] ?? 0)) * 100;
                }
            }
        }

        // Notifications Trend
        $currentNotifs = AccidentNotification::whereYear('incident_date', $currentYear)
            ->whereMonth('incident_date', $currentMonth)
            ->whereIn('status_id', $approvedStatusIds);
        if ($companyId) {
            $currentNotifs->where('company_id', $companyId);
        }
        if ($ccowId) {
            $currentNotifs->where('ccow_id', $ccowId);
        }
        $currentNotifsVal = $currentNotifs->count();

        $prevNotifs = AccidentNotification::whereYear('incident_date', $lastYear)
            ->whereMonth('incident_date', $lastMonth)
            ->whereIn('status_id', $approvedStatusIds);
        if ($companyId) {
            $prevNotifs->where('company_id', $companyId);
        }
        if ($ccowId) {
            $prevNotifs->where('ccow_id', $ccowId);
        }
        $prevNotifsVal = $prevNotifs->count();

        $notificationsTrend = $prevNotifsVal > 0 ? (($currentNotifsVal - $prevNotifsVal) / $prevNotifsVal) * 100 : 0;

        // FR & SR Targets from settings
        $targetFr = (float) AppSetting::getValue('target_fr', 0.5);
        $targetSr = (float) AppSetting::getValue('target_sr', 50.0);

        $stats = [
            'total_notifications' => $totalNotifications,
            'total_lpks' => $totalLpks,
            'total_lpkl' => $totalLpkl,
            'open_pica' => $openPica,
            'total_workforce' => $totalWorkforce,
            'total_man_hours' => $totalManHours,

            // Trend values
            'workforce_trend' => round($workforceTrend, 1),
            'manhours_trend' => round($manhoursTrend, 1),
            'notifications_trend' => round($notificationsTrend, 1),
            'fr_trend' => round($frTrend, 1),
            'sr_trend' => round($srTrend, 1),

            // FR & SR Targets vs Aktual
            'target_fr' => $targetFr,
            'aktual_fr' => round($aktualFr, 2),
            'target_sr' => $targetSr,
            'aktual_sr' => round($aktualSr, 2),
        ];

        // 2. Fetch master data for lookup
        $unsafeConditionsMap = UnsafeCondition::where('is_active', true)->get()->keyBy('id');
        $unsafeActsMap = UnsafeAct::where('is_active', true)->get()->keyBy('id');
        $personalFactorsMap = PersonalFactor::where('is_active', true)->get()->keyBy('id');
        $jobFactorsMap = JobFactor::where('is_active', true)->get()->keyBy('id');

        // 3. Get real filtered accident notifications
        $notifications = AccidentNotification::with([
            'ccow',
            'company',
            'location',
            'incidentType',
            'department',
            'investigationReport.incidentType',
            'investigationReport.source',
            'investigationReport.injuryCondition',
            'investigationReport.bodyPart',
            'investigationReport.mobileEquipment',
        ])
            ->whereBetween('incident_date', [$startDate, $endDate])
            ->whereIn('status_id', $approvedStatusIds)
            ->when($companyId, function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            })
            ->when($ccowId, function ($q) use ($ccowId) {
                $q->where('ccow_id', $ccowId);
            })
            ->get();

        // 4. Map to chart dataset
        $dataset = [];
        foreach ($notifications as $notif) {
            $ir = $notif->investigationReport;

            // Map Unsafe Conditions
            $ucList = [];
            if ($ir && is_array($ir->unsafe_conditions)) {
                foreach ($ir->unsafe_conditions as $id) {
                    $item = $unsafeConditionsMap->get($id);
                    if ($item) {
                        $ucList[] = $item->code.' - '.($item->description ?? $item->name ?? '');
                    }
                }
            }
            if (empty($ucList)) {
                $ucList = ['N/A'];
            }

            // Map Unsafe Acts
            $uaList = [];
            if ($ir && is_array($ir->unsafe_actions)) {
                foreach ($ir->unsafe_actions as $id) {
                    $item = $unsafeActsMap->get($id);
                    if ($item) {
                        $uaList[] = $item->code.' - '.($item->description ?? $item->name ?? '');
                    }
                }
            }
            if (empty($uaList)) {
                $uaList = ['N/A'];
            }

            // Map Personal Factors
            $pfList = [];
            if ($ir && is_array($ir->personal_factors)) {
                foreach ($ir->personal_factors as $id) {
                    $item = $personalFactorsMap->get($id);
                    if ($item) {
                        $pfList[] = $item->code.' - '.($item->description ?? $item->name ?? '');
                    }
                }
            }
            if (empty($pfList)) {
                $pfList = ['N/A'];
            }

            // Map Job Factors
            $jfList = [];
            if ($ir && is_array($ir->job_factors)) {
                foreach ($ir->job_factors as $id) {
                    $item = $jobFactorsMap->get($id);
                    if ($item) {
                        $jfList[] = $item->code.' - '.($item->description ?? $item->name ?? '');
                    }
                }
            }
            if (empty($jfList)) {
                $jfList = ['N/A'];
            }

            // Source
            $sourceStr = 'N/A';
            if ($ir && $ir->source) {
                $sourceStr = $ir->source->code.' - '.($ir->source->description ?? $ir->source->name ?? '');
            }

            // Injury Condition
            $injuryCondStr = ($ir && $ir->injuryCondition) ? $ir->injuryCondition->name : ($notif->consequence_human ?? 'N/A');

            // Body Part
            $bodyPartStr = ($ir && $ir->bodyPart) ? $ir->bodyPart->name : 'N/A';

            // Mobile Equipment
            $mobileEqStr = ($ir && $ir->mobileEquipment ? $ir->mobileEquipment->name : null) ?: ($notif->unit ?? 'N/A');

            // Spill Quantity
            $spillQty = ($ir && $ir->environmental_pollution_qty) ? (int) $ir->environmental_pollution_qty : 0;

            // Incident Type
            $incType = ($ir && $ir->incidentType) ? $ir->incidentType->category : ($notif->incidentType ? $notif->incidentType->category : 'Other');

            $dataset[] = [
                'id' => $notif->id,
                'is_real' => true,
                'incident_date' => $notif->incident_date ? $notif->incident_date->format('Y-m-d') : now()->format('Y-m-d'),
                'incident_type' => $incType,
                'lost_days' => $ir ? ($ir->lost_days ?? 0) : 0,
                'actual_cost' => $ir ? ($ir->actual_cost ?? 0) : 0,
                'potential_cost' => $ir ? ($ir->potential_cost ?? 0) : 0,
                'unsafe_conditions' => $ucList,
                'unsafe_acts' => $uaList,
                'personal_factors' => $pfList,
                'job_factors' => $jfList,
                'source' => $sourceStr,
                'injury_condition' => $injuryCondStr,
                'body_part' => $bodyPartStr,
                'mobile_equipment' => $mobileEqStr,
                'spill_quantity' => $spillQty,
                'company_name' => $notif->company?->name ?? 'N/A',
                'department_name' => $notif->department?->name ?? 'N/A',
            ];
        }

        // 5. Aggregate metrics
        $chartData = $this->aggregateDataset($dataset, $totalWorkforce, $startDate, $endDate, $companyId, $ccowId);

        // 6. Top Locations
        $topLocationsQuery = AccidentNotification::with('location')
            ->whereBetween('incident_date', [$startDate, $endDate]);
        if ($companyId) {
            $topLocationsQuery->where('company_id', $companyId);
        }
        if ($ccowId) {
            $topLocationsQuery->where('ccow_id', $ccowId);
        }
        $topLocations = $topLocationsQuery->select('location_id', DB::raw('count(*) as count'))
            ->groupBy('location_id')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'label' => $item->location ? $item->location->name : 'N/A',
                    'value' => (int) $item->count,
                ];
            });

        // HPRI vs Non-HPRI
        $hpriCountsQuery = AccidentNotification::whereBetween('incident_date', [$startDate, $endDate]);
        if ($companyId) {
            $hpriCountsQuery->where('company_id', $companyId);
        }
        if ($ccowId) {
            $hpriCountsQuery->where('ccow_id', $ccowId);
        }
        $hpriCounts = $hpriCountsQuery->selectRaw('SUM(CASE WHEN is_hpri = 1 THEN 1 ELSE 0 END) as hpri, SUM(CASE WHEN is_hpri = 0 THEN 1 ELSE 0 END) as non_hpri, COUNT(*) as total')
            ->first();
        $hpriData = [
            'hpri' => (int) ($hpriCounts->hpri ?? 0),
            'non_hpri' => (int) ($hpriCounts->non_hpri ?? 0),
            'total' => (int) ($hpriCounts->total ?? 0),
        ];

        // Top Times
        $allTimesQuery = AccidentNotification::whereBetween('incident_date', [$startDate, $endDate]);
        if ($companyId) {
            $allTimesQuery->where('company_id', $companyId);
        }
        if ($ccowId) {
            $allTimesQuery->where('ccow_id', $ccowId);
        }
        $allTimes = $allTimesQuery->pluck('incident_time');

        $timeSlots = [
            '06.01 - 09.00' => 0,
            '09.01 - 12.00' => 0,
            '12.01 - 15.00' => 0,
            '15.01 - 18.00' => 0,
            '18.01 - 21.00' => 0,
            '21.01 - 00.00' => 0,
            '00.01 - 03.00' => 0,
            '03.01 - 06.00' => 0,
        ];

        foreach ($allTimes as $time) {
            if (! $time) {
                continue;
            }
            $timeParts = explode(':', $time);
            $hour = (int) $timeParts[0];
            $minute = isset($timeParts[1]) ? (int) $timeParts[1] : 0;
            $decimalTime = $hour + ($minute / 60);

            if ($decimalTime > 6 && $decimalTime <= 9) {
                $timeSlots['06.01 - 09.00']++;
            } elseif ($decimalTime > 9 && $decimalTime <= 12) {
                $timeSlots['09.01 - 12.00']++;
            } elseif ($decimalTime > 12 && $decimalTime <= 15) {
                $timeSlots['12.01 - 15.00']++;
            } elseif ($decimalTime > 15 && $decimalTime <= 18) {
                $timeSlots['15.01 - 18.00']++;
            } elseif ($decimalTime > 18 && $decimalTime <= 21) {
                $timeSlots['18.01 - 21.00']++;
            } elseif ($decimalTime > 21 && $decimalTime <= 24) {
                $timeSlots['21.01 - 00.00']++;
            } elseif ($decimalTime >= 0 && $decimalTime <= 3) {
                $timeSlots['00.01 - 03.00']++;
            } elseif ($decimalTime > 3 && $decimalTime <= 6) {
                $timeSlots['03.01 - 06.00']++;
            }
        }

        arsort($timeSlots);
        $topTimes = [];
        foreach (array_slice($timeSlots, 0, 5, true) as $label => $val) {
            $topTimes[] = [
                'label' => $label,
                'value' => (int) $val,
            ];
        }

        // Open & Overdue Incidents
        $openOverdueIncidentsQuery = AccidentNotification::with(['incidentType', 'status', 'investigationReport.picaItems'])
            ->whereIn('status_id', function ($query) {
                $query->select('id')
                    ->from('m_statuses')
                    ->whereIn('name', ['Open', 'Overdue']);
            })
            ->whereBetween('incident_date', [$startDate, $endDate]);

        if ($companyId) {
            $openOverdueIncidentsQuery->where('company_id', $companyId);
        }
        if ($ccowId) {
            $openOverdueIncidentsQuery->where('ccow_id', $ccowId);
        }

        $openOverdueIncidents = $openOverdueIncidentsQuery->orderBy('incident_date', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($notif) {
                $picaDueDate = null;
                if ($notif->investigationReport && $notif->investigationReport->picaItems->isNotEmpty()) {
                    $picaDueDate = $notif->investigationReport->picaItems->pluck('due_date')->filter()->min();
                }

                $dueDate = $picaDueDate ? Carbon::parse($picaDueDate) : $notif->incident_date->addDays(30);
                $isOverdue = now()->greaterThan($dueDate) || ($notif->status && strtolower($notif->status->name) === 'overdue');

                $tipe = $notif->is_hpri ? 'CRITICAL' : 'STANDARD';

                return [
                    'id' => $notif->id,
                    'notification_number' => $notif->notification_number ?? $notif->accident_number ?? '#INC-'.$notif->id,
                    'incident_date' => $notif->incident_date ? $notif->incident_date->format('d M Y') : 'N/A',
                    'tipe' => $tipe,
                    'kategori' => $notif->incidentType ? $notif->incidentType->category : 'Other',
                    'due_date' => $dueDate ? $dueDate->format('d M Y') : 'N/A',
                    'is_overdue' => $isOverdue,
                    'status' => $notif->status ? strtoupper($notif->status->name) : 'OPEN',
                ];
            });

        return response()->json([
            'meta' => [
                'status' => 'success',
                'message' => 'Dashboard metrics retrieved successfully.',
            ],
            'result' => [
                'stats' => $stats,
                'chartData' => $chartData,
                'topLocations' => $topLocations,
                'hpriData' => $hpriData,
                'topTimes' => $topTimes,
                'openOverdueIncidents' => $openOverdueIncidents,
            ]
        ]);
    }

    private function aggregateDataset($dataset, $totalWorkforce, $startDate, $endDate, $companyId, $ccowId)
    {
        $unsafeConditions = [];
        $unsafeActs = [];
        $personalFactors = [];
        $jobFactors = [];
        $mobileEquipments = [];
        $spills = [
            'No Spill (0 L)' => 0,
            'Minor (1 - 10 L)' => 0,
            'Medium (11 - 50 L)' => 0,
            'Major (51 - 100 L)' => 0,
            'Critical (> 100 L)' => 0,
        ];
        $incidentTypes = [];
        $sources = [];
        $injuryConditions = [];
        $bodyParts = [];

        $monthlyCosts = [];

        foreach ($dataset as $row) {
            // Unsafe Condition
            foreach ($row['unsafe_conditions'] as $uc) {
                if ($uc && $uc !== 'N/A') {
                    $unsafeConditions[$uc] = ($unsafeConditions[$uc] ?? 0) + 1;
                }
            }

            // Unsafe Act
            foreach ($row['unsafe_acts'] as $ua) {
                if ($ua && $ua !== 'N/A') {
                    $unsafeActs[$ua] = ($unsafeActs[$ua] ?? 0) + 1;
                }
            }

            // Personal Factor
            foreach ($row['personal_factors'] as $pf) {
                if ($pf && $pf !== 'N/A') {
                    $personalFactors[$pf] = ($personalFactors[$pf] ?? 0) + 1;
                }
            }

            // Job Factor
            foreach ($row['job_factors'] as $jf) {
                if ($jf && $jf !== 'N/A') {
                    $jobFactors[$jf] = ($jobFactors[$jf] ?? 0) + 1;
                }
            }

            // Mobile Equipment
            if ($row['mobile_equipment'] && $row['mobile_equipment'] !== 'N/A') {
                $mobileEquipments[$row['mobile_equipment']] = ($mobileEquipments[$row['mobile_equipment']] ?? 0) + 1;
            }

            // Spill
            $qty = $row['spill_quantity'];
            if ($qty == 0) {
                $spills['No Spill (0 L)']++;
            } elseif ($qty <= 10) {
                $spills['Minor (1 - 10 L)']++;
            } elseif ($qty <= 50) {
                $spills['Medium (11 - 50 L)']++;
            } elseif ($qty <= 100) {
                $spills['Major (51 - 100 L)']++;
            } else {
                $spills['Critical (> 100 L)']++;
            }

            // Incident Type
            if ($row['incident_type'] && $row['incident_type'] !== 'N/A') {
                $incidentTypes[$row['incident_type']] = ($incidentTypes[$row['incident_type']] ?? 0) + 1;
            }

            // Source
            if ($row['source'] && $row['source'] !== 'N/A') {
                $sources[$row['source']] = ($sources[$row['source']] ?? 0) + 1;
            }

            // Injury Condition
            if ($row['injury_condition'] && $row['injury_condition'] !== 'N/A' && $row['injury_condition'] !== 'Unknown') {
                $injuryConditions[$row['injury_condition']] = ($injuryConditions[$row['injury_condition']] ?? 0) + 1;
            }

            // Body Part
            if ($row['body_part'] && $row['body_part'] !== 'N/A' && $row['body_part'] !== 'Unknown') {
                $bodyParts[$row['body_part']] = ($bodyParts[$row['body_part']] ?? 0) + 1;
            }

            // Monthly Costs & Incident Trends
            $month = date('M Y', strtotime($row['incident_date']));
            if (! isset($monthlyCosts[$month])) {
                $monthlyCosts[$month] = [
                    'direct' => 0,
                    'indirect' => 0,
                    'count' => 0,
                    'timestamp' => strtotime($row['incident_date']),
                ];
            }
            $monthlyCosts[$month]['direct'] += $row['actual_cost'];
            $monthlyCosts[$month]['indirect'] += $row['potential_cost'];
            $monthlyCosts[$month]['count'] += 1;
        }

        // Sort monthly costs by date
        uasort($monthlyCosts, function ($a, $b) {
            return $a['timestamp'] <=> $b['timestamp'];
        });

        // Convert key-value to label-value arrays
        $formatChart = function ($array, $sortByValue = true) {
            $result = [];
            foreach ($array as $label => $value) {
                $result[] = ['label' => $label, 'value' => $value];
            }
            if ($sortByValue) {
                usort($result, function ($a, $b) {
                    return $b['value'] <=> $a['value'];
                });
            }

            return $result;
        };

        // Convert monthly costs and incident trends
        $monthlyCostsFormatted = [];
        $incidentTrends = [];
        foreach ($monthlyCosts as $month => $data) {
            $monthlyCostsFormatted[] = [
                'month' => $month,
                'direct' => $data['direct'],
                'indirect' => $data['indirect'],
            ];
            $incidentTrends[] = [
                'month' => $month,
                'count' => $data['count'],
            ];
        }

        $monthsIndo = [
            '01' => 'JAN', '02' => 'FEB', '03' => 'MAR', '04' => 'APR',
            '05' => 'MEI', '06' => 'JUN', '07' => 'JUL', '08' => 'AGU',
            '09' => 'SEP', '10' => 'OKT', '11' => 'NOV', '12' => 'DES',
        ];

        $frSrData = [];
        $monthsToShow = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
        foreach ($monthsToShow as $label) {
            $frSrData[$label] = [
                'month' => $label,
                'count' => 0,
                'lost_days' => 0,
                'fr' => 0,
                'sr' => 0,
            ];
        }

        foreach ($dataset as $row) {
            $mNum = date('m', strtotime($row['incident_date']));
            $mLabel = $monthsIndo[$mNum] ?? null;
            if ($mLabel && isset($frSrData[$mLabel])) {
                $frSrData[$mLabel]['count'] += 1;
                $frSrData[$mLabel]['lost_days'] += $row['lost_days'] ?? 0;
            }
        }

        // Fetch actual manhours per month from m_manhours dynamically
        $manhoursByMonth = [];
        $manhoursQuery = Manhour::query();
        if ($companyId) {
            $manhoursQuery->where('company_id', $companyId);
        }
        if ($ccowId) {
            $manhoursQuery->where('ccow_id', $ccowId);
        }
        $manhoursQuery->where(function ($q) use ($startDate, $endDate) {
            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);
            $q->whereRaw('(tahun * 100 + bulan) >= ?', [$start->year * 100 + $start->month])
                ->whereRaw('(tahun * 100 + bulan) <= ?', [$end->year * 100 + $end->month]);
        });

        $manhoursList = $manhoursQuery->select('bulan', 'tahun', DB::raw('SUM(total_manhours) as total_mh'))
            ->groupBy('bulan', 'tahun')
            ->get();

        foreach ($manhoursList as $mh) {
            $mLabel = $monthsIndo[sprintf('%02d', $mh->bulan)] ?? null;
            if ($mLabel) {
                $manhoursByMonth[$mLabel] = (float) $mh->total_mh;
            }
        }

        $targetYear = date('Y', strtotime($endDate));

        $monthsIndoMap = [
            'JAN' => 1, 'FEB' => 2, 'MAR' => 3, 'APR' => 4,
            'MEI' => 5, 'JUN' => 6, 'JUL' => 7, 'AGU' => 8,
            'SEP' => 9, 'OKT' => 10, 'NOV' => 11, 'DES' => 12,
        ];

        $service = app(\App\Services\SafetyPerformanceService::class);
        $kpiData = $service->getKpiForYear((int) $targetYear);

        foreach ($frSrData as $label => &$data) {
            $mNum = $monthsIndoMap[$label] ?? null;
            if ($mNum) {
                $monthKpi = $kpiData->firstWhere('bulan', $mNum);
                if ($monthKpi && $monthKpi['last_synced_at'] !== null) {
                    $data['fr'] = (float) $monthKpi['ytd_lti_fr'];
                    $data['sr'] = (float) $monthKpi['ytd_lti_sr'];
                }
            }
        }
        unset($data);

        // Aggregate by company from dataset
        $companyCounts = [];
        foreach ($dataset as $row) {
            $cName = $row['company_name'];
            $companyCounts[$cName] = ($companyCounts[$cName] ?? 0) + 1;
        }
        arsort($companyCounts);

        $totalIncidents = array_sum($companyCounts);
        $topCompanies = [];
        foreach ($companyCounts as $cName => $count) {
            $topCompanies[] = [
                'name' => $cName,
                'count' => $count,
                'percentage' => $totalIncidents > 0 ? round(($count / $totalIncidents) * 100, 1) : 0,
            ];
        }

        // Aggregate by department from dataset
        $deptCounts = [];
        foreach ($dataset as $row) {
            $dName = $row['department_name'];
            $deptCounts[$dName] = ($deptCounts[$dName] ?? 0) + 1;
        }
        arsort($deptCounts);

        $totalDeptIncidents = array_sum($deptCounts);
        $topDepartments = [];
        foreach ($deptCounts as $dName => $count) {
            $topDepartments[] = [
                'name' => $dName,
                'count' => $count,
                'percentage' => $totalDeptIncidents > 0 ? round(($count / $totalDeptIncidents) * 100, 1) : 0,
            ];
        }

        return [
            'unsafe_conditions' => $formatChart($unsafeConditions),
            'unsafe_acts' => $formatChart($unsafeActs),
            'personal_factors' => $formatChart($personalFactors),
            'job_factors' => $formatChart($jobFactors),
            'mobile_equipments' => $formatChart($mobileEquipments),
            'spills' => $formatChart($spills, false),
            'incident_types' => $formatChart($incidentTypes),
            'sources' => $formatChart($sources),
            'injury_conditions' => $formatChart($injuryConditions),
            'body_parts' => $formatChart($bodyParts),
            'monthly_costs' => $monthlyCostsFormatted,
            'incident_trends' => $incidentTrends,
            'fr_sr_trends' => array_values($frSrData),
            'company_incidents' => $topCompanies,
            'department_incidents' => $topDepartments,
            'accident_causes' => [
                'unsafe_acts' => array_sum($unsafeActs),
                'job_factors' => array_sum($jobFactors),
                'unsafe_conditions' => array_sum($unsafeConditions),
                'personal_factors' => array_sum($personalFactors),
            ],
        ];
    }
}
