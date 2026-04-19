<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'url',
        'parent_id',
        'order',
        'is_active'
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_menu')
            ->withPivot('can_view', 'can_create', 'can_edit', 'can_delete', 'can_approval')
            ->withTimestamps();
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order');
    }

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }
}
