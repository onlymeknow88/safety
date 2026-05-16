<?php

namespace App\Http\Controllers\Admin\Api;

use App\Helpers\SafetyResponse;
use App\Http\Controllers\Controller;
use App\Models\EmailGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class EmailGroupController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 10;

        $query = EmailGroup::with('recipients');

        if ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
        }

        $paginateData = $query->latest()->paginate($load);

        return SafetyResponse::success($paginateData, "Berhasil mengambil data");
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'recipients' => 'required|array',
            'recipients.*.email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $group = EmailGroup::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        foreach ($request->recipients as $recipient) {
            $group->recipients()->create([
                'email' => $recipient['email'],
                'name' => $recipient['name'] ?? null,
            ]);
        }

        return SafetyResponse::success($group->load('recipients'), 'Berhasil menambahkan grup email');
    }

    public function show(string $id)
    {
        $group = EmailGroup::with('recipients')->find($id);
        if (!$group) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }
        return SafetyResponse::success($group, 'Berhasil mengambil detail data');
    }

    public function update(Request $request, string $id)
    {
        $group = EmailGroup::find($id);
        if (!$group) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'recipients' => 'required|array',
            'recipients.*.email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $group->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        $group->recipients()->delete();
        foreach ($request->recipients as $recipient) {
            $group->recipients()->create([
                'email' => $recipient['email'],
                'name' => $recipient['name'] ?? null,
            ]);
        }

        return SafetyResponse::success($group->load('recipients'), 'Berhasil memperbarui grup email');
    }

    public function destroy(string $id)
    {
        $group = EmailGroup::find($id);
        if (!$group) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        $group->delete();

        return SafetyResponse::success(null, 'Berhasil menghapus grup email');
    }
}
