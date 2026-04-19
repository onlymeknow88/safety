<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    protected $table = 'm_kriterias';
    protected $fillable = ['name', 'is_active'];
}
