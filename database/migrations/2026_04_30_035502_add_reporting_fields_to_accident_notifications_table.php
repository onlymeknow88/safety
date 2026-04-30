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
            $table->string('lpks_lpkl')->nullable()->after('approver_position');
            $table->date('due_date')->nullable()->after('lpks_lpkl');
            $table->date('presentation_date')->nullable()->after('due_date');
            $table->date('submit_date')->nullable()->after('presentation_date');
            $table->string('report_status')->nullable()->after('submit_date');
            $table->string('presentation_invitation')->nullable()->after('report_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->dropColumn([
                'lpks_lpkl',
                'due_date',
                'presentation_date',
                'submit_date',
                'report_status',
                'presentation_invitation'
            ]);
        });
    }
};
