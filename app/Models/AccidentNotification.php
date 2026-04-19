<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccidentNotification extends Model
{
    protected $table = 'accident_notifications';
    protected $guarded = [];

    protected $casts = [
        'incident_facts'     => 'array',
        'corrective_actions' => 'array',
        'is_hpri'            => 'boolean',
        'incident_date'      => 'date',
    ];

    // Auto-generate notification_number sebelum create
    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (empty($model->notification_number)) {
                $year  = now()->format('Y');
                $month = now()->format('m');
                $count = static::whereYear('created_at', $year)
                               ->whereMonth('created_at', $month)
                               ->count() + 1;
                $model->notification_number = sprintf('AN/%s/%s/%04d', $year, $month, $count);
            }
        });
    }

    public function photos()
    {
        return $this->hasMany(AccidentNotificationPhoto::class);
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}
