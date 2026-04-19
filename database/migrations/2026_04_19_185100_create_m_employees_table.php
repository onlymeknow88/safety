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
        Schema::create('m_employees', function (Blueprint $table) {
            $table->id();
            $table->string('nik')->unique();
            $table->string('name');
            
            // Relasi Master Data
            $table->unsignedBigInteger('ccow_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('jabatan_id')->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Foreign Keys
            $table->foreign('ccow_id')->references('id')->on('m_ccows')->onDelete('set null');
            $table->foreign('company_id')->references('id')->on('m_company')->onDelete('set null');
            $table->foreign('department_id')->references('id')->on('m_department')->onDelete('set null');
            $table->foreign('jabatan_id')->references('id')->on('m_jabatan')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_employees');
    }
};
