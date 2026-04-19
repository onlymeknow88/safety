<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class LocationDetail extends Model
{
    protected $table = 'm_location_details';
    protected $fillable = ['general_id', 'name', 'is_active'];

    public function general()
    {
        return $this->belongsTo(LocationGeneral::class, 'general_id');
    }
}
