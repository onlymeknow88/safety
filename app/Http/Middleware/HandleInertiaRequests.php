<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user) {
            $user->load(['roles.menus.parent', 'employee']);
        }

        $isAdministrator = $user ? (
            $user->roles->contains('name', 'Administrator') || 
            $user->roles->contains('slug', 'admin') ||
            $user->roles->contains('name', 'Super Admin') ||
            $user->roles->contains('slug', 'super-admin')
        ) : false;
        
        $canApprove = $user ? (
            $isAdministrator || 
            ($user->employee ? (bool)$user->employee->can_approve : \App\Models\MasterData\Employee::where('email', $user->email)->where('can_approve', true)->exists())
        ) : false;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'employee_id' => $user->employee_id,
                    'roles' => method_exists($user, 'getRoleNames') ? $user->getRoleNames()->toArray() : [],
                    'permissions' => method_exists($user, 'getAllPermissions') ? $user->getAllPermissions()->pluck('name')->toArray() : [],
                    'can_approve' => $canApprove,
                    'is_administrator' => $isAdministrator,
                    // Structured menus for dynamic sidebar
                    'menus' => $user->roles->flatMap->menus
                        ->filter(function($m) use ($canApprove, $isAdministrator) {
                            // Menu harus aktif dan bisa dilihat
                            if (!$m->is_active || (!$m->pivot->can_view && !$isAdministrator)) return false;

                            // Jika menu ini membutuhkan akses approval, user harus memiliki can_approve aktif (Administrator bypass)
                            if ($m->pivot->can_approval && !$canApprove && !$isAdministrator) return false;
                            
                            // Jika punya parent, parent tersebut juga harus aktif
                            if ($m->parent_id && $m->parent && !$m->parent->is_active) return false;
                            
                            return true;
                        })
                        ->unique('id')
                        ->map(fn($m) => [
                            'id' => $m->id,
                            'name' => $m->name,
                            'slug' => $m->slug,
                            'icon' => $m->icon,
                            'url' => $m->url,
                            'parent_id' => $m->parent_id,
                            'order' => $m->order,
                        ])->values(),
                ] : null,
            ],
        ];
    }
}
