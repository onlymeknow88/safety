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
        Schema::create('pica_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('analisa_kecelakaan_id')->constrained('analisa_kecelakaan')->cascadeOnDelete();
            $table->foreignId('analisa_kecelakaan_approval_id')->nullable()->constrained('analisa_kecelakaan_approvals')->nullOnDelete();
            $table->text('problem_identification');
            $table->text('corrective_action');
            $table->string('pic')->nullable();
            $table->date('due_date')->nullable();
            $table->string('status')->default('Open');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pica_items');
    }
};
