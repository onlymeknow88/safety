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
            $table->unsignedBigInteger('reporter_id')->nullable()->after('company_contractor_id');
            $table->unsignedBigInteger('approver_id')->nullable()->after('approver_position');

            $table->foreign('reporter_id')->references('id')->on('m_employees')->onDelete('set null');
            $table->foreign('approver_id')->references('id')->on('m_employees')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->dropForeign(['reporter_id']);
            $table->dropForeign(['approver_id']);
            $table->dropColumn(['reporter_id', 'approver_id']);
        });
    }
};
