<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presentation extends Model
{
    protected $fillable = [
        'analisa_kecelakaan_id',
        'scheduled_date',
        'actual_date',
        'status',
        'edited_by',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'actual_date' => 'date',
    ];

    public function investigationReport()
    {
        return $this->belongsTo(InvestigationReport::class, 'analisa_kecelakaan_id');
    }

    public function editedBy()
    {
        return $this->belongsTo(User::class, 'edited_by');
    }
}
