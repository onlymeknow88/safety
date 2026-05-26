<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestigationDocument extends Model
{
    protected $table = 'analisa_kecelakaan_documents';

    protected $guarded = [];

    public function investigationReport()
    {
        return $this->belongsTo(InvestigationReport::class, 'analisa_kecelakaan_id');
    }
}
