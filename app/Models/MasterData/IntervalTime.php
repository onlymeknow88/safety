<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class IntervalTime extends Model
{
    protected $table = 'm_interval_times';
    protected $fillable = ['label', 'is_active'];
}
