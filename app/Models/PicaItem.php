<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PicaItem extends Model
{
    protected $fillable = [
        'analisa_kecelakaan_id',
        'analisa_kecelakaan_approval_id',
        'problem_identification',
        'corrective_action',
        'pic',
        'due_date',
        'status',
        'created_by'
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function investigationReport()
    {
        return $this->belongsTo(InvestigationReport::class, 'analisa_kecelakaan_id');
    }

    public function investigationApproval()
    {
        return $this->belongsTo(InvestigationApproval::class, 'analisa_kecelakaan_approval_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
