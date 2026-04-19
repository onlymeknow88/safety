<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    protected $table = 'm_recommendations';
    protected $fillable = ['name', 'is_active'];
}
