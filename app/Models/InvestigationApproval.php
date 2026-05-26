<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestigationApproval extends Model
{
    protected $table = 'analisa_kecelakaan_approvals';

    protected $guarded = [];

    protected $casts = [
        'tick_box' => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function investigationReport()
    {
        return $this->belongsTo(InvestigationReport::class, 'analisa_kecelakaan_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
