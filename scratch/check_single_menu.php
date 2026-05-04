<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Menu;

$menu = Menu::where('slug', 'notifikasi-kecelakaan')->first();
if ($menu) {
    echo "Name: " . $menu->name . "\n";
    echo "Slug: " . $menu->slug . "\n";
    echo "URL: " . $menu->url . "\n";
} else {
    echo "Menu not found.\n";
}
