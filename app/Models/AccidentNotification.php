<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\MasterData\Ccow;
use App\Models\MasterData\Company;
use App\Models\MasterData\Location; // Menggunakan tabel m_locations yang baru
use App\Models\MasterData\IncidentType;

class AccidentNotification extends Model
{
    protected $table = 'accident_notifications';

    protected $guarded = [];

    protected $casts = [
        'incident_facts' => 'array',
        'corrective_actions' => 'array',
        'is_hpri' => 'boolean',
        'incident_date' => 'date',
        'kait_reporting_date' => 'date',
    ];

    // Auto-generate notification_number sebelum create
    protected static function booted(): void
    {
        static::creating(function ($model) {
            $year = now()->format('Y');
            $month = now()->format('m');
            $romanMonths = [
                '01' => 'I', '02' => 'II', '03' => 'III', '04' => 'IV', '05' => 'V', '06' => 'VI',
                '07' => 'VII', '08' => 'VIII', '09' => 'IX', '10' => 'X', '11' => 'XI', '12' => 'XII',
            ];
            $romanMonth = $romanMonths[$month];

            // Ambil inisial CCOW dari relasi m_ccows secara aman (terutama saat draft)
            $ccow = $model->ccow_id ? Ccow::find($model->ccow_id) : null;
            $ccowCode = $ccow ? strtoupper($ccow->inisial ?? 'LC') : 'LC';

            // Hitung nomor urut berdasarkan tahun
            $count = static::whereYear('created_at', $year)->count() + 1;
            $formattedCount = sprintf('%02d', $count);

            // Set No Investigasi (IR)
            if (empty($model->accident_number)) {
                $model->accident_number = "{$formattedCount}/IR-{$ccowCode}/{$romanMonth}/{$year}";
            }

            if (empty($model->notification_number)) {
                $model->notification_number = "{$formattedCount}/NI-{$ccowCode}/{$romanMonth}/{$year}";
            }

            if (empty($model->uuid)) {
                $model->uuid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    public function ccow()
    {
        return $this->belongsTo(Ccow::class, 'ccow_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function incidentType()
    {
        return $this->belongsTo(IncidentType::class, 'incident_type_id');
    }

    public function photos()
    {
        return $this->hasMany(AccidentNotificationPhoto::class);
    }

    public function investigationReport()
    {
        return $this->hasOne(InvestigationReport::class, 'accident_notification_id');
    }


    public function status()
    {
        return $this->belongsTo(\App\Models\MasterData\Status::class, 'status_id');
    }

    public function department()
    {
        return $this->belongsTo(\App\Models\MasterData\Department::class, 'department_id');
    }

    public function victimGender()
    {
        return $this->belongsTo(\App\Models\MasterData\Gender::class, 'victim_gender_id');
    }

    public function victimAgeInterval()
    {
        return $this->belongsTo(\App\Models\MasterData\IntervalAge::class, 'victim_age_interval_id');
    }

    public function victimPosition()
    {
        return $this->belongsTo(\App\Models\MasterData\Jabatan::class, 'victim_position_id');
    }

    public function victimExperience()
    {
        return $this->belongsTo(\App\Models\MasterData\IntervalExperience::class, 'victim_experience_id');
    }

    public function companyContractor()
    {
        return $this->belongsTo(\App\Models\MasterData\Company::class, 'company_contractor_id');
    }


    public function reporter()
    {
        return $this->belongsTo(\App\Models\MasterData\Employee::class, 'reporter_id');
    }

    public function approver()
    {
        return $this->belongsTo(\App\Models\MasterData\Employee::class, 'approver_id');
    }

}
