<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SafetyPerformance extends Model
{
    protected $table = 'safety_performances';

    protected $fillable = [
        'tahun',
        'bulan',
        'karyawan_amc',
        'karyawan_mitra',
        'manhour_amc',
        'manhour_mitra',
        'count_all_incident',
        'count_property_damage',
        'count_nearmiss',
        'count_fai',
        'count_mti',
        'count_kaptk',
        'count_pak',
        'count_cidera_ringan',
        'count_cidera_berat',
        'count_mati',
        'hari_hilang',
        'count_hpri',
        'count_non_hpri',
        'lingkungan_minor',
        'lingkungan_mayor',
        'lingkungan_kritikal',
        'actual_cost',
        'potential_cost',
        'last_synced_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'bulan' => 'integer',
        'karyawan_amc' => 'integer',
        'karyawan_mitra' => 'integer',
        'manhour_amc' => 'double',
        'manhour_mitra' => 'double',
        'count_all_incident' => 'integer',
        'count_property_damage' => 'integer',
        'count_nearmiss' => 'integer',
        'count_fai' => 'integer',
        'count_mti' => 'integer',
        'count_kaptk' => 'integer',
        'count_pak' => 'integer',
        'count_cidera_ringan' => 'integer',
        'count_cidera_berat' => 'integer',
        'count_mati' => 'integer',
        'hari_hilang' => 'integer',
        'count_hpri' => 'integer',
        'count_non_hpri' => 'integer',
        'lingkungan_minor' => 'integer',
        'lingkungan_mayor' => 'integer',
        'lingkungan_kritikal' => 'integer',
        'actual_cost' => 'double',
        'potential_cost' => 'double',
        'last_synced_at' => 'datetime',
    ];
}
