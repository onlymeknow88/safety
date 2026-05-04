<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Menu;

$menu = Menu::where('slug', 'notifikasi-kecelakaan')->first();
if ($menu) {
    $menu->update(['slug' => 'accident-notification']);
    echo "Menu slug updated from 'notifikasi-kecelakaan' to 'accident-notification'.\n";
} else {
    echo "Menu 'notifikasi-kecelakaan' not found.\n";
}
