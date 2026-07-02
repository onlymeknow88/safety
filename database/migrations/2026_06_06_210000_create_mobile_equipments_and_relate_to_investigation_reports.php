<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('m_mobile_equipments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Insert initial seed data here so we can map existing rows correctly
        $now = now();
        $initialEquipments = [
            'Manusia',
            'Bachoe Loader',
            'Compactor',
            'Crane Truck (Hiab)',
            'Dozer',
            'Drilling',
            'Dump Truck/Trailer/Truck',
            'Excavator',
            'Fire Truck',
            'Forklift/Tyre Handler/Manitou',
            'Grader',
            'Haul Truck',
            'Light Vehicle',
            'Loader',
            'LowBoy/Trailer',
            'Others',
            'Passangers Bus/Manhaul',
            'Service Truck/Fuel Truck',
            'Shovel',
            'Water Truck'
        ];

        foreach ($initialEquipments as $index => $name) {
            DB::table('m_mobile_equipments')->insertOrIgnore([
                'name' => $name,
                'is_active' => true,
                'sort_order' => ($index + 1) * 10,
                'created_at' => $now,
                'updated_at' => $now
            ]);
        }

        Schema::table('analisa_kecelakaan', function (Blueprint $table) {
            $table->foreignId('mobile_equipment_id')->nullable()->after('source_id')->constrained('m_mobile_equipments')->nullOnDelete();
        });

        // Migrate existing string data to foreign key
        $records = DB::table('analisa_kecelakaan')->whereNotNull('mobile_equipment')->get();
        foreach ($records as $record) {
            $equipmentName = trim($record->mobile_equipment);
            if ($equipmentName !== '') {
                $mappedName = 'Others';
                if (stripos($equipmentName, 'DT') !== false) {
                    $mappedName = 'Dump Truck/Trailer/Truck';
                } elseif (stripos($equipmentName, 'LV') !== false) {
                    $mappedName = 'Light Vehicle';
                } elseif (stripos($equipmentName, 'PC') !== false) {
                    $mappedName = 'Excavator';
                } else {
                    $match = DB::table('m_mobile_equipments')->where('name', 'like', $equipmentName)->first();
                    if ($match) {
                        $mappedName = $match->name;
                    }
                }

                $id = DB::table('m_mobile_equipments')->where('name', $mappedName)->value('id');
                if ($id) {
                    DB::table('analisa_kecelakaan')->where('id', $record->id)->update([
                        'mobile_equipment_id' => $id
                    ]);
                }
            }
        }

        // Drop the old column
        Schema::table('analisa_kecelakaan', function (Blueprint $table) {
            $table->dropColumn('mobile_equipment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('analisa_kecelakaan', function (Blueprint $table) {
            $table->string('mobile_equipment')->nullable()->after('mobile_equipment_id');
        });

        // Restore string values from relations
        $records = DB::table('analisa_kecelakaan')
            ->join('m_mobile_equipments', 'analisa_kecelakaan.mobile_equipment_id', '=', 'm_mobile_equipments.id')
            ->select('analisa_kecelakaan.id', 'm_mobile_equipments.name')
            ->get();

        foreach ($records as $record) {
            DB::table('analisa_kecelakaan')->where('id', $record->id)->update([
                'mobile_equipment' => $record->name
            ]);
        }

        Schema::table('analisa_kecelakaan', function (Blueprint $table) {
            $table->dropForeign(['mobile_equipment_id']);
            $table->dropColumn('mobile_equipment_id');
        });

        Schema::dropIfExists('m_mobile_equipments');
    }
};
