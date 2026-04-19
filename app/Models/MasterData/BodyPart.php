<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;

class BodyPart extends Model
{
    protected $table = 'm_body_parts';
    protected $fillable = ['name', 'is_active'];
}
