<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'm_locations';
    protected $fillable = ['ccow_id', 'name', 'is_active'];

    public function ccow()
    {
        return $this->belongsTo(Ccow::class, 'ccow_id');
    }
}
