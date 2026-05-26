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
        Schema::create('presentations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('analisa_kecelakaan_id')->constrained('analisa_kecelakaan')->cascadeOnDelete();
            $table->date('scheduled_date');
            $table->date('actual_date')->nullable();
            $table->enum('status', ['Scheduled', 'Completed', 'Revised'])->default('Scheduled');
            $table->foreignId('edited_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentations');
    }
};
