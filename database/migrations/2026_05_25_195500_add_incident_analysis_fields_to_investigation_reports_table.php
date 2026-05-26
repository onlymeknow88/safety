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
        Schema::table('analisa_kecelakaan', function (Blueprint $table) {
            // Faktor Spesifik Insiden
            $table->foreignId('incident_type_id')->nullable()->constrained('m_incident_types')->nullOnDelete();
            $table->foreignId('source_id')->nullable()->constrained('m_sources')->nullOnDelete();
            $table->string('mobile_equipment')->nullable();
            $table->foreignId('work_experience_interval_id')->nullable()->constrained('m_interval_experiences')->nullOnDelete();
            $table->string('hour_of_shift')->nullable();

            // Dampak & Korban
            $table->foreignId('injury_condition_id')->nullable()->constrained('m_injury_conditions')->nullOnDelete();
            $table->foreignId('body_part_id')->nullable()->constrained('m_body_parts')->nullOnDelete();
            $table->integer('environmental_pollution_qty')->default(0);
            $table->integer('lost_days')->default(0);
            $table->decimal('actual_cost', 15, 2)->default(0);
            $table->decimal('potential_cost', 15, 2)->default(0);

            // Analisa Akar Masalah (Root Cause Tags/Selects)
            $table->json('unsafe_actions')->nullable();
            $table->json('unsafe_conditions')->nullable();
            $table->json('personal_factors')->nullable();
            $table->json('job_factors')->nullable();

            // Detail Penyebab Kecelakaan Table & Checklist
            $table->json('cause_details')->nullable();
            $table->json('investigation_checklist')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('analisa_kecelakaan', function (Blueprint $table) {
            $table->dropForeign(['incident_type_id']);
            $table->dropForeign(['source_id']);
            $table->dropForeign(['work_experience_interval_id']);
            $table->dropForeign(['injury_condition_id']);
            $table->dropForeign(['body_part_id']);

            $table->dropColumn([
                'incident_type_id',
                'source_id',
                'mobile_equipment',
                'work_experience_interval_id',
                'hour_of_shift',
                'injury_condition_id',
                'body_part_id',
                'environmental_pollution_qty',
                'lost_days',
                'actual_cost',
                'potential_cost',
                'unsafe_actions',
                'unsafe_conditions',
                'personal_factors',
                'job_factors',
                'cause_details',
                'investigation_checklist'
            ]);
        });
    }
};
