<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class MobileEquipment extends Model
{
    protected $table = 'm_mobile_equipments';
    protected $fillable = ['name', 'is_active', 'sort_order'];
}
