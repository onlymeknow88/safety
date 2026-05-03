<?php

namespace App\Http\Controllers\MasterData\Api;

use App\Http\Controllers\Controller;
use App\Models\MasterData\Employee;
use App\Helpers\SafetyResponse;
use Illuminate\Http\Request;
use Exception;

class EmployeeController extends Controller
{
    /**
     * Search employees for autocomplete/select
     */
    public function search(Request $request)
    {
        try {
            $query = $request->get('q');
            $canApprove = $request->get('can_approve');
            
            $employees = Employee::with(['ccow', 'company', 'department', 'jabatan'])
                ->where('is_active', true)
                ->when($canApprove, function($q) {
                    $q->where('can_approve', true);
                })
                ->where(function($q) use ($query) {
                    $q->where('name', 'LIKE', "%{$query}%")
                      ->orWhere('nik', 'LIKE', "%{$query}%");
                })
                ->limit(10)
                ->get();

            return SafetyResponse::success($employees, 'Data karyawan berhasil diambil');
        } catch (Exception $e) {
            \Log::error("Employee Search Error: " . $e->getMessage());
            return SafetyResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $search = $request->get('search');
            $limit = $request->get('limit', 10);
            
            $query = Employee::with(['ccow', 'company', 'department', 'jabatan']);

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%$search%")
                      ->orWhere('nik', 'like', "%$search%")
                      ->orWhere('email', 'like', "%$search%");
                });
            }

            $employees = $query->latest()->paginate($limit);
                
            return SafetyResponse::success($employees, 'Daftar karyawan berhasil diambil');
        } catch (Exception $e) {
            return SafetyResponse::error(null, $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'nik' => 'required|unique:m_employees,nik',
            'name' => 'required|string|max:255',
            'company_id' => 'required|exists:m_company,id',
            'department_id' => 'required|exists:m_department,id',
            'jabatan_id' => 'required|exists:m_jabatan,id',
            'ccow_id' => 'nullable|exists:m_ccows,id',
            'email' => 'nullable|email|max:255',
            'can_approve' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        try {
            $employee = Employee::create($request->all());
            return SafetyResponse::success($employee, 'Karyawan berhasil ditambahkan');
        } catch (Exception $e) {
            return SafetyResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $employee = Employee::with(['ccow', 'company', 'department', 'jabatan'])->find($id);
            if (!$employee) {
                return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
            }
            return SafetyResponse::success($employee, 'Berhasil mengambil detail data');
        } catch (Exception $e) {
            return SafetyResponse::error(null, $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $employee = Employee::find($id);
        if (!$employee) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        $validator = \Validator::make($request->all(), [
            'nik' => 'required|unique:m_employees,nik,' . $id,
            'name' => 'required|string|max:255',
            'company_id' => 'required|exists:m_company,id',
            'department_id' => 'required|exists:m_department,id',
            'jabatan_id' => 'required|exists:m_jabatan,id',
            'ccow_id' => 'nullable|exists:m_ccows,id',
            'email' => 'nullable|email|max:255',
            'can_approve' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        try {
            $employee->update($request->all());
            return SafetyResponse::success($employee, 'Berhasil memperbarui data karyawan');
        } catch (Exception $e) {
            return SafetyResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $employee = Employee::find($id);
            if (!$employee) {
                return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
            }

            $employee->delete();
            return SafetyResponse::success(null, 'Berhasil menghapus data karyawan');
        } catch (Exception $e) {
            return SafetyResponse::error(null, $e->getMessage(), 500);
        }
    }
}
