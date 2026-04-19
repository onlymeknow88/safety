<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop old tables
        Schema::dropIfExists('m_location_details');
        Schema::dropIfExists('m_location_generals');

        // Create new consolidated location table
        Schema::create('m_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ccow_id')->constrained('m_ccows')->onDelete('cascade');
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('m_locations');
    }
};
