<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class UnsafeAct extends Model
{
    protected $table = 'm_unsafe_acts';
    protected $fillable = ['code', 'description', 'is_active'];
}
