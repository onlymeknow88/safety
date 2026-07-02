<?php

namespace App\Observers;

use App\Models\AccidentNotification;
use App\Services\SafetyPerformanceService;
use Carbon\Carbon;

class AccidentNotificationObserver
{
    protected SafetyPerformanceService $service;

    public function __construct(SafetyPerformanceService $service)
    {
        $this->service = $service;
    }

    /**
     * Handle the AccidentNotification "saved" event.
     */
    public function saved(AccidentNotification $accidentNotification): void
    {
        if ($accidentNotification->incident_date) {
            $date = Carbon::parse($accidentNotification->incident_date);
            $this->service->syncMonth($date->year, $date->month);

            // Jika incident_date berubah bulan/tahunnya, sync juga bulan/tahun yang lama
            if ($accidentNotification->isDirty('incident_date')) {
                $originalDateRaw = $accidentNotification->getOriginal('incident_date');
                if ($originalDateRaw) {
                    $originalDate = Carbon::parse($originalDateRaw);
                    if ($originalDate->format('Y-m') !== $date->format('Y-m')) {
                        $this->service->syncMonth($originalDate->year, $originalDate->month);
                    }
                }
            }
        }
    }

    /**
     * Handle the AccidentNotification "deleted" event.
     */
    public function deleted(AccidentNotification $accidentNotification): void
    {
        if ($accidentNotification->incident_date) {
            $date = Carbon::parse($accidentNotification->incident_date);
            $this->service->syncMonth($date->year, $date->month);
        }
    }
}
