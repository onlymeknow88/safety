<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Role;

$role = Role::where('name', 'CRS')->first();

foreach ($role->menus as $menu) {
    if ($menu->pivot->can_view) {
        echo "Menu: " . $menu->name . " (ID: " . $menu->id . ", Parent: " . $menu->parent_id . ")\n";
    }
}
