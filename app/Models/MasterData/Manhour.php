<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Manhour extends Model
{
    protected $table = 'm_manhours';

    protected $fillable = [
        'ccow_id',
        'company_id',
        'bulan',
        'tahun',
        'total_headcount',
        'total_manhours',
    ];

    public function ccow(): BelongsTo
    {
        return $this->belongsTo(Ccow::class, 'ccow_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
