<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Menu;

$menus = Menu::whereNull('parent_id')->orderBy('order')->get();

foreach ($menus as $menu) {
    echo "ID: " . $menu->id . " | Name: " . $menu->name . " | Order: " . $menu->order . "\n";
}
