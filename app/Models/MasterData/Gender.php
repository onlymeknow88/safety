<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{
    protected $table = 'm_genders';
    protected $fillable = ['name', 'is_active'];
}
