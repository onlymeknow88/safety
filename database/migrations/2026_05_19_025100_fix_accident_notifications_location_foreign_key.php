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
            // Drop old foreign key pointing to m_location_details
            $table->dropForeign(['location_id']);

            // Re-create the foreign key pointing to m_locations
            $table->foreign('location_id')
                ->references('id')
                ->on('m_locations')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
        });
    }
};
