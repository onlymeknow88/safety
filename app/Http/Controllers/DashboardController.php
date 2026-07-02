<?php

namespace App\Http\Controllers;

use App\Models\MasterData\Ccow;
use App\Models\MasterData\Company;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $isPowerUser = $user->hasRole('crs', 'CRS', 'hse-admin', 'HSE Admin', 'hse_admin', 'admin', 'super-admin', 'superadmin', 'Super Admin');

        // Filter parameters
        $ccowId = request('ccow_id');
        $companyId = request('company_id');

        // Scoping for non-power users
        if (! $isPowerUser) {
            $companyId = $user->employee?->company_id;
            $ccowId = $user->employee?->ccow_id;
        }

        // Period filter (default: this year)
        $startDate = request('start_date', date('Y-01-01'));
        $endDate = request('end_date', date('Y-12-31'));

        // Fetch CCOWs and Companies for select options
        $ccows = Ccow::where('is_active', true)->get(['id', 'name']);
        $companies = Company::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Dashboard/Index', [
            'filters' => [
                'ccow_id' => $ccowId,
                'company_id' => $companyId,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'ccows' => $ccows,
            'companies' => $companies,
            'isPowerUser' => $isPowerUser,
        ]);
    }
}
