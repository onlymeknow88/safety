<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    protected $table = 'm_shifts';
    protected $fillable = ['name', 'is_active'];
}
