<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class ReportType extends Model
{
    protected $table = 'm_report_types';
    protected $fillable = ['code', 'is_active'];
}
