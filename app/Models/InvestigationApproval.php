<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestigationApproval extends Model
{
    protected $table = 'investigation_approvals';

    protected $guarded = [];

    protected $casts = [
        'tick_box' => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function investigationReport()
    {
        return $this->belongsTo(InvestigationReport::class, 'investigation_report_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
