<?php
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== STATUSES ===\n";
$statuses = DB::table('m_statuses')->get();
foreach ($statuses as $s) {
    echo "ID:{$s->id} | name:{$s->name}\n";
}
