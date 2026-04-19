<?php

namespace App\Http\Controllers\MasterData\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\MasterData\IncidentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IncidentTypeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 10;
        $query = IncidentType::query();
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('category', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }
        $paginateData = $query->orderBy('category', 'asc')->paginate($load);
        return ResponseFormatter::success($paginateData, "Berhasil mengambil data");
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);
        if ($validator->fails()) return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        $data = IncidentType::create($request->all());
        return ResponseFormatter::success($data, 'Berhasil menambahkan data');
    }

    public function show($id)
    {
        $data = IncidentType::find($id);
        if (!$data) return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        return ResponseFormatter::success($data, 'Berhasil mengambil detail data');
    }

    public function update(Request $request, $id)
    {
        $data = IncidentType::find($id);
        if (!$data) return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        $validator = Validator::make($request->all(), [
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);
        if ($validator->fails()) return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        $data->update($request->all());
        return ResponseFormatter::success($data, 'Berhasil memperbarui data');
    }

    public function destroy($id)
    {
        $data = IncidentType::find($id);
        if (!$data) return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        $data->delete();
        return ResponseFormatter::success(null, 'Berhasil menghapus data');
    }
}
