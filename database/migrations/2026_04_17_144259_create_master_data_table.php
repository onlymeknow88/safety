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
        // ==========================================
        // MASTER DATA: ORGANISASI & LOKASI
        // ==========================================
        Schema::create('m_location_generals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_location_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('general_id')->constrained('m_location_generals');
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ==========================================
        // MASTER DATA: WAKTU & DEMOGRAFI
        // ==========================================
        Schema::create('m_shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Siang/Malam
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_interval_times', function (Blueprint $table) {
            $table->id();
            $table->string('label'); // 06.01-09.00
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_days', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Minggu/Senin
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_rosters', function (Blueprint $table) {
            $table->id();
            $table->string('pattern'); // 5/2, 8/2
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_genders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_interval_ages', function (Blueprint $table) {
            $table->id();
            $table->string('label'); // >=20 s/d <25
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_interval_experiences', function (Blueprint $table) {
            $table->id();
            $table->string('label'); // 1-2 Tahun
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ==========================================
        // MASTER DATA: KLASIFIKASI INSIDEN
        // ==========================================
        Schema::create('m_incident_types', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_kriterias', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // HPRI, Minor, dll
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_report_types', function (Blueprint $table) {
            $table->id();
            $table->string('code'); // LPKS, LPKL
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Open, Closed
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_injury_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_body_parts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ==========================================
        // MASTER DATA: SUMBER & PENYEBAB (KAUSALITAS)
        // ==========================================
        Schema::create('m_sources', function (Blueprint $table) {
            $table->id();
            $table->string('code'); // SK.1
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_unsafe_acts', function (Blueprint $table) {
            $table->id();
            $table->string('code'); // USA.1
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_unsafe_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('code'); // USC.1
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_personal_factors', function (Blueprint $table) {
            $table->id();
            $table->string('code'); // PF.1
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_job_factors', function (Blueprint $table) {
            $table->id();
            $table->string('code'); // JF.1
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('m_recommendations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Eliminasi, Substitusi
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_recommendations');
        Schema::dropIfExists('m_job_factors');
        Schema::dropIfExists('m_personal_factors');
        Schema::dropIfExists('m_unsafe_conditions');
        Schema::dropIfExists('m_unsafe_acts');
        Schema::dropIfExists('m_sources');
        Schema::dropIfExists('m_body_parts');
        Schema::dropIfExists('m_injury_conditions');
        Schema::dropIfExists('m_statuses');
        Schema::dropIfExists('m_report_types');
        Schema::dropIfExists('m_kriterias');
        Schema::dropIfExists('m_incident_types');
        Schema::dropIfExists('m_interval_experiences');
        Schema::dropIfExists('m_interval_ages');
        Schema::dropIfExists('m_genders');
        Schema::dropIfExists('m_rosters');
        Schema::dropIfExists('m_days');
        Schema::dropIfExists('m_interval_times');
        Schema::dropIfExists('m_shifts');
        Schema::dropIfExists('m_location_details');
        Schema::dropIfExists('m_location_generals');
    }
};
