<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Mail\AccidentNotificationApprovalMail;
use App\Models\AccidentNotification;
use App\Models\AccidentNotificationPhoto;
use App\Models\MasterData\Employee;
use App\Models\MasterData\Status;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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
        $load = $request->load ?? 10;

        $query = AccidentNotification::with(['photos', 'ccow', 'company', 'location', 'incidentType', 'status', 'department', 'victimGender', 'victimAgeInterval', 'victimPosition', 'victimExperience', 'companyContractor', 'reporter', 'approver'])
            ->when($search, fn ($q) => $q
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
        // Ambil status info untuk menentukan apakah ini draft atau submit
        $status = Status::find($request->status_id);
        $isDraft = $status && strtolower($status->name) === 'draft';

        $rules = [
            'incident_date' => $isDraft ? 'nullable|date' : 'required|date',
            'incident_time' => $isDraft ? 'nullable' : 'required',
            'ccow_id' => $isDraft ? 'nullable|exists:m_ccows,id' : 'required|exists:m_ccows,id',
            'location_id' => $isDraft ? 'nullable|exists:m_locations,id' : 'required|exists:m_locations,id',
            'location_detail' => 'nullable|string',
            'company_id' => $isDraft ? 'nullable|exists:m_company,id' : 'required|exists:m_company,id',
            'incident_type_id' => 'nullable|exists:m_incident_types,id',
            'is_hpri' => 'nullable|boolean',
            'actual_k3' => 'nullable|integer|max:5',
            'actual_kk' => 'nullable|integer|max:5',
            'actual_lh' => 'nullable|integer|max:5',
            'actual_ksl' => 'nullable|integer|max:5',
            'actual_pp' => 'nullable|integer|max:5',
            'potential_k3' => 'nullable|integer|max:5',
            'potential_kk' => 'nullable|integer|max:5',
            'potential_lh' => 'nullable|integer|max:5',
            'potential_ksl' => 'nullable|integer|max:5',
            'potential_pp' => 'nullable|integer|max:5',
            'chronology' => 'nullable|string',
            'consequence_human' => 'nullable|string',
            'consequence_tool' => 'nullable|string',
            'consequence_environment' => 'nullable|string',
            'department_id' => 'nullable|exists:m_department,id',
            'victim_gender_id' => 'nullable|exists:m_genders,id',
            'victim_age_interval_id' => 'nullable|exists:m_interval_ages,id',
            'victim_position_id' => 'nullable|exists:m_jabatan,id',
            'victim_experience_id' => 'nullable|exists:m_interval_experiences,id',
            'company_contractor_id' => 'nullable|exists:m_company,id',
            'reporter_name' => $isDraft ? 'nullable|string|max:255' : 'required|string|max:255',
            'reporter_position' => 'nullable|string|max:255',
            'approver_name' => $isDraft ? 'nullable|string|max:255' : 'required|string|max:255',
            'approver_position' => 'nullable|string|max:255',
            'reporter_id' => 'nullable|exists:m_employees,id',
            'approver_id' => 'nullable|exists:m_employees,id',
            'status_id' => 'required|exists:m_statuses,id',
            'photos' => 'nullable|array|max:3',
            'photos.*' => 'file|mimes:jpg,jpeg,png|max:2048',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return ResponseFormatter::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data = $request->except(['photos', 'incident_facts', 'corrective_actions']);
        $data['incident_facts'] = $request->input('incident_facts', []);
        $data['corrective_actions'] = $request->input('corrective_actions', []);
        $data['created_by'] = auth('api')->user()->name ?? 'System';
        $data['updated_by'] = auth('api')->user()->name ?? 'System';
        $data['is_hpri'] = $request->boolean('is_hpri');

        $record = AccidentNotification::create($data);

        // Simpan foto
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $path = $file->store('accident-notifications', 'public');
                $record->photos()->create([
                    'path' => $path,
                    'filename' => $file->getClientOriginalName(),
                ]);
            }
        }

        // Kirim email approval jika bukan draft
        if (! $isDraft) {
            try {
                // Cari Employee yang namanya sesuai dengan approver_name
                $approver = Employee::where('id', $record->approver_id)->first();
                $recipient = $approver ? $approver->email : config('mail.from.address');

                Mail::to($recipient)->send(new AccidentNotificationApprovalMail($record->load(['ccow', 'location', 'incidentType', 'reporter', 'approver'])));
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email approval: '.$e->getMessage());
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
        $record = AccidentNotification::with(['photos', 'location', 'ccow', 'company', 'incidentType', 'department', 'victimGender', 'victimAgeInterval', 'victimPosition', 'victimExperience', 'companyContractor', 'reporter', 'approver'])->find($id);

        if (! $record) {
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

        if (! $record) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }

        // Ambil status info untuk menentukan apakah ini draft atau submit
        $status = Status::find($request->status_id);
        $isDraft = $status && strtolower($status->name) === 'draft';

        $rules = [
            'incident_date' => $isDraft ? 'nullable|date' : 'required|date',
            'incident_time' => $isDraft ? 'nullable' : 'required',
            'ccow_id' => $isDraft ? 'nullable|exists:m_ccows,id' : 'required|exists:m_ccows,id',
            'location_id' => $isDraft ? 'nullable|exists:m_locations,id' : 'required|exists:m_locations,id',
            'location_detail' => 'nullable|string',
            'company_id' => $isDraft ? 'nullable|exists:m_company,id' : 'required|exists:m_company,id',
            'incident_type_id' => 'nullable|exists:m_incident_types,id',
            'is_hpri' => 'nullable|boolean',
            'actual_k3' => 'nullable|integer|max:5',
            'actual_kk' => 'nullable|integer|max:5',
            'actual_lh' => 'nullable|integer|max:5',
            'actual_ksl' => 'nullable|integer|max:5',
            'actual_pp' => 'nullable|integer|max:5',
            'potential_k3' => 'nullable|integer|max:5',
            'potential_kk' => 'nullable|integer|max:5',
            'potential_lh' => 'nullable|integer|max:5',
            'potential_ksl' => 'nullable|integer|max:5',
            'potential_pp' => 'nullable|integer|max:5',
            'chronology' => 'nullable|string',
            'consequence_human' => 'nullable|string',
            'consequence_tool' => 'nullable|string',
            'consequence_environment' => 'nullable|string',
            'department_id' => 'nullable|exists:m_department,id',
            'victim_gender_id' => 'nullable|exists:m_genders,id',
            'victim_age_interval_id' => 'nullable|exists:m_interval_ages,id',
            'victim_position_id' => 'nullable|exists:m_jabatan,id',
            'victim_experience_id' => 'nullable|exists:m_interval_experiences,id',
            'company_contractor_id' => 'nullable|exists:m_company,id',
            'reporter_name' => $isDraft ? 'nullable|string|max:255' : 'required|string|max:255',
            'reporter_position' => 'nullable|string|max:255',
            'approver_name' => $isDraft ? 'nullable|string|max:255' : 'required|string|max:255',
            'approver_position' => 'nullable|string|max:255',
            'reporter_id' => 'nullable|exists:m_employees,id',
            'approver_id' => 'nullable|exists:m_employees,id',
            'status_id' => 'required|exists:m_statuses,id',
            'photos' => 'nullable|array|max:3',
            'photos.*' => 'file|mimes:jpg,jpeg,png|max:2048',
        ];

        $validator = Validator::make($request->all(), $rules);

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
        if ($request->has('is_hpri')) {
            $data['is_hpri'] = $request->boolean('is_hpri');
        }

        $data['updated_by'] = auth('api')->user()->name ?? 'System';

        $record->update($data);

        // Tambah foto baru (tidak menghapus yang lama kecuali total > 3)
        if ($request->hasFile('photos')) {
            $existing = $record->photos()->count();
            $newFiles = $request->file('photos');

            foreach ($newFiles as $file) {
                if ($existing >= 3) {
                    break;
                }
                $path = $file->store('accident-notifications', 'public');
                $record->photos()->create([
                    'path' => $path,
                    'filename' => $file->getClientOriginalName(),
                ]);
                $existing++;
            }
        }

        // Kirim email approval jika bukan draft
        if (! $isDraft) {
            try {
                $approver = Employee::where('id', $record->approver_id)->first();
                $recipient = $approver ? $approver->email : config('mail.from.address');

                Mail::to($recipient)->send(new AccidentNotificationApprovalMail($record->load(['ccow', 'location', 'incidentType', 'reporter', 'approver'])));
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email approval (Update): '.$e->getMessage());
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

        if (! $record) {
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

        if (! $photo) {
            return ResponseFormatter::error(null, 'Foto tidak ditemukan', 404);
        }

        Storage::disk('public')->delete($photo->path);
        $photo->delete();

        return ResponseFormatter::success(null, 'Foto berhasil dihapus');
    }

    /**
     * GET /api/accident-notification/{id}/export-pdf
     */
    public function exportPdf(Request $request, string $id)
    {
        $record = AccidentNotification::with(['ccow', 'location', 'incidentType', 'company', 'photos', 'department', 'victimGender', 'victimAgeInterval', 'victimPosition', 'victimExperience', 'companyContractor', 'reporter', 'approver'])->find($id);

        if (! $record) {
            return ResponseFormatter::error(null, 'Data tidak ditemukan', 404);
        }

        $pdf = Pdf::loadView('pdf.accident_notification', compact('record'));

        // Atur ukuran kertas A4 landscape
        $pdf->setPaper('a4', 'landscape');

        $fileName = str_replace(['/', '\\'], '_', $record->accident_number);

        if ($request->query('preview')) {
            return $pdf->stream('Accident_Notification_'.$fileName.'.pdf');
        }

        return $pdf->download('Accident_Notification_'.$fileName.'.pdf');
    }
}
