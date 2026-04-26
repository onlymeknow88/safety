<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Pastikan status "Draft" dan "Submitted" ada di m_statuses
        $statuses = ['Draft', 'Submitted'];
        foreach ($statuses as $name) {
            DB::table('m_statuses')->updateOrInsert(
                ['name' => $name],
                ['is_active' => true, 'created_at' => now(), 'updated_at' => now()]
            );
        }

        Schema::table('accident_notifications', function (Blueprint $table) {
            // 2. Tambah kolom status_id
            $table->foreignId('status_id')->nullable()->after('approver_position')->constrained('m_statuses');
        });

        // 3. Migrasi data lama jika ada
        $draftId = DB::table('m_statuses')->where('name', 'Draft')->value('id');
        $submittedId = DB::table('m_statuses')->where('name', 'Submitted')->value('id');

        if ($draftId) {
            DB::table('accident_notifications')->where('status', 'draft')->update(['status_id' => $draftId]);
        }
        if ($submittedId) {
            DB::table('accident_notifications')->where('status', 'submitted')->update(['status_id' => $submittedId]);
        }

        Schema::table('accident_notifications', function (Blueprint $table) {
            // 4. Hapus kolom status lama
            $table->dropColumn('status');
        });
    }

    public function down(): void
    {
        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->enum('status', ['draft', 'submitted'])->default('draft')->after('approver_position');
        });

        // Kembalikan data
        $draftId = DB::table('m_statuses')->where('name', 'Draft')->value('id');
        $submittedId = DB::table('m_statuses')->where('name', 'Submitted')->value('id');

        if ($draftId) {
            DB::table('accident_notifications')->where('status_id', $draftId)->update(['status' => 'draft']);
        }
        if ($submittedId) {
            DB::table('accident_notifications')->where('status_id', $submittedId)->update(['status' => 'submitted']);
        }

        Schema::table('accident_notifications', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
            $table->dropColumn('status_id');
        });
    }
};
