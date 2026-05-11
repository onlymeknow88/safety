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
            if (Schema::hasColumn('accident_notifications', 'progress_status_id')) {
                $table->dropForeign(['progress_status_id']);
            }
            
            $table->dropColumn([
                'lpks_lpkl',
                'due_date',
                'presentation_date',
                'submit_date',
                'report_status',
                'presentation_invitation',
                'progress_status_id',
                'kait_reporting_date'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->string('lpks_lpkl')->nullable();
            $table->date('due_date')->nullable();
            $table->date('presentation_date')->nullable();
            $table->date('submit_date')->nullable();
            $table->string('report_status')->nullable();
            $table->string('presentation_invitation')->nullable();
            $table->unsignedBigInteger('progress_status_id')->nullable();
            $table->date('kait_reporting_date')->nullable();

            $table->foreign('progress_status_id')->references('id')->on('m_statuses')->onDelete('set null');
        });
    }
};
