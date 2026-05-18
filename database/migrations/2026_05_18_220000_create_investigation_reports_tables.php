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
        Schema::create('investigation_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accident_notification_id')
                  ->unique()
                  ->constrained('accident_notifications')
                  ->cascadeOnDelete();
            
            $table->enum('report_type', ['LPKS', 'LPKL']);
            $table->string('report_number')->unique();
            $table->string('investigation_status')->default('Draft');
            $table->enum('current_approval_level', ['KTT', 'OHS_DH', 'ENV_DH', 'PJA', 'COMPLETED'])->default('KTT');
            $table->boolean('is_environmental')->default(false);
            
            // Detail investigasi tambahan
            $table->longText('investigation_detail')->nullable();
            $table->longText('root_cause_analysis')->nullable();
            $table->json('corrective_action_plan')->nullable(); // PICA
            $table->longText('preventive_action')->nullable();
            
            // Approval check boxes
            $table->boolean('safe_draft')->default(true);
            $table->boolean('ktt_approved')->default(false);
            $table->boolean('ohs_approved')->default(false);
            $table->boolean('env_approved')->default(false);
            $table->boolean('pja_approved')->default(false);
            
            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->timestamps();
        });

        Schema::create('investigation_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investigation_report_id')
                  ->constrained('investigation_reports')
                  ->cascadeOnDelete();
            $table->string('path');
            $table->string('filename');
            $table->string('file_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('created_by')->nullable();
            $table->timestamps();
        });

        Schema::create('investigation_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investigation_report_id')
                  ->constrained('investigation_reports')
                  ->cascadeOnDelete();
            $table->enum('approval_level', ['KTT', 'OHS_DH', 'ENV_DH', 'PJA']);
            $table->foreignId('approved_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->text('comment')->nullable();
            $table->boolean('tick_box')->default(false);
            $table->string('status')->default('Pending'); // Pending, Approved, Returned
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investigation_approvals');
        Schema::dropIfExists('investigation_documents');
        Schema::dropIfExists('investigation_reports');
    }
};
