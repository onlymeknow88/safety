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
        Schema::create('safety_performances', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('tahun');
            $table->unsignedTinyInteger('bulan'); // 1-12

            // Snapshot data bulanan
            $table->unsignedInteger('karyawan_amc')->default(0);
            $table->unsignedInteger('karyawan_mitra')->default(0);

            $table->double('manhour_amc', 15, 2)->default(0);
            $table->double('manhour_mitra', 15, 2)->default(0);

            // Jumlah Insiden
            $table->unsignedInteger('count_all_incident')->default(0);
            $table->unsignedInteger('count_property_damage')->default(0);
            $table->unsignedInteger('count_nearmiss')->default(0);
            $table->unsignedInteger('count_fai')->default(0);
            $table->unsignedInteger('count_mti')->default(0);
            $table->unsignedInteger('count_kaptk')->default(0);
            $table->unsignedInteger('count_pak')->default(0);

            // Kecelakaan Tambang
            $table->unsignedInteger('count_cidera_ringan')->default(0);
            $table->unsignedInteger('count_cidera_berat')->default(0);
            $table->unsignedInteger('count_mati')->default(0);

            // Hari Hilang
            $table->unsignedInteger('hari_hilang')->default(0);

            // K3
            $table->unsignedInteger('count_hpri')->default(0);
            $table->unsignedInteger('count_non_hpri')->default(0);

            // Lingkungan
            $table->unsignedInteger('lingkungan_minor')->default(0);
            $table->unsignedInteger('lingkungan_mayor')->default(0);
            $table->unsignedInteger('lingkungan_kritikal')->default(0);

            // Biaya / Cost
            $table->decimal('actual_cost', 15, 2)->default(0);
            $table->decimal('potential_cost', 15, 2)->default(0);
            
            $table->timestamp('last_synced_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['tahun', 'bulan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('safety_performances');
    }
};
