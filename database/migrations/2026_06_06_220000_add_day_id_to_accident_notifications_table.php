<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->foreignId('day_id')->nullable()->after('incident_date')->constrained('m_days')->nullOnDelete();
        });

        // Map existing incident_date to day_id
        $records = DB::table('accident_notifications')->whereNotNull('incident_date')->get();
        $daysMap = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu'
        ];

        foreach ($records as $record) {
            $dayOfWeek = Carbon::parse($record->incident_date)->dayOfWeek;
            $dayName = $daysMap[$dayOfWeek];
            $dayId = DB::table('m_days')->where('name', $dayName)->value('id');
            if ($dayId) {
                DB::table('accident_notifications')->where('id', $record->id)->update([
                    'day_id' => $dayId
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->dropForeign(['day_id']);
            $table->dropColumn('day_id');
        });
    }
};
