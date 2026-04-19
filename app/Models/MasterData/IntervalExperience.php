<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class IntervalExperience extends Model
{
    protected $table = 'm_interval_experiences';
    protected $fillable = ['label', 'is_active'];
}
