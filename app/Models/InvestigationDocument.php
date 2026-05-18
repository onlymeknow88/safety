<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestigationDocument extends Model
{
    protected $table = 'investigation_documents';

    protected $guarded = [];

    public function investigationReport()
    {
        return $this->belongsTo(InvestigationReport::class, 'investigation_report_id');
    }
}
