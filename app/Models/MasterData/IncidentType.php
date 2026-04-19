<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class IncidentType extends Model
{
    protected $table = 'm_incident_types';
    protected $fillable = ['category', 'description', 'is_active'];
}
