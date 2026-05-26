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
            // Drop foreign keys first
            if (Schema::hasColumn('accident_notifications', 'victim_gender_id')) {
                $table->dropForeign(['victim_gender_id']);
            }
            if (Schema::hasColumn('accident_notifications', 'victim_age_interval_id')) {
                $table->dropForeign(['victim_age_interval_id']);
            }
            if (Schema::hasColumn('accident_notifications', 'victim_position_id')) {
                $table->dropForeign(['victim_position_id']);
            }
            if (Schema::hasColumn('accident_notifications', 'victim_experience_id')) {
                $table->dropForeign(['victim_experience_id']);
            }

            // Drop columns
            $table->dropColumn([
                'kait_reporting_date',
                'victim_name',
                'victim_gender_id',
                'victim_age',
                'victim_age_interval_id',
                'victim_position_id',
                'victim_position_detail',
                'victim_experience_id',
                'lost_days',
                'actual_cost',
                'potential_cost'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->date('kait_reporting_date')->nullable()->after('incident_date');
            $table->string('victim_name')->nullable()->after('incident_consequence');
            
            $table->foreignId('victim_gender_id')->nullable()->after('victim_name')->constrained('m_genders')->onDelete('set null');
            $table->integer('victim_age')->nullable()->after('victim_gender_id');
            $table->foreignId('victim_age_interval_id')->nullable()->after('victim_age')->constrained('m_interval_ages')->onDelete('set null');
            $table->foreignId('victim_position_id')->nullable()->after('victim_age_interval_id')->constrained('m_jabatan')->onDelete('set null');
            
            $table->string('victim_position_detail')->nullable()->after('victim_position_id');
            $table->foreignId('victim_experience_id')->nullable()->after('victim_position_detail')->constrained('m_interval_experiences')->onDelete('set null');
            
            $table->integer('lost_days')->nullable()->after('is_hpri');
            $table->decimal('actual_cost', 20, 2)->nullable()->after('lost_days');
            $table->decimal('potential_cost', 20, 2)->nullable()->after('actual_cost');
        });
    }
};
