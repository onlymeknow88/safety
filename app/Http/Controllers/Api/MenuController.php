<?php

namespace App\Http\Controllers\Api;

use App\Helpers\SafetyResponse;
use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 10;

        $query = Menu::query();

        if ($search) {
            // Jika mencari, kita tampilkan flat list agar semua hasil ketemu
            $query->where("name", "like", "%$search%")
                  ->with('parent');
            
            $paginatedData = $query->paginate($load);
        } else {
            // Jika tidak mencari, kita tampilkan dalam bentuk Tree (Hierarkis)
            // Hanya ambil menu utama, lalu load anak-anaknya
            $query->whereNull('parent_id')
                  ->with(['children' => function($q) {
                      $q->orderBy('order', 'asc')->with('children'); // Rekursif ke bawah jika ada sub-sub menu
                  }])
                  ->orderBy('order', 'asc');
            
            $paginatedData = $query->paginate($load);
        }

        return SafetyResponse::success($paginatedData, "Berhasil mengambil data");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "slug" => "required|string|max:255|unique:menus,slug",
            "icon" => "nullable|string|max:255",
            "url" => "nullable|string|max:255",
            "parent_id" => "nullable|integer|exists:menus,id",
            "order" => "required|integer",
            "is_active" => "required|boolean",
        ]);

        $menu = Menu::create($validated);

        return SafetyResponse::success($menu, "Menu berhasi ditambahkan");
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu)
    {
        return SafetyResponse::success($menu->load('parent'), "Data menu ditemukan");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "slug" => "required|string|max:255|unique:menus,slug,{$menu->id}",
            "icon" => "nullable|string|max:255",
            "url" => "nullable|string|max:255",
            "parent_id" => "nullable|integer|exists:menus,id",
            "order" => "required|integer",
            "is_active" => "required|boolean",
        ]);

        $data = $validated;
        if (empty($data['parent_id'])) {
            $data['parent_id'] = null;
        }

        $menu->update($data);

        return SafetyResponse::success($menu, "Menu berhasil diperbarui");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        // Optional: Check if has children
        if ($menu->children()->count() > 0) {
            return SafetyResponse::error("Tidak dapat menghapus menu yang memiliki sub-menu", 422);
        }

        $menu->delete();

        return SafetyResponse::success(null, "Menu berhasil dihapus");
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:menus,id',
            'items.*.order' => 'required|integer',
        ]);

        \DB::beginTransaction();
        try {
            foreach ($request->items as $item) {
                Menu::where('id', $item['id'])->update(['order' => $item['order']]);
            }
            \DB::commit();
            return SafetyResponse::success(null, "Urutan menu berhasil diperbarui");
        } catch (\Exception $e) {
            \DB::rollBack();
            return SafetyResponse::error("Gagal memperbarui urutan menu: " . $e->getMessage(), 500);
        }
    }
}
