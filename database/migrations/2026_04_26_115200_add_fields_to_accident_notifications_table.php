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
        // Matikan pengecekan FK sementara agar tidak error saat pembuatan kolom
        Schema::disableForeignKeyConstraints();

        Schema::table('accident_notifications', function (Blueprint $table) {
            // Tambahkan kolom nomor tambahan secara aman
            if (!Schema::hasColumn('accident_notifications', 'accident_number')) {
                $table->string('accident_number')->unique()->nullable()->after('notification_number');
            }

            // Relasi Master Data secara aman
            if (!Schema::hasColumn('accident_notifications', 'ccow_id')) {
                $table->unsignedBigInteger('ccow_id')->nullable()->after('accident_number');
                $table->foreign('ccow_id')->references('id')->on('m_ccows')->onDelete('set null');
            }

            if (!Schema::hasColumn('accident_notifications', 'company_id')) {
                $table->unsignedBigInteger('company_id')->nullable()->after('ccow_id');
                $table->foreign('company_id')->references('id')->on('m_company')->onDelete('set null');
            }

            if (!Schema::hasColumn('accident_notifications', 'location_id')) {
                $table->unsignedBigInteger('location_id')->nullable()->after('company_id');
                $table->foreign('location_id')->references('id')->on('m_location_details')->onDelete('set null');
            }

            if (!Schema::hasColumn('accident_notifications', 'incident_type_id')) {
                $table->unsignedBigInteger('incident_type_id')->nullable()->after('location_id');
                $table->foreign('incident_type_id')->references('id')->on('m_incident_types')->onDelete('set null');
            }

            // Tambahkan kolom unit
            if (!Schema::hasColumn('accident_notifications', 'unit')) {
                $table->string('unit')->nullable()->after('incident_time');
            }

            // Hapus kolom teks lama jika masih ada
            $oldColumns = ['ccow', 'location', 'company', 'incident_classification'];
            foreach ($oldColumns as $oldCol) {
                if (Schema::hasColumn('accident_notifications', $oldCol)) {
                    $table->dropColumn($oldCol);
                }
            }

            // Ubah nama kolom secara aman
            if (Schema::hasColumn('accident_notifications', 'consequence_equipment')) {
                $table->renameColumn('consequence_equipment', 'consequence_tool');
            }

            // Tambahkan kolom keparahan baru secara aman
            if (!Schema::hasColumn('accident_notifications', 'actual_ksl')) {
                $table->unsignedTinyInteger('actual_ksl')->nullable()->after('actual_lh');
            }
            if (!Schema::hasColumn('accident_notifications', 'actual_pp')) {
                $table->unsignedTinyInteger('actual_pp')->nullable()->after('actual_ksl');
            }
            if (!Schema::hasColumn('accident_notifications', 'potential_ksl')) {
                $table->unsignedTinyInteger('potential_ksl')->nullable()->after('potential_lh');
            }
            if (!Schema::hasColumn('accident_notifications', 'potential_pp')) {
                $table->unsignedTinyInteger('potential_pp')->nullable()->after('potential_ksl');
            }

            // Jadikan kolom keparahan lama nullable (opsional)
            $table->unsignedTinyInteger('actual_k3')->nullable()->default(null)->change();
            $table->unsignedTinyInteger('actual_kk')->nullable()->default(null)->change();
            $table->unsignedTinyInteger('actual_lh')->nullable()->default(null)->change();
            $table->unsignedTinyInteger('potential_k3')->nullable()->default(null)->change();
            $table->unsignedTinyInteger('potential_kk')->nullable()->default(null)->change();
            $table->unsignedTinyInteger('potential_lh')->nullable()->default(null)->change();
        });

        // Hidupkan kembali pengecekan FK
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::table('accident_notifications', function (Blueprint $table) {
            // Drop Foreign Keys secara aman
            if (Schema::hasColumn('accident_notifications', 'ccow_id')) $table->dropForeign(['ccow_id']);
            if (Schema::hasColumn('accident_notifications', 'company_id')) $table->dropForeign(['company_id']);
            if (Schema::hasColumn('accident_notifications', 'location_id')) $table->dropForeign(['location_id']);
            if (Schema::hasColumn('accident_notifications', 'incident_type_id')) $table->dropForeign(['incident_type_id']);

            // Drop Columns secara aman satu per satu
            $columnsToDrop = ['accident_number', 'ccow_id', 'company_id', 'location_id', 'incident_type_id', 'unit', 'actual_ksl', 'actual_pp', 'potential_ksl', 'potential_pp'];
            foreach ($columnsToDrop as $col) {
                if (Schema::hasColumn('accident_notifications', $col)) {
                    $table->dropColumn($col);
                }
            }

            // Kembalikan kolom teks lama jika belum ada
            if (!Schema::hasColumn('accident_notifications', 'ccow')) {
                $table->string('ccow')->nullable()->after('notification_number');
            }
            if (!Schema::hasColumn('accident_notifications', 'location')) {
                $table->string('location')->nullable()->after('incident_time');
            }
            if (!Schema::hasColumn('accident_notifications', 'company_contractor')) {
                $table->string('company_contractor')->nullable()->after('location');
            }
            if (!Schema::hasColumn('accident_notifications', 'incident_classification')) {
                $table->string('incident_classification')->nullable()->after('company_contractor');
            }

            if (Schema::hasColumn('accident_notifications', 'consequence_tool')) {
                $table->renameColumn('consequence_tool', 'consequence_equipment');
            }

            // Kembalikan default
            $table->unsignedTinyInteger('actual_k3')->default(1)->change();
            $table->unsignedTinyInteger('actual_kk')->default(1)->change();
            $table->unsignedTinyInteger('actual_lh')->default(1)->change();
            $table->unsignedTinyInteger('potential_k3')->default(1)->change();
            $table->unsignedTinyInteger('potential_kk')->default(1)->change();
            $table->unsignedTinyInteger('potential_lh')->default(1)->change();
        });
    }
};
