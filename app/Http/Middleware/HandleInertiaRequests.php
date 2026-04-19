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
            $user->load('roles.menus');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => method_exists($user, 'getRoleNames') ? $user->getRoleNames()->toArray() : [],
                    'permissions' => method_exists($user, 'getAllPermissions') ? $user->getAllPermissions()->toArray() : [],
                    // Structured menus for dynamic sidebar
                    'menus' => $user->roles->flatMap->menus
                        ->filter(fn($m) => $m->is_active && $m->pivot->can_view)
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
