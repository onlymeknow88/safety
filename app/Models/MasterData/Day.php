<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class Day extends Model
{
    protected $table = 'm_days';
    protected $fillable = ['name', 'is_active', 'sort_order'];
}
