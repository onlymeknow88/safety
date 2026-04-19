<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'role_menu')
            ->withPivot('can_view', 'can_create', 'can_edit', 'can_delete', 'can_approval')
            ->withTimestamps();
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
