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
        Schema::table('m_employees', function (Blueprint $table) {
            $table->string('email')->nullable()->after('name');
            $table->boolean('can_approve')->default(false)->after('jabatan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('m_employees', function (Blueprint $table) {
            $table->dropColumn(['email', 'can_approve']);
        });
    }
};
