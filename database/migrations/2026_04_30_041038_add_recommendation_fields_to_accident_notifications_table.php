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
            // Check and add columns one by one for safety
            if (!Schema::hasColumn('accident_notifications', 'hse_alert_no')) {
                $table->string('hse_alert_no')->nullable()->after('notification_number');
            }

            if (!Schema::hasColumn('accident_notifications', 'location_detail')) {
                $table->string('location_detail')->nullable()->after('location_id');
            }
            
            if (!Schema::hasColumn('accident_notifications', 'incident_title')) {
                $table->string('incident_title', 40)->nullable()->after('location_detail');
            }

            if (!Schema::hasColumn('accident_notifications', 'incident_consequence')) {
                $table->text('incident_consequence')->nullable()->after('incident_title');
            }
            
            // Victim Data
            if (!Schema::hasColumn('accident_notifications', 'victim_name')) {
                $table->string('victim_name')->nullable()->after('incident_consequence');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_gender')) {
                $table->string('victim_gender')->nullable()->after('victim_name');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_age')) {
                $table->integer('victim_age')->nullable()->after('victim_gender');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_age_interval')) {
                $table->string('victim_age_interval')->nullable()->after('victim_age');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_position')) {
                $table->string('victim_position')->nullable()->after('victim_age_interval');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_position_detail')) {
                $table->string('victim_position_detail')->nullable()->after('victim_position');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_experience')) {
                $table->string('victim_experience')->nullable()->after('victim_position_detail');
            }
            
            // Other Data
            if (!Schema::hasColumn('accident_notifications', 'department')) {
                $table->string('department')->nullable()->after('victim_experience');
            }
            
            if (!Schema::hasColumn('accident_notifications', 'lost_days')) {
                $table->integer('lost_days')->nullable()->after('is_hpri');
            }
            if (!Schema::hasColumn('accident_notifications', 'actual_cost')) {
                $table->decimal('actual_cost', 20, 2)->nullable()->after('lost_days');
            }
            if (!Schema::hasColumn('accident_notifications', 'potential_cost')) {
                $table->decimal('potential_cost', 20, 2)->nullable()->after('actual_cost');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $columns = [
                'hse_alert_no',
                'location_detail',
                'incident_title',
                'incident_consequence',
                'victim_name',
                'victim_gender',
                'victim_age',
                'victim_age_interval',
                'victim_position',
                'victim_position_detail',
                'victim_experience',
                'department',
                'lost_days',
                'actual_cost',
                'potential_cost'
            ];

            foreach ($columns as $col) {
                if (Schema::hasColumn('accident_notifications', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
