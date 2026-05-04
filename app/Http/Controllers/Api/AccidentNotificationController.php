<?php

namespace App\Http\Controllers\Api;

use App\Helpers\SafetyResponse;
use App\Http\Controllers\Controller;
use App\Mail\AccidentNotificationApprovalMail;
use App\Models\AccidentNotification;
use App\Models\AccidentNotificationPhoto;
use App\Models\MasterData\Employee;
use App\Models\MasterData\Status;
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
        $user = auth('api')->user();
        
        // Cek apakah user memiliki role CRS, superadmin, atau memiliki hak akses approval
        $isCrs = $user && (
            $user->hasRole('crs', 'CRS', 'superadmin', 'super-admin', 'admin') || 
            ($user->employee && $user->employee->can_approve)
        );

        $query = AccidentNotification::with(['photos', 'ccow', 'company', 'location', 'incidentType', 'status', 'department', 'victimGender', 'victimAgeInterval', 'victimPosition', 'victimExperience', 'companyContractor', 'reporter', 'approver', 'progressStatus'])
            // Filter berdasarkan company_id jika bukan CRS/Approver
            ->when(!$isCrs && $user && $user->employee_id, function($q) use ($user) {
                return $q->where('company_id', $user->employee->company_id);
            })
            ->when($search, fn ($q) => $q
                ->where(function($sq) use ($search) {
                    $sq->where('accident_number', 'like', "%$search%")
                       ->orWhere('notification_number', 'like', "%$search%");
                })
            );

        $data = $query->latest()->paginate($load);

        return SafetyResponse::success($data, 'Berhasil mengambil data');
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
            'photos' => 'nullable|array|max:4',
            'photos.*' => 'file|mimes:jpg,jpeg,png|max:2048',
            // Reporting Fields
            'lpks_lpkl' => 'nullable|string',
            'due_date' => 'nullable|date',
            'presentation_date' => 'nullable|date',
            'submit_date' => 'nullable|date',
            'progress_status_id' => 'nullable|exists:m_statuses,id',
            'presentation_invitation' => 'nullable|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data = $request->except(['photos', 'incident_facts', 'corrective_actions', 'report_status']);
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

                // Mail::to($recipient)->send(new AccidentNotificationApprovalMail($record->load(['ccow', 'location', 'incidentType', 'reporter', 'approver'])));
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email approval: '.$e->getMessage());
            }
        }

        return SafetyResponse::success(
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
        $user = auth('api')->user();
        $isCrs = $user && (
            $user->hasRole('crs', 'CRS', 'superadmin', 'super-admin', 'admin') || 
            ($user->employee && $user->employee->can_approve)
        );

        $query = AccidentNotification::with(['photos', 'location', 'ccow', 'company', 'incidentType', 'department', 'victimGender', 'victimAgeInterval', 'victimPosition', 'victimExperience', 'companyContractor', 'reporter', 'approver']);
        
        // Filter detail jika bukan CRS/Approver
        if (!$isCrs && $user && $user->employee_id) {
            $query->where('company_id', $user->employee->company_id);
        }

        $record = $query->find($id);

        if (! $record) {
            return SafetyResponse::error(null, 'Data tidak ditemukan atau Anda tidak memiliki akses', 404);
        }

        return SafetyResponse::success($record, 'Berhasil mengambil detail data');
    }

    /**
     * PUT/PATCH /api/accident-notification/{id}
     */
    public function update(Request $request, string $id)
    {
        $record = AccidentNotification::find($id);

        if (! $record) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
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
            'photos' => 'nullable|array|max:4',
            'photos.*' => 'file|mimes:jpg,jpeg,png|max:2048',
            // Reporting Fields
            'lpks_lpkl' => 'nullable|string',
            'due_date' => 'nullable|date',
            'presentation_date' => 'nullable|date',
            'submit_date' => 'nullable|date',
            'progress_status_id' => 'nullable|exists:m_statuses,id',
            'presentation_invitation' => 'nullable|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $data = $request->except(['photos', 'existing_photos', 'incident_facts', 'corrective_actions', 'report_status']);
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

        // Handle photo deletions
        $existingPhotoIds = $request->input('existing_photos', []);
        $photosToDelete = $record->photos()->whereNotIn('id', $existingPhotoIds)->get();

        foreach ($photosToDelete as $photo) {
            Storage::disk('public')->delete($photo->path);
            $photo->delete();
        }

        // Tambah foto baru
        if ($request->hasFile('photos')) {
            $currentCount = $record->photos()->count();
            $newFiles = $request->file('photos');

            foreach ($newFiles as $file) {
                if ($currentCount >= 4) {
                    break;
                }
                $path = $file->store('accident-notifications', 'public');
                $record->photos()->create([
                    'path' => $path,
                    'filename' => $file->getClientOriginalName(),
                ]);
                $currentCount++;
            }
        }

        // Kirim email approval jika bukan draft
        if (! $isDraft) {
            try {
                $approver = Employee::where('id', $record->approver_id)->first();
                $recipient = $approver ? $approver->email : config('mail.from.address');

                // Mail::to($recipient)->send(new AccidentNotificationApprovalMail($record->load(['ccow', 'location', 'incidentType', 'reporter', 'approver'])));
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email approval (Update): '.$e->getMessage());
            }
        }

        return SafetyResponse::success(
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
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        // Hapus file foto dari storage
        foreach ($record->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }

        $record->delete();

        return SafetyResponse::success(null, 'Berhasil menghapus data');
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
            return SafetyResponse::error(null, 'Foto tidak ditemukan', 404);
        }

        Storage::disk('public')->delete($photo->path);
        $photo->delete();

        return SafetyResponse::success(null, 'Foto berhasil dihapus');
    }

    /**
     * GET /api/accident-notification/{id}/export-pdf
     */
    public function exportPdf(Request $request, string $id)
    {
        $record = AccidentNotification::with(['ccow', 'location', 'incidentType', 'company', 'photos', 'department', 'victimGender', 'victimAgeInterval', 'victimPosition', 'victimExperience', 'companyContractor', 'reporter', 'approver'])->find($id);

        if (! $record) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
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

    public function approve(string $id)
    {
        $user = auth('api')->user();
        if (!$user->hasPermission('accident-notification.approval')) {
            return SafetyResponse::error(null, 'Anda tidak memiliki hak akses untuk menyetujui laporan ini.', 403);
        }

        $record = AccidentNotification::find($id);

        if (! $record) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        // Cari status 'Approved' (biasanya ID 7 sesuai request sebelumnya)
        $status = Status::where('name', 'like', '%approved%')->first();
        $statusId = $status ? $status->id : 7;

        $record->update([
            'status_id' => $statusId,
            'approval_comment' => null, // Clear comment when approved
            'updated_by' => $user->name ?? 'System',
        ]);

        return SafetyResponse::success($record->load('status'), 'Data berhasil disetujui');
    }

    /**
     * POST /api/accident-notification/{id}/return
     */
    public function return(Request $request, string $id)
    {
        $user = auth('api')->user();
        if (!$user->hasPermission('accident-notification.approval')) {
            return SafetyResponse::error(null, 'Anda tidak memiliki hak akses untuk mengembalikan laporan ini.', 403);
        }

        $record = AccidentNotification::find($id);

        if (! $record) {
            return SafetyResponse::error(null, 'Data tidak ditemukan', 404);
        }

        // Cari status 'Return' (biasanya ID 8)
        $status = Status::where('name', 'like', '%return%')->first();
        $statusId = $status ? $status->id : 8;

        $record->update([
            'status_id' => $statusId,
            'approval_comment' => $request->input('comment'),
            'updated_by' => $user->name ?? 'System',
        ]);

        return SafetyResponse::success($record->load('status'), 'Data dikembalikan untuk diperbaiki');
    }
}
