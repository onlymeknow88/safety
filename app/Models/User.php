<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'employee_id',
        'azure_id',
        'azure_token',
        'azure_refresh_token',
    ];

    public function employee()
    {
        return $this->belongsTo(\App\Models\MasterData\Employee::class, 'employee_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Roles and Permissions
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole(...$roles)
    {
        return $this->roles()->whereIn('slug', $roles)->exists();
    }

    public function hasPermission($permission)
    {
        // Permission format: "menu-slug.action" (e.g., "user-management.view")
        if (!str_contains($permission, '.')) return false;

        [$menuSlug, $action] = explode('.', $permission);
        $column = 'can_' . $action;

        return $this->roles()->whereHas('menus', function($q) use ($menuSlug, $column) {
            $q->where('slug', $menuSlug)->where('role_menu.' . $column, true);
        })->exists();
    }

    // New helper to get all permissions as strings (e.g. ['user.view', 'user.create'])
    public function getAllPermissions()
    {
        $permissions = collect();

        foreach ($this->roles as $role) {
            foreach ($role->menus as $menu) {
                if ($menu->pivot->can_view) $permissions->push($menu->slug . '.view');
                if ($menu->pivot->can_create) $permissions->push($menu->slug . '.create');
                if ($menu->pivot->can_edit) $permissions->push($menu->slug . '.edit');
                if ($menu->pivot->can_delete) $permissions->push($menu->slug . '.delete');
                if ($menu->pivot->can_approval) $permissions->push($menu->slug . '.approval');
            }
        }

        return $permissions->unique();
    }

    public function getRoleNames()
    {
        return $this->roles->pluck('slug');
    }
}
