<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\MasterData\Ccow;

class InvestigationReport extends Model
{
    protected $table = 'analisa_kecelakaan';

    protected $guarded = [];

    protected $casts = [
        'corrective_action_plan' => 'array',
        'is_environmental' => 'boolean',
        'safe_draft' => 'boolean',
        'ktt_approved' => 'boolean',
        'ohs_approved' => 'boolean',
        'env_approved' => 'boolean',
        'pja_approved' => 'boolean',
        'unsafe_actions' => 'array',
        'unsafe_conditions' => 'array',
        'personal_factors' => 'array',
        'job_factors' => 'array',
        'cause_details' => 'array',
        'investigation_checklist' => 'array',
    ];

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

            // Get associated accident notification to fetch ccow code
            $notification = AccidentNotification::with('ccow')->find($model->accident_notification_id);
            $ccowCode = 'LC';
            if ($notification && $notification->ccow) {
                $ccowCode = strtoupper($notification->ccow->inisial ?? 'LC');
            }

            // Count based on year
            $count = static::whereYear('created_at', $year)->count() + 1;
            $formattedCount = sprintf('%02d', $count);

            $type = $model->report_type ?? 'LPKS';

            if (empty($model->report_number)) {
                $model->report_number = "{$formattedCount}/{$type}-{$ccowCode}/{$romanMonth}/{$year}";
            }
        });
    }

    public function accidentNotification()
    {
        return $this->belongsTo(AccidentNotification::class, 'accident_notification_id');
    }

    public function documents()
    {
        return $this->hasMany(InvestigationDocument::class, 'analisa_kecelakaan_id');
    }

    public function approvals()
    {
        return $this->hasMany(InvestigationApproval::class, 'analisa_kecelakaan_id');
    }

    public function presentation()
    {
        return $this->hasOne(Presentation::class, 'analisa_kecelakaan_id');
    }

    public function picaItems()
    {
        return $this->hasMany(PicaItem::class, 'analisa_kecelakaan_id');
    }

    public function incidentType()
    {
        return $this->belongsTo(MasterData\IncidentType::class, 'incident_type_id');
    }

    public function source()
    {
        return $this->belongsTo(MasterData\Source::class, 'source_id');
    }

    public function workExperienceInterval()
    {
        return $this->belongsTo(MasterData\IntervalExperience::class, 'work_experience_interval_id');
    }

    public function injuryCondition()
    {
        return $this->belongsTo(MasterData\InjuryCondition::class, 'injury_condition_id');
    }

    public function bodyPart()
    {
        return $this->belongsTo(MasterData\BodyPart::class, 'body_part_id');
    }
}
