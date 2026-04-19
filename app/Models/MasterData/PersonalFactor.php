<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class PersonalFactor extends Model
{
    protected $table = 'm_personal_factors';
    protected $fillable = ['code', 'description', 'is_active'];
}
