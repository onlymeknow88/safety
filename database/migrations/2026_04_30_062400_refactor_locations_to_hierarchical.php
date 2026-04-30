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
        // 1. Update m_locations to support hierarchy
        Schema::table('m_locations', function (Blueprint $table) {
            if (!Schema::hasColumn('m_locations', 'parent_id')) {
                $table->foreignId('parent_id')->nullable()->after('ccow_id')->constrained('m_locations')->onDelete('cascade');
            }
        });

        // 2. Update accident_notifications to use foreign key for detail
        Schema::table('accident_notifications', function (Blueprint $table) {
            // Remove the string column I added earlier
            if (Schema::hasColumn('accident_notifications', 'location_detail')) {
                $table->dropColumn('location_detail');
            }

            // Add the new foreign key
            if (!Schema::hasColumn('accident_notifications', 'location_detail_id')) {
                $table->foreignId('location_detail_id')->nullable()->after('location_id')->constrained('m_locations')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
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

        Schema::table('m_locations', function (Blueprint $table) {
            if (Schema::hasColumn('m_locations', 'parent_id')) {
                $table->dropForeign(['parent_id']);
                $table->dropColumn('parent_id');
            }
        });
    }
};
