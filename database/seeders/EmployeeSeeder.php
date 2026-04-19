<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterData\Employee;
use App\Models\MasterData\Ccow;
use App\Models\MasterData\Company;
use App\Models\MasterData\Department;
use App\Models\MasterData\Jabatan;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $ccow = Ccow::first();
        $company = Company::first();
        $dept = Department::first();
        $jabatan = Jabatan::first();

        $employees = [
            [
                'nik' => '12345678',
                'name' => 'Agung Prasetyo',
                'ccow_id' => $ccow->id ?? null,
                'company_id' => $company->id ?? null,
                'department_id' => $dept->id ?? null,
                'jabatan_id' => $jabatan->id ?? null,
            ],
            [
                'nik' => '87654321',
                'name' => 'Bambang Hermawan',
                'ccow_id' => $ccow->id ?? null,
                'company_id' => $company->id ?? null,
                'department_id' => $dept->id ?? null,
                'jabatan_id' => $jabatan->id ?? null,
            ],
            [
                'nik' => '11223344',
                'name' => 'Siti Aminah',
                'ccow_id' => $ccow->id ?? null,
                'company_id' => $company->id ?? null,
                'department_id' => $dept->id ?? null,
                'jabatan_id' => $jabatan->id ?? null,
            ],
        ];

        foreach ($employees as $emp) {
            Employee::updateOrCreate(['nik' => $emp['nik']], $emp);
        }
    }
}
