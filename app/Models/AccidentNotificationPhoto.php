<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccidentNotificationPhoto extends Model
{
    protected $table = 'accident_notification_photos';
    protected $guarded = [];

    public function accidentNotification()
    {
        return $this->belongsTo(AccidentNotification::class);
    }
}
