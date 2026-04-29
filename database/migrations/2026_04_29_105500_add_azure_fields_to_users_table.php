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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'azure_id')) {
                $table->string('azure_id')->nullable()->unique()->after('id');
            }
            if (!Schema::hasColumn('users', 'azure_token')) {
                $table->text('azure_token')->nullable()->after('password');
            }
            if (!Schema::hasColumn('users', 'azure_refresh_token')) {
                $table->text('azure_refresh_token')->nullable()->after('azure_token');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['azure_id', 'azure_token', 'azure_refresh_token']);
        });
    }
};
