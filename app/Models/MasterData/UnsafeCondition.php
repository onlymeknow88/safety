<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class UnsafeCondition extends Model
{
    protected $table = 'm_unsafe_conditions';
    protected $fillable = ['code', 'description', 'is_active'];
}
