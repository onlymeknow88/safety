<?php

namespace App\Observers;

use App\Models\InvestigationReport;
use App\Services\SafetyPerformanceService;
use Carbon\Carbon;

class InvestigationReportObserver
{
    protected SafetyPerformanceService $service;

    public function __construct(SafetyPerformanceService $service)
    {
        $this->service = $service;
    }

    /**
     * Handle the InvestigationReport "saved" event.
     */
    public function saved(InvestigationReport $investigationReport): void
    {
        $accident = $investigationReport->accidentNotification;
        if ($accident && $accident->incident_date) {
            $date = Carbon::parse($accident->incident_date);
            $this->service->syncMonth($date->year, $date->month);
        }
    }

    /**
     * Handle the InvestigationReport "deleted" event.
     */
    public function deleted(InvestigationReport $investigationReport): void
    {
        $accident = $investigationReport->accidentNotification;
        if ($accident && $accident->incident_date) {
            $date = Carbon::parse($accident->incident_date);
            $this->service->syncMonth($date->year, $date->month);
        }
    }
}
