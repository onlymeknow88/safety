<?php

namespace App\Http\Controllers\MasterData\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\MasterData\Gender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GenderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 10;
        $query = Gender::query();
        if ($search) $query->where('name', 'like', "%$search%");
        $paginateData = $query->orderBy('name', 'asc')->paginate($load);
        return ResponseFormatter::success($paginateData, "Berhasil mengambil data");
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ['name' => 'required|string|max:255', 'is_active' => 'boolean']);
        if ($validator->fails()) return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        $data = Gender::create($request->all());
        return ResponseFormatter::success($data, 'Berhasil menambahkan data');
    }

    public function show($id)
    {
        $data = Gender::find($id);
        if (!$data) return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        return ResponseFormatter::success($data, 'Berhasil mengambil detail data');
    }

    public function update(Request $request, $id)
    {
        $data = Gender::find($id);
        if (!$data) return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        $validator = Validator::make($request->all(), ['name' => 'required|string|max:255', 'is_active' => 'boolean']);
        if ($validator->fails()) return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        $data->update($request->all());
        return ResponseFormatter::success($data, 'Berhasil memperbarui data');
    }

    public function destroy($id)
    {
        $data = Gender::find($id);
        if (!$data) return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        $data->delete();
        return ResponseFormatter::success(null, 'Berhasil menghapus data');
    }
}
