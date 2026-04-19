<?php

namespace App\Http\Controllers\MasterData\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\MasterData\Ccow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CcowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 10;

        $query = Ccow::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('inisial', 'like', "%$search%");
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
            'inisial' => 'nullable|string|max:50',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $ccow = Ccow::create($request->all());

        return ResponseFormatter::success($ccow, 'Berhasil menambahkan data CCOW');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ccow = Ccow::find($id);
        if (!$ccow) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }
        return ResponseFormatter::success($ccow, 'Berhasil mengambil detail data');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ccow = Ccow::find($id);
        if (!$ccow) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'inisial' => 'nullable|string|max:50',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $ccow->update($request->all());

        return ResponseFormatter::success($ccow, 'Berhasil memperbarui data CCOW');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ccow = Ccow::find($id);
        if (!$ccow) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }

        $ccow->delete();

        return ResponseFormatter::success(null, 'Berhasil menghapus data CCOW');
    }
}
