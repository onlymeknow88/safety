<?php

namespace App\Http\Controllers;

use App\Models\AccidentNotification;
use App\Models\InvestigationReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalQueueController extends Controller
{
    /**
     * Tampilan halaman Approval Queue.
     * Menampilkan daftar laporan yang perlu di-approve oleh user yang login.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        // Ambil slug role untuk pengecekan level approval
        $userRoles = $user->getRoleNames()->map(fn($r) => strtolower($r))->toArray();
        $isAdministrator = $user->is_administrator ?? false;

        $isCrs = $isAdministrator
            || $user->hasRole('crs', 'admin', 'superadmin', 'super-admin', 'hse admin', 'hse_admin')
            || ($user->employee && $user->employee->can_approve);

        // ── Accident Notification Queue ───────────────────────────────────────
        // Tampilkan Accident Notification yang menunggu approval
        $accidentQuery = AccidentNotification::with([
            'ccow', 'company', 'location', 'incidentType', 'status',
            'department', 'reporter', 'approver',
        ])->whereHas('status', fn($q) => $q->where('name', 'not like', '%draft%')
            ->where('name', 'not like', '%approved%')
            ->where('name', 'not like', '%returned%')
        );

        if (!$isCrs && $user->employee_id) {
            $accidentQuery->where('company_id', $user->employee->company_id);
        }

        $pendingAccidents = $accidentQuery->latest()->get();

        // ── Investigation Report Queue ────────────────────────────────────────
        // Tentukan level approval berdasarkan role user
        $approvalLevels = [];

        if ($isCrs) {
            // CRS melihat semua laporan yang sedang dalam proses (bukan Draft / Completed)
            $approvalLevels = ['PJA', 'ENV_DH', 'OHS_DH', 'KTT'];
        } else {
            // Mapping role slug ke level approval
            if ($user->hasRole('ktt'))               $approvalLevels[] = 'KTT';
            if ($user->hasRole('ohs_dh', 'ohs'))     $approvalLevels[] = 'OHS_DH';
            if ($user->hasRole('env_dh', 'env'))     $approvalLevels[] = 'ENV_DH';
            if ($user->hasRole('pja'))               $approvalLevels[] = 'PJA';
        }

        $investigationQuery = InvestigationReport::with([
            'accidentNotification.ccow',
            'accidentNotification.company',
            'accidentNotification.location',
            'accidentNotification.incidentType',
            'accidentNotification.department',
            'approvals.approvedBy',
        ])->where('safe_draft', false)
          ->where('investigation_status', '!=', 'Completed')
          ->where('investigation_status', '!=', 'Draft');

        if (!empty($approvalLevels)) {
            $investigationQuery->whereIn('current_approval_level', $approvalLevels);
        } else {
            // Jika tidak ada level yang cocok, kembalikan kosong
            $investigationQuery->whereRaw('1 = 0');
        }

        if (!$isCrs && $user->employee_id) {
            $investigationQuery->whereHas('accidentNotification', function ($q) use ($user) {
                $q->where('company_id', $user->employee->company_id);
            });
        }

        $pendingInvestigations = $investigationQuery->latest()->get();

        // ── Returned Queue ───────────────────────────────────────────────────
        // Laporan yang dikembalikan (Returned) — untuk reporter/pembuat laporan
        $returnedInvestigations = InvestigationReport::with([
            'accidentNotification.ccow',
            'accidentNotification.company',
            'approvals' => fn($q) => $q->where('status', 'Returned')->latest(),
        ])->where('investigation_status', 'Returned')
          ->when(!$isCrs && $user->employee_id, fn($q) =>
              $q->whereHas('accidentNotification', fn($sq) =>
                  $sq->where('company_id', $user->employee->company_id)
              )
          )
          ->latest()
          ->get();

        // ── Summary Counts ────────────────────────────────────────────────────
        $summary = [
            'pending_accidents'     => $pendingAccidents->count(),
            'pending_investigations' => $pendingInvestigations->count(),
            'returned_investigations' => $returnedInvestigations->count(),
            'total_pending'         => $pendingAccidents->count() + $pendingInvestigations->count(),
        ];

        return Inertia::render('ApprovalQueue/Index', [
            'pendingAccidents'      => $pendingAccidents,
            'pendingInvestigations' => $pendingInvestigations,
            'returnedInvestigations' => $returnedInvestigations,
            'summary'               => $summary,
            'userApprovalLevels'    => $approvalLevels,
            'isCrs'                 => $isCrs,
        ]);
    }
}
