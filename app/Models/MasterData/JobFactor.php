<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class JobFactor extends Model
{
    protected $table = 'm_job_factors';
    protected $fillable = ['code', 'description', 'is_active'];
}
