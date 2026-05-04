<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Role;

$role = Role::where('name', 'CRS')->first();

if (!$role) {
    echo "Role 'CRS' not found.\n";
    $allRoles = Role::all()->pluck('name');
    echo "Existing roles: " . $allRoles->implode(', ') . "\n";
    exit;
}

echo "Role: " . $role->name . " (Slug: " . $role->slug . ")\n";
echo "Permissions (Menus):\n";

$role->menus->each(function($menu) {
    echo "- " . $menu->name . " (" . $menu->slug . "):\n";
    echo "  View: " . ($menu->pivot->can_view ? 'Yes' : 'No') . "\n";
    echo "  Create: " . ($menu->pivot->can_create ? 'Yes' : 'No') . "\n";
    echo "  Edit: " . ($menu->pivot->can_edit ? 'Yes' : 'No') . "\n";
    echo "  Delete: " . ($menu->pivot->can_delete ? 'Yes' : 'No') . "\n";
    echo "  Approval: " . ($menu->pivot->can_approval ? 'Yes' : 'No') . "\n";
});
