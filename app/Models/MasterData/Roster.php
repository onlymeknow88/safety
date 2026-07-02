<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class Roster extends Model
{
    protected $table = 'm_rosters';
    protected $fillable = ['pattern', 'is_active', 'sort_order'];
}
