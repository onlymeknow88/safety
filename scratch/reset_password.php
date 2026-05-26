<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$u = User::where('email', 'a@a.com')->first();
if ($u) {
    $u->password = Hash::make('password');
    $u->save();
    echo "Successfully updated password of a@a.com to: password\n";
} else {
    echo "User a@a.com not found\n";
}
