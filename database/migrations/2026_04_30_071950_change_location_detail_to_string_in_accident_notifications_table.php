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
            if (Schema::hasColumn('accident_notifications', 'location_detail_id')) {
                $table->dropForeign(['location_detail_id']);
                $table->dropColumn('location_detail_id');
            }
            if (!Schema::hasColumn('accident_notifications', 'location_detail')) {
                $table->string('location_detail')->nullable()->after('location_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            if (Schema::hasColumn('accident_notifications', 'location_detail')) {
                $table->dropColumn('location_detail');
            }
            if (!Schema::hasColumn('accident_notifications', 'location_detail_id')) {
                $table->foreignId('location_detail_id')->nullable()->after('location_id')->constrained('m_locations')->onDelete('set null');
            }
        });
    }
};
