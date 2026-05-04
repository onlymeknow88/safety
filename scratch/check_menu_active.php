<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Menu;

$menu = Menu::where('slug', 'accident-notification')->first();
if ($menu) {
    echo "Name: " . $menu->name . "\n";
    echo "Is Active: " . ($menu->is_active ? 'Yes' : 'No') . "\n";
} else {
    echo "Menu 'accident-notification' not found.\n";
}
