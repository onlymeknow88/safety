<?php

namespace App\Http\Controllers\MasterData\Api;

use App\Helpers\SafetyResponse;
use App\Http\Controllers\Controller;
use App\Models\MasterData\MobileEquipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MobileEquipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 50;

        $query = MobileEquipment::query();

        if ($search) {
            $query->where('name', 'like', "%$search%");
        }

        $paginateData = $query->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate($load);

        return SafetyResponse::success($paginateData, "Berhasil mengambil data");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:m_mobile_equipments,name',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $mobileEquipment = MobileEquipment::create($request->all());

        return SafetyResponse::success($mobileEquipment, 'Berhasil menambahkan data Jenis Mobile Equipment');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $mobileEquipment = MobileEquipment::find($id);
        if (!$mobileEquipment) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }
        return SafetyResponse::success($mobileEquipment, 'Berhasil mengambil detail data');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $mobileEquipment = MobileEquipment::find($id);
        if (!$mobileEquipment) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:m_mobile_equipments,name,' . $id,
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $mobileEquipment->update($request->all());

        return SafetyResponse::success($mobileEquipment, 'Berhasil memperbarui data Jenis Mobile Equipment');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $mobileEquipment = MobileEquipment::find($id);
        if (!$mobileEquipment) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        $mobileEquipment->delete();

        return SafetyResponse::success(null, 'Berhasil menghapus data Jenis Mobile Equipment');
    }
}
