<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            if (!Schema::hasColumn('accident_notifications', 'has_lpks_lpkl')) {
                $table->boolean('has_lpks_lpkl')->default(false)->after('status_id');
            }
            if (!Schema::hasColumn('accident_notifications', 'lpks_lpkl')) {
                $table->string('lpks_lpkl')->nullable()->after('has_lpks_lpkl');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->dropColumn(['has_lpks_lpkl', 'lpks_lpkl']);
        });
    }
};
