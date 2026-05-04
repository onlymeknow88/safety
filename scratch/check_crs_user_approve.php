<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$user = User::where('email', 'crs@admin.com')->first();
if ($user && $user->employee) {
    echo "User: " . $user->name . "\n";
    echo "Employee Can Approve: " . ($user->employee->can_approve ? 'Yes' : 'No') . "\n";
} else {
    echo "User or Employee record not found for crs@admin.com\n";
}
