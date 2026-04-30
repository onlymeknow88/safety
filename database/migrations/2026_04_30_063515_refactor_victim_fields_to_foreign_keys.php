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
            // 1. Department
            if (Schema::hasColumn('accident_notifications', 'department')) {
                $table->dropColumn('department');
            }
            if (!Schema::hasColumn('accident_notifications', 'department_id')) {
                $table->foreignId('department_id')->nullable()->after('victim_experience')->constrained('m_department')->onDelete('set null');
            }

            // 2. Victim Gender
            if (Schema::hasColumn('accident_notifications', 'victim_gender')) {
                $table->dropColumn('victim_gender');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_gender_id')) {
                $table->foreignId('victim_gender_id')->nullable()->after('victim_name')->constrained('m_genders')->onDelete('set null');
            }

            // 3. Victim Age Interval
            if (Schema::hasColumn('accident_notifications', 'victim_age_interval')) {
                $table->dropColumn('victim_age_interval');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_age_interval_id')) {
                $table->foreignId('victim_age_interval_id')->nullable()->after('victim_age')->constrained('m_interval_ages')->onDelete('set null');
            }

            // 4. Victim Position
            if (Schema::hasColumn('accident_notifications', 'victim_position')) {
                $table->dropColumn('victim_position');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_position_id')) {
                $table->foreignId('victim_position_id')->nullable()->after('victim_age_interval_id')->constrained('m_jabatan')->onDelete('set null');
            }

            // 5. Victim Experience
            if (Schema::hasColumn('accident_notifications', 'victim_experience')) {
                $table->dropColumn('victim_experience');
            }
            if (!Schema::hasColumn('accident_notifications', 'victim_experience_id')) {
                $table->foreignId('victim_experience_id')->nullable()->after('victim_position_detail')->constrained('m_interval_experiences')->onDelete('set null');
            }

            // 6. Company Contractor
            if (Schema::hasColumn('accident_notifications', 'company_contractor')) {
                $table->dropColumn('company_contractor');
            }
            if (!Schema::hasColumn('accident_notifications', 'company_contractor_id')) {
                $table->foreignId('company_contractor_id')->nullable()->after('unit')->constrained('m_company')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');
            $table->string('department')->nullable();

            $table->dropForeign(['victim_gender_id']);
            $table->dropColumn('victim_gender_id');
            $table->string('victim_gender')->nullable();

            $table->dropForeign(['victim_age_interval_id']);
            $table->dropColumn('victim_age_interval_id');
            $table->string('victim_age_interval')->nullable();

            $table->dropForeign(['victim_position_id']);
            $table->dropColumn('victim_position_id');
            $table->string('victim_position')->nullable();

            $table->dropForeign(['victim_experience_id']);
            $table->dropColumn('victim_experience_id');
            $table->string('victim_experience')->nullable();

            $table->dropForeign(['company_contractor_id']);
            $table->dropColumn('company_contractor_id');
            $table->string('company_contractor')->nullable();
        });
    }
};
