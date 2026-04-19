<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accident_notifications', function (Blueprint $table) {
            $table->id();

            // ── Header Dokumen ──────────────────────────────────
            $table->string('notification_number')->unique()->nullable(); // Auto-generate
            $table->boolean('is_hpri')->default(false);

            // ── Ringkasan Insiden ───────────────────────────────
            $table->date('incident_date');
            $table->time('incident_time');
            $table->string('location');
            $table->string('company_contractor')->nullable();
            $table->string('incident_classification')->nullable();

            // ── Keparahan Aktual ────────────────────────────────
            $table->unsignedTinyInteger('actual_k3')->default(1);  // 1–5
            $table->unsignedTinyInteger('actual_kk')->default(1);
            $table->unsignedTinyInteger('actual_lh')->default(1);

            // ── Keparahan Potensial ─────────────────────────────
            $table->unsignedTinyInteger('potential_k3')->default(1);
            $table->unsignedTinyInteger('potential_kk')->default(1);
            $table->unsignedTinyInteger('potential_lh')->default(1);

            // ── Kronologi & Fakta ───────────────────────────────
            $table->text('chronology')->nullable();
            $table->json('incident_facts')->nullable();     // array of strings
            $table->json('corrective_actions')->nullable(); // array of strings

            // ── Akibat Kecelakaan ───────────────────────────────
            $table->string('consequence_human')->nullable();
            $table->string('consequence_equipment')->nullable();
            $table->string('consequence_environment')->nullable();

            // ── Reporter & Approver ─────────────────────────────
            $table->string('reporter_name')->nullable();
            $table->string('reporter_position')->nullable();
            $table->string('approver_name')->nullable();
            $table->string('approver_position')->nullable();

            // ── Status & Metadata ───────────────────────────────
            $table->enum('status', ['draft', 'submitted'])->default('draft');
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        // Foto disimpan di tabel terpisah (one-to-many, max 3 file)
        Schema::create('accident_notification_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accident_notification_id')
                  ->constrained('accident_notifications')
                  ->cascadeOnDelete();
            $table->string('path');    // storage path relatif
            $table->string('filename')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accident_notification_photos');
        Schema::dropIfExists('accident_notifications');
    }
};
