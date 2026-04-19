<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    protected $table = 'm_statuses';
    protected $fillable = ['name', 'is_active'];
}
