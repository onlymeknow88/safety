<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\AccidentNotification;
use App\Models\AccidentNotificationPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AccidentNotificationController extends Controller
{
    /**
     * GET /api/accident-notification
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $load   = $request->load ?? 10;

        $query = AccidentNotification::with(['photos', 'ccow', 'company', 'location', 'incidentType', 'status'])
            ->when($search, fn($q) => $q
                ->where('accident_number', 'like', "%$search%")
                ->orWhere('notification_number', 'like', "%$search%")
            );

        $data = $query->latest()->paginate($load);

        return ResponseFormatter::success($data, 'Berhasil mengambil data');
    }

    /**
     * POST /api/accident-notification
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'incident_date'           => 'required|date',
            'incident_time'           => 'required',
            'ccow_id'                 => 'required|exists:m_ccows,id',
            'location_id'             => 'required|exists:m_locations,id',
            'company_id'              => 'required|exists:m_company,id',
            'incident_type_id'        => 'nullable|exists:m_incident_types,id',
            'actual_k3'               => 'nullable|integer|min:1|max:5',
            'actual_kk'               => 'nullable|integer|min:1|max:5',
            'actual_lh'               => 'nullable|integer|min:1|max:5',
            'actual_ksl'              => 'nullable|integer|min:1|max:5',
            'actual_pp'               => 'nullable|integer|min:1|max:5',
            'potential_k3'            => 'nullable|integer|min:1|max:5',
            'potential_kk'            => 'nullable|integer|min:1|max:5',
            'potential_lh'            => 'nullable|integer|min:1|max:5',
            'potential_ksl'           => 'nullable|integer|min:1|max:5',
            'potential_pp'            => 'nullable|integer|min:1|max:5',
            'chronology'              => 'nullable|string',
            'reporter_name'           => 'nullable|string|max:255',
            'reporter_position'       => 'nullable|string|max:255',
            'approver_name'           => 'nullable|string|max:255',
            'approver_position'       => 'nullable|string|max:255',
            'status_id'               => 'required|exists:m_statuses,id',
            'photos'                  => 'nullable|array|max:3',
            'photos.*'                => 'file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data = $request->except(['photos', 'incident_facts', 'corrective_actions']);
        $data['incident_facts']     = $request->input('incident_facts', []);
        $data['corrective_actions'] = $request->input('corrective_actions', []);
        $data['created_by']         = auth()->id();

        $record = AccidentNotification::create($data);

        // Simpan foto
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $path = $file->store('accident-notifications', 'public');
                $record->photos()->create([
                    'path'     => $path,
                    'filename' => $file->getClientOriginalName(),
                ]);
            }
        }

        return ResponseFormatter::success(
            $record->load('photos'),
            'Berhasil menyimpan data',
            201
        );
    }

    /**
     * GET /api/accident-notification/{id}
     */
    public function show(string $id)
    {
        $record = AccidentNotification::with('photos')->find($id);

        if (!$record) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }

        return ResponseFormatter::success($record, 'Berhasil mengambil detail data');
    }

    /**
     * PUT/PATCH /api/accident-notification/{id}
     */
    public function update(Request $request, string $id)
    {
        $record = AccidentNotification::find($id);

        if (!$record) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'incident_date'           => 'required|date',
            'incident_time'           => 'required',
            'ccow_id'                 => 'required|exists:m_ccows,id',
            'location_id'             => 'required|exists:m_locations,id',
            'company_id'              => 'required|exists:m_company,id',
            'incident_type_id'        => 'nullable|exists:m_incident_types,id',
            'actual_k3'               => 'nullable|integer|min:1|max:5',
            'actual_kk'               => 'nullable|integer|min:1|max:5',
            'actual_lh'               => 'nullable|integer|min:1|max:5',
            'actual_ksl'              => 'nullable|integer|min:1|max:5',
            'actual_pp'               => 'nullable|integer|min:1|max:5',
            'potential_k3'            => 'nullable|integer|min:1|max:5',
            'potential_kk'            => 'nullable|integer|min:1|max:5',
            'potential_lh'            => 'nullable|integer|min:1|max:5',
            'potential_ksl'           => 'nullable|integer|min:1|max:5',
            'potential_pp'            => 'nullable|integer|min:1|max:5',
            'chronology'              => 'nullable|string',
            'reporter_name'           => 'nullable|string|max:255',
            'reporter_position'       => 'nullable|string|max:255',
            'approver_name'           => 'nullable|string|max:255',
            'approver_position'       => 'nullable|string|max:255',
            'status_id'               => 'required|exists:m_statuses,id',
            'photos'                  => 'nullable|array|max:3',
            'photos.*'                => 'file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data = $request->except(['photos', 'incident_facts', 'corrective_actions']);
        if ($request->has('incident_facts')) {
            $data['incident_facts'] = $request->input('incident_facts', []);
        }
        if ($request->has('corrective_actions')) {
            $data['corrective_actions'] = $request->input('corrective_actions', []);
        }

        $record->update($data);

        // Tambah foto baru (tidak menghapus yang lama kecuali total > 3)
        if ($request->hasFile('photos')) {
            $existing = $record->photos()->count();
            $newFiles = $request->file('photos');

            foreach ($newFiles as $file) {
                if ($existing >= 3) break;
                $path = $file->store('accident-notifications', 'public');
                $record->photos()->create([
                    'path'     => $path,
                    'filename' => $file->getClientOriginalName(),
                ]);
                $existing++;
            }
        }

        return ResponseFormatter::success(
            $record->load('photos'),
            'Berhasil memperbarui data'
        );
    }

    /**
     * DELETE /api/accident-notification/{id}
     */
    public function destroy(string $id)
    {
        $record = AccidentNotification::find($id);

        if (!$record) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }

        // Hapus file foto dari storage
        foreach ($record->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }

        $record->delete();

        return ResponseFormatter::success(null, 'Berhasil menghapus data');
    }

    /**
     * DELETE /api/accident-notification/{id}/photos/{photoId}
     * Endpoint tambahan: hapus satu foto
     */
    public function destroyPhoto(string $id, string $photoId)
    {
        $photo = AccidentNotificationPhoto::where('accident_notification_id', $id)
                                          ->find($photoId);

        if (!$photo) {
            return ResponseFormatter::error(null, 'Foto tidak ditemukan', 404);
        }

        Storage::disk('public')->delete($photo->path);
        $photo->delete();

        return ResponseFormatter::success(null, 'Foto berhasil dihapus');
    }
}
