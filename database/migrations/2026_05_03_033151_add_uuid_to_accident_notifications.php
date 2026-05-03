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
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        // Fill existing records with UUIDs
        $records = DB::table('accident_notifications')->get();
        foreach ($records as $record) {
            DB::table('accident_notifications')
                ->where('id', $record->id)
                ->update(['uuid' => (string) \Illuminate\Support\Str::uuid()]);
        }
    }

    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
