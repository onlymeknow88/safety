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
        Schema::create('m_manhours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ccow_id')->nullable()->constrained('m_ccows')->onDelete('cascade');
            $table->foreignId('company_id')->nullable()->constrained('m_company')->onDelete('cascade');
            $table->unsignedTinyInteger('bulan');
            $table->unsignedSmallInteger('tahun');
            $table->unsignedInteger('total_headcount')->default(0);
            $table->double('total_manhours', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_manhours');
    }
};
