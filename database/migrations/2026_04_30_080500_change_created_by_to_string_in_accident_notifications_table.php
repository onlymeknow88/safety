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
        Schema::table('accident_notifications', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['created_by']);
        });

        Schema::table('accident_notifications', function (Blueprint $table) {
            // Change column type to string
            $table->string('created_by')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable()->change();
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }
};
