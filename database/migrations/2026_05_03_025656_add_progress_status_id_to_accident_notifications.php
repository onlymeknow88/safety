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
            $table->unsignedBigInteger('progress_status_id')->nullable()->after('status_id');
            $table->foreign('progress_status_id')->references('id')->on('m_statuses')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->dropForeign(['progress_status_id']);
            $table->dropColumn('progress_status_id');
        });
    }
};
