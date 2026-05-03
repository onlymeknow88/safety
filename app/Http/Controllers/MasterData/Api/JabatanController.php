<?php

namespace App\Http\Controllers\MasterData\Api;

use App\Helpers\SafetyResponse;
use App\Http\Controllers\Controller;
use App\Models\MasterData\Jabatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JabatanController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $search = $request->search;
        $load = $request->load ?? 10;

        $query = Jabatan::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            });
        }

        $paginateData = $query->orderBy('name', 'asc')->paginate($load);

        return SafetyResponse::success($paginateData, "Berhasil mengambil data");
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
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data = Jabatan::create($request->all());

        return SafetyResponse::success($data, 'Berhasil menambahkan data');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Jabatan::find($id);
        if (!$data) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }
        return SafetyResponse::success($data, 'Berhasil mengambil detail data');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = Jabatan::find($id);
        if (!$data) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data->update($request->all());

        return SafetyResponse::success($data, 'Berhasil memperbarui data');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = Jabatan::find($id);
        if (!$data) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        $data->delete();

        return SafetyResponse::success(null, 'Berhasil menghapus data');
    }
}
