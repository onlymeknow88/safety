<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    protected $table = 'm_sources';
    protected $fillable = ['code', 'description', 'is_active'];
}
