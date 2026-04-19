<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class LocationGeneral extends Model
{
    protected $table = 'm_location_generals';
    protected $fillable = ['name', 'is_active'];
}
