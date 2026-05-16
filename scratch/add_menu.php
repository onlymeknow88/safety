<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Menu;

$admin = Menu::where('slug', 'administrator')->first();
if ($admin) {
    Menu::updateOrCreate(['slug' => 'email-group-management'], [
        'name' => 'Email Group Management',
        'icon' => 'MailOutlined',
        'url' => '/admin/email-groups',
        'parent_id' => $admin->id,
        'order' => 4
    ]);
    echo "Menu added successfully\n";
} else {
    echo "Admin menu not found\n";
}
