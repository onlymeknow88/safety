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
        Schema::table('m_days', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('is_active');
        });

        Schema::table('m_shifts', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('is_active');
        });

        Schema::table('m_rosters', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('is_active');
        });

        Schema::table('m_interval_times', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('m_days', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        Schema::table('m_shifts', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        Schema::table('m_rosters', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        Schema::table('m_interval_times', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};
