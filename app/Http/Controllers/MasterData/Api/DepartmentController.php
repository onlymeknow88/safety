<?php

namespace App\Http\Controllers\MasterData\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\MasterData\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $search = $request->search;
        $load = $request->load ?? 10;

        $query = Department::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            });
        }

        $paginateData = $query->orderBy('name', 'asc')->paginate($load);

        return ResponseFormatter::success($paginateData, "Berhasil mengambil data");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data = Department::create($request->all());

        return ResponseFormatter::success($data, 'Berhasil menambahkan data');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Department::find($id);
        if (!$data) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }
        return ResponseFormatter::success($data, 'Berhasil mengambil detail data');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = Department::find($id);
        if (!$data) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data->update($request->all());

        return ResponseFormatter::success($data, 'Berhasil memperbarui data');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = Department::find($id);
        if (!$data) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }

        $data->delete();

        return ResponseFormatter::success(null, 'Berhasil menghapus data');
    }
}
