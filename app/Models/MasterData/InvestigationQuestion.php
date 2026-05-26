<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class InvestigationQuestion extends Model
{
    protected $table = 'm_investigation_questions';

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
