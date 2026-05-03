<?php

namespace App\Http\Controllers\MasterData\Api;

use App\Helpers\SafetyResponse;
use App\Http\Controllers\Controller;
use App\Models\MasterData\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $load = $request->input('load', 10);

        $query = Location::with('ccow');

        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%")
                  ->orWhereHas('ccow', function($q) use ($search) {
                      $q->where('name', 'LIKE', "%{$search}%");
                  });
        }

        $data = $query->paginate($load);
        return SafetyResponse::success($data, 'Data Lokasi berhasil diambil');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ccow_id' => 'required|exists:m_ccows,id',
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data = Location::create($request->all());
        return SafetyResponse::success($data, 'Data Lokasi berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ccow_id' => 'required|exists:m_ccows,id',
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $item = Location::findOrFail($id);
        $item->update($request->all());
        return SafetyResponse::success($item, 'Data Lokasi berhasil diperbarui');
    }

    public function destroy($id)
    {
        $item = Location::findOrFail($id);
        $item->delete();
        return SafetyResponse::success(null, 'Data Lokasi berhasil dihapus');
    }
}
