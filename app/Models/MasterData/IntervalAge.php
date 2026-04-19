<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class IntervalAge extends Model
{
    protected $table = 'm_interval_ages';
    protected $fillable = ['label', 'is_active'];
}
