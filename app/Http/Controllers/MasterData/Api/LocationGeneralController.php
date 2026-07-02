<?php

namespace App\Http\Controllers\MasterData\Api;

use App\Helpers\SafetyResponse;
use App\Http\Controllers\Controller;
use App\Models\MasterData\LocationGeneral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LocationGeneralController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 50;
        $query = LocationGeneral::query();
        if ($search) $query->where('name', 'like', "%$search%");
        $paginateData = $query->orderBy('name', 'asc')->paginate($load);
        return SafetyResponse::success($paginateData, "Berhasil mengambil data");
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ['name' => 'required|string|max:255', 'is_active' => 'boolean']);
        if ($validator->fails()) return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        $data = LocationGeneral::create($request->all());
        return SafetyResponse::success($data, 'Berhasil menambahkan data');
    }

    public function show($id)
    {
        $data = LocationGeneral::find($id);
        if (!$data) return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        return SafetyResponse::success($data, 'Berhasil mengambil detail data');
    }

    public function update(Request $request, $id)
    {
        $data = LocationGeneral::find($id);
        if (!$data) return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        $validator = Validator::make($request->all(), ['name' => 'required|string|max:255', 'is_active' => 'boolean']);
        if ($validator->fails()) return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        $data->update($request->all());
        return SafetyResponse::success($data, 'Berhasil memperbarui data');
    }

    public function destroy($id)
    {
        $data = LocationGeneral::find($id);
        if (!$data) return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        $data->delete();
        return SafetyResponse::success(null, 'Berhasil menghapus data');
    }
}
