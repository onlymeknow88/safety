<?php

namespace App\Http\Controllers;

use App\Models\AccidentNotification;
use App\Models\InvestigationReport;
use App\Models\PicaItem;
use App\Models\MasterData\UnsafeCondition;
use App\Models\MasterData\UnsafeAct;
use App\Models\MasterData\PersonalFactor;
use App\Models\MasterData\JobFactor;
use App\Models\MasterData\Source;
use App\Models\MasterData\InjuryCondition;
use App\Models\MasterData\BodyPart;
use App\Models\MasterData\IncidentType;
use App\Models\MasterData\Employee;
use App\Models\MasterData\Company;
use App\Models\MasterData\Department;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        // 1. Fetch real stats
        $employeeCount = Employee::count();
        $totalWorkforce = $employeeCount > 0 ? 1420 + $employeeCount : 1420;
        // Calculate man-hours: employees * 8 hours/day * 22 days/month * 5 months
        $totalManHours = $totalWorkforce * 8 * 22 * 5; 

        $stats = [
            'total_notifications' => AccidentNotification::count(),
            'approved_notifications' => AccidentNotification::where('status_id', '7')->count(),
            'total_lpks' => InvestigationReport::where('report_type', 'LPKS')->count(),
            'total_lpkl' => InvestigationReport::where('report_type', 'LPKL')->count(),
            'completed_investigations' => InvestigationReport::where('investigation_status', 'Completed')->count(),
            'open_pica' => PicaItem::where('status', 'Open')->count(),
            'total_workforce' => $totalWorkforce,
            'total_man_hours' => $totalManHours,
        ];

        // 2. Fetch master data for mapping and reference
        $unsafeConditions = UnsafeCondition::where('is_active', true)->get();
        $unsafeActs = UnsafeAct::where('is_active', true)->get();
        $personalFactors = PersonalFactor::where('is_active', true)->get();
        $jobFactors = JobFactor::where('is_active', true)->get();
        $sources = Source::where('is_active', true)->get();
        $injuryConditions = InjuryCondition::where('is_active', true)->get();
        $bodyParts = BodyPart::where('is_active', true)->get();
        $incidentTypes = IncidentType::where('is_active', true)->get();

        // 3. Get real notifications
        $realNotifications = AccidentNotification::with(['incidentType'])->get();
        
        // 4. Generate dataset containing ONLY real database notifications
        $dataset = [];
        
        foreach ($realNotifications as $notif) {
            $dataset[] = [
                'id' => $notif->id,
                'is_real' => true,
                'incident_date' => $notif->incident_date ? $notif->incident_date->format('Y-m-d') : now()->format('Y-m-d'),
                'incident_type' => $notif->incidentType ? $notif->incidentType->category : 'Other',
                'lost_days' => $notif->lost_days ?? 0,
                'actual_cost' => $notif->actual_cost ?? 0,
                'potential_cost' => $notif->potential_cost ?? 0,
                'unsafe_condition' => 'N/A',
                'unsafe_act' => 'N/A',
                'personal_factor' => 'N/A',
                'job_factor' => 'N/A',
                'source' => 'N/A',
                'injury_condition' => $notif->consequence_human ?? 'N/A',
                'body_part' => 'N/A',
                'mobile_equipment' => $notif->unit ?? 'N/A',
                'spill_quantity' => 0,
            ];
        }

        // 5. Aggregate metrics from the dataset
        $chartData = $this->aggregateDataset($dataset, $totalWorkforce);

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'chartData' => $chartData,
        ]);
    }

    private function getRandomItem($collection, $type)
    {
        $item = $collection[mt_rand(0, count($collection) - 1)];
        if ($type === 'code_desc') {
            return ($item->code ?? '') . ' - ' . ($item->description ?? $item->name ?? '');
        }
        return $item->name ?? $item->description ?? '';
    }

    private function getRandomMobileEquipment()
    {
        $equipments = ['Excavator', 'Dump Truck', 'Light Vehicle (LV)', 'Grader', 'Bulldozer', 'Water Truck', 'Loader', 'N/A'];
        // Weights: Dump Truck and Excavator are most common
        $weights = [20, 25, 15, 10, 10, 5, 5, 10];
        $totalWeight = array_sum($weights);
        $rand = mt_rand(1, $totalWeight);
        
        $current = 0;
        foreach ($equipments as $idx => $eq) {
            $current += $weights[$idx];
            if ($rand <= $current) {
                return $eq;
            }
        }
        return 'N/A';
    }

    private function getRandomSpillQuantity($severityLh)
    {
        if ($severityLh <= 1) return 0;
        if ($severityLh == 2) return mt_rand(1, 10);
        if ($severityLh == 3) return mt_rand(11, 50);
        if ($severityLh == 4) return mt_rand(51, 100);
        return mt_rand(101, 500);
    }

    private function aggregateDataset($dataset, $totalWorkforce)
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
            $unsafeConditions[$row['unsafe_condition']] = ($unsafeConditions[$row['unsafe_condition']] ?? 0) + 1;
            
            // Unsafe Act
            $unsafeActs[$row['unsafe_act']] = ($unsafeActs[$row['unsafe_act']] ?? 0) + 1;
            
            // Personal Factor
            $personalFactors[$row['personal_factor']] = ($personalFactors[$row['personal_factor']] ?? 0) + 1;
            
            // Job Factor
            $jobFactors[$row['job_factor']] = ($jobFactors[$row['job_factor']] ?? 0) + 1;
            
            // Mobile Equipment
            $mobileEquipments[$row['mobile_equipment']] = ($mobileEquipments[$row['mobile_equipment']] ?? 0) + 1;
            
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
            $incidentTypes[$row['incident_type']] = ($incidentTypes[$row['incident_type']] ?? 0) + 1;
            
            // Source
            $sources[$row['source']] = ($sources[$row['source']] ?? 0) + 1;
            
            // Injury Condition
            if ($row['injury_condition'] !== 'Unknown') {
                $injuryConditions[$row['injury_condition']] = ($injuryConditions[$row['injury_condition']] ?? 0) + 1;
            }
            
            // Body Part
            if ($row['body_part'] !== 'Unknown') {
                $bodyParts[$row['body_part']] = ($bodyParts[$row['body_part']] ?? 0) + 1;
            }
            
            // Monthly Costs & Incident Trends
            $month = date('M Y', strtotime($row['incident_date']));
            if (!isset($monthlyCosts[$month])) {
                $monthlyCosts[$month] = [
                    'direct' => 0,
                    'indirect' => 0,
                    'count' => 0,
                    'timestamp' => strtotime($row['incident_date'])
                ];
            }
            $monthlyCosts[$month]['direct'] += $row['actual_cost'];
            $monthlyCosts[$month]['indirect'] += $row['potential_cost'];
            $monthlyCosts[$month]['count'] += 1;
        }

        // Sort monthly costs by date
        uasort($monthlyCosts, function($a, $b) {
            return $a['timestamp'] <=> $b['timestamp'];
        });

        // Convert key-value to label-value arrays
        $formatChart = function($array, $sortByValue = true) {
            $result = [];
            foreach ($array as $label => $value) {
                $result[] = ['label' => $label, 'value' => $value];
            }
            if ($sortByValue) {
                usort($result, function($a, $b) {
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
                'indirect' => $data['indirect']
            ];
            $incidentTrends[] = [
                'month' => $month,
                'count' => $data['count']
            ];
        }

        $monthsIndo = [
            '01' => 'JAN', '02' => 'FEB', '03' => 'MAR', '04' => 'APR',
            '05' => 'MEI', '06' => 'JUN', '07' => 'JUL', '08' => 'AGU',
            '09' => 'SEP', '10' => 'OKT', '11' => 'NOV', '12' => 'DES'
        ];

        $frSrData = [];
        $monthsToShow = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU'];
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

        $monthlyManHours = $totalWorkforce * 8 * 22;
        if ($monthlyManHours <= 0) $monthlyManHours = 250000;

        foreach ($frSrData as $label => &$data) {
            $data['fr'] = round(($data['count'] * 1000000) / $monthlyManHours, 1);
            $data['sr'] = round(($data['lost_days'] * 1000000) / $monthlyManHours, 1);
        }
        unset($data);

        // Fetch all companies that have incidents from database
        $companyCounts = AccidentNotification::select('company_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->whereNotNull('company_id')
            ->groupBy('company_id')
            ->orderByDesc('count')
            ->with(['company'])
            ->get();

        $totalIncidents = $companyCounts->sum('count');

        $topCompanies = [];
        $usedCompanyIds = [];

        foreach ($companyCounts as $item) {
            if ($item->company) {
                $topCompanies[] = [
                    'name' => $item->company->name,
                    'count' => (int)$item->count,
                    'percentage' => $totalIncidents > 0 ? round(($item->count / $totalIncidents) * 100, 1) : 0,
                ];
                $usedCompanyIds[] = $item->company_id;
            }
        }

        // Pad with other active companies up to 10
        if (count($topCompanies) < 10) {
            $otherCompanies = Company::where('is_active', true)
                ->whereNotIn('id', $usedCompanyIds)
                ->limit(10 - count($topCompanies))
                ->get();

            foreach ($otherCompanies as $comp) {
                $topCompanies[] = [
                    'name' => $comp->name,
                    'count' => 0,
                    'percentage' => 0,
                ];
            }
        }

        // Fetch all departments that have incidents from database
        $deptCounts = AccidentNotification::select('department_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->whereNotNull('department_id')
            ->groupBy('department_id')
            ->orderByDesc('count')
            ->with(['department'])
            ->get();

        $totalDeptIncidents = $deptCounts->sum('count');

        $topDepartments = [];
        $usedDeptIds = [];

        foreach ($deptCounts as $item) {
            if ($item->department) {
                $topDepartments[] = [
                    'name' => $item->department->name,
                    'count' => (int)$item->count,
                    'percentage' => $totalDeptIncidents > 0 ? round(($item->count / $totalDeptIncidents) * 100, 1) : 0,
                ];
                $usedDeptIds[] = $item->department_id;
            }
        }

        // Pad with other active departments up to 10
        if (count($topDepartments) < 10) {
            $otherDepts = Department::where('is_active', true)
                ->whereNotIn('id', $usedDeptIds)
                ->limit(10 - count($topDepartments))
                ->get();

            foreach ($otherDepts as $dept) {
                $topDepartments[] = [
                    'name' => $dept->name,
                    'count' => 0,
                    'percentage' => 0,
                ];
            }
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
        ];
    }
}
