<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class InjuryCondition extends Model
{
    protected $table = 'm_injury_conditions';
    protected $fillable = ['name', 'is_active'];
}
