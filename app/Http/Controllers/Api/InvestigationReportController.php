<?php

namespace App\Http\Controllers\Api;

use App\Helpers\SafetyResponse;
use App\Http\Controllers\Controller;
use App\Models\InvestigationReport;
use App\Models\InvestigationDocument;
use App\Models\InvestigationApproval;
use App\Models\AccidentNotification;
use App\Models\MasterData\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class InvestigationReportController extends Controller
{
    /**
     * GET /api/investigation-report
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 10;
        $user = auth('api')->user();

        // Check if user is CRS, admin, super-admin, or approver
        $isCrs = $user && (
            $user->hasRole('crs', 'CRS', 'superadmin', 'super-admin', 'admin') ||
            ($user->employee && $user->employee->can_approve)
        );

        $query = InvestigationReport::with([
            'accidentNotification.ccow',
            'accidentNotification.company',
            'accidentNotification.location',
            'accidentNotification.incidentType',
            'documents',
            'approvals.approvedBy'
        ])
        // Filter by company if not CRS
        ->when(!$isCrs && $user && $user->employee_id, function ($q) use ($user) {
            $q->whereHas('accidentNotification', function ($sq) use ($user) {
                $sq->where('company_id', $user->employee->company_id);
            });
        })
        // Search by report number or associated notification/accident number
        ->when($search, function ($q) use ($search) {
            $q->where('report_number', 'like', "%$search%")
              ->orWhereHas('accidentNotification', function ($sq) use ($search) {
                  $sq->where('accident_number', 'like', "%$search%")
                     ->orWhere('notification_number', 'like', "%$search%");
              });
        });

        $data = $query->latest()->paginate($load);

        return SafetyResponse::success($data, 'Berhasil mengambil data LPKS/LPKL');
    }

    /**
     * POST /api/investigation-report
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'accident_notification_id' => 'required|exists:accident_notifications,id|unique:investigation_reports,accident_notification_id',
            'report_type' => 'required|in:LPKS,LPKL',
            'is_environmental' => 'nullable|boolean',
            'investigation_detail' => 'nullable|string',
            'root_cause_analysis' => 'nullable|string',
            'corrective_action_plan' => 'nullable|array',
            'preventive_action' => 'nullable|string',
            'safe_draft' => 'nullable|boolean',
            'documents' => 'nullable|array|max:10',
            'documents.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx,ppt,pptx,xls,xlsx|max:5120', // Max 5MB per file
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        DB::beginTransaction();
        try {
            $user = auth('api')->user();

            $data = $request->except(['documents', 'corrective_action_plan']);
            $data['corrective_action_plan'] = $request->input('corrective_action_plan', []);
            $data['created_by'] = $user->name ?? 'System';
            $data['updated_by'] = $user->name ?? 'System';
            $data['is_environmental'] = $request->boolean('is_environmental');
            $data['safe_draft'] = $request->boolean('safe_draft', true);
            $data['current_approval_level'] = 'KTT'; // Default level approval dimulai dari KTT
            $data['investigation_status'] = $data['safe_draft'] ? 'Draft' : 'Waiting for KTT';

            $report = InvestigationReport::create($data);

            // Handle Document Uploads
            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $file) {
                    $path = $file->store('investigation-reports', 'public');
                    $report->documents()->create([
                        'path' => $path,
                        'filename' => $file->getClientOriginalName(),
                        'file_type' => $file->getClientOriginalExtension(),
                        'file_size' => $file->getSize(),
                        'created_by' => $user->name ?? 'System',
                    ]);
                }
            }

            // Inisialisasi approval log per level
            $levels = ['KTT', 'OHS_DH', 'PJA'];
            if ($report->is_environmental) {
                // Tambahkan ENV_DH jika conditional environmental true
                $levels = ['KTT', 'OHS_DH', 'ENV_DH', 'PJA'];
            }

            foreach ($levels as $level) {
                $report->approvals()->create([
                    'approval_level' => $level,
                    'tick_box' => false,
                    'status' => 'Pending',
                ]);
            }

            // Update status di accident_notifications jika ada
            $notification = AccidentNotification::find($report->accident_notification_id);
            if ($notification) {
                $notification->update([
                    'has_lpks_lpkl' => true,
                    'lpks_lpkl' => $report->report_type,
                ]);
            }

            DB::commit();

            return SafetyResponse::success(
                $report->load(['documents', 'approvals']),
                'Berhasil menyimpan Laporan Penyelidikan LPKS/LPKL',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing investigation report: ' . $e->getMessage());
            return SafetyResponse::error(null, 'Gagal menyimpan laporan: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/investigation-report/{id}
     */
    public function show(string $id)
    {
        $user = auth('api')->user();
        $isCrs = $user && (
            $user->hasRole('crs', 'CRS', 'superadmin', 'super-admin', 'admin') ||
            ($user->employee && $user->employee->can_approve)
        );

        $query = InvestigationReport::with([
            'accidentNotification.ccow',
            'accidentNotification.company',
            'accidentNotification.location',
            'accidentNotification.incidentType',
            'documents',
            'approvals.approvedBy'
        ]);

        // Filter detail if not CRS
        if (!$isCrs && $user && $user->employee_id) {
            $query->whereHas('accidentNotification', function ($sq) use ($user) {
                $sq->where('company_id', $user->employee->company_id);
            });
        }

        $report = $query->find($id);

        if (!$report) {
            return SafetyResponse::error(null, 'Laporan tidak ditemukan atau Anda tidak memiliki akses', 404);
        }

        return SafetyResponse::success($report, 'Berhasil mengambil detail Laporan Penyelidikan');
    }

    /**
     * PUT/PATCH /api/investigation-report/{id}
     */
    public function update(Request $request, string $id)
    {
        $report = InvestigationReport::find($id);

        if (!$report) {
            return SafetyResponse::error(null, 'Laporan tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'report_type' => 'required|in:LPKS,LPKL',
            'is_environmental' => 'nullable|boolean',
            'investigation_detail' => 'nullable|string',
            'root_cause_analysis' => 'nullable|string',
            'corrective_action_plan' => 'nullable|array',
            'preventive_action' => 'nullable|string',
            'safe_draft' => 'nullable|boolean',
            'documents' => 'nullable|array|max:10',
            'documents.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx,ppt,pptx,xls,xlsx|max:5120',
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        DB::beginTransaction();
        try {
            $user = auth('api')->user();

            $data = $request->except(['documents', 'existing_documents', 'corrective_action_plan']);
            if ($request->has('corrective_action_plan')) {
                $data['corrective_action_plan'] = $request->input('corrective_action_plan', []);
            }
            if ($request->has('is_environmental')) {
                $data['is_environmental'] = $request->boolean('is_environmental');
            }
            if ($request->has('safe_draft')) {
                $data['safe_draft'] = $request->boolean('safe_draft');
                if (!$data['safe_draft'] && $report->investigation_status === 'Draft') {
                    $data['investigation_status'] = 'Waiting for KTT';
                }
            }

            $data['updated_by'] = $user->name ?? 'System';
            $report->update($data);

            // Handle Document Deletions
            $existingDocIds = $request->input('existing_documents', []);
            $docsToDelete = $report->documents()->whereNotIn('id', $existingDocIds)->get();

            foreach ($docsToDelete as $doc) {
                Storage::disk('public')->delete($doc->path);
                $doc->delete();
            }

            // Handle new Document uploads
            if ($request->hasFile('documents')) {
                $currentCount = $report->documents()->count();
                $newFiles = $request->file('documents');

                foreach ($newFiles as $file) {
                    if ($currentCount >= 10) {
                        break;
                    }
                    $path = $file->store('investigation-reports', 'public');
                    $report->documents()->create([
                        'path' => $path,
                        'filename' => $file->getClientOriginalName(),
                        'file_type' => $file->getClientOriginalExtension(),
                        'file_size' => $file->getSize(),
                        'created_by' => $user->name ?? 'System',
                    ]);
                    $currentCount++;
                }
            }

            // Update ENV_DH approval log dynamically if is_environmental value changed
            if ($report->is_environmental) {
                $envApprovalExists = $report->approvals()->where('approval_level', 'ENV_DH')->exists();
                if (!$envApprovalExists) {
                    $report->approvals()->create([
                        'approval_level' => 'ENV_DH',
                        'tick_box' => false,
                        'status' => 'Pending',
                    ]);
                }
            } else {
                $report->approvals()->where('approval_level', 'ENV_DH')->delete();
            }

            // Update status di accident_notifications
            $notification = AccidentNotification::find($report->accident_notification_id);
            if ($notification) {
                $notification->update([
                    'lpks_lpkl' => $report->report_type,
                ]);
            }

            DB::commit();

            return SafetyResponse::success(
                $report->load(['documents', 'approvals']),
                'Berhasil memperbarui Laporan Penyelidikan LPKS/LPKL'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating investigation report: ' . $e->getMessage());
            return SafetyResponse::error(null, 'Gagal memperbarui laporan: ' . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/investigation-report/{id}
     */
    public function destroy(string $id)
    {
        $report = InvestigationReport::find($id);

        if (!$report) {
            return SafetyResponse::error(null, 'Laporan tidak ditemukan', 404);
        }

        DB::beginTransaction();
        try {
            // Hapus file dokumen dari storage
            foreach ($report->documents as $doc) {
                Storage::disk('public')->delete($doc->path);
            }

            // Reset status has_lpks_lpkl di accident_notifications
            $notification = AccidentNotification::find($report->accident_notification_id);
            if ($notification) {
                $notification->update([
                    'has_lpks_lpkl' => false,
                ]);
            }

            $report->delete();

            DB::commit();
            return SafetyResponse::success(null, 'Berhasil menghapus Laporan Penyelidikan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting investigation report: ' . $e->getMessage());
            return SafetyResponse::error(null, 'Gagal menghapus laporan: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/investigation-report/{id}/approve
     */
    public function approve(Request $request, string $id)
    {
        $report = InvestigationReport::with('approvals')->find($id);

        if (!$report) {
            return SafetyResponse::error(null, 'Laporan tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'approval_level' => 'required|in:KTT,OHS_DH,ENV_DH,PJA',
            'comment' => 'nullable|string',
            'tick_box' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $level = $request->input('approval_level');
        $user = auth('api')->user();

        // Get approval record for specific level
        $approval = $report->approvals()->where('approval_level', $level)->first();

        if (!$approval) {
            return SafetyResponse::error(null, "Alur approval level {$level} tidak ditemukan", 404);
        }

        DB::beginTransaction();
        try {
            $approval->update([
                'approved_by' => $user->id,
                'comment' => $request->input('comment'),
                'tick_box' => $request->boolean('tick_box'),
                'status' => 'Approved',
                'approved_at' => now(),
            ]);

            // Set approved boolean di parent report
            $column = strtolower($level) . '_approved';
            // environment is env_approved instead of env_dh_approved
            if ($level === 'ENV_DH') {
                $column = 'env_approved';
            } elseif ($level === 'OHS_DH') {
                $column = 'ohs_approved';
            }

            $report->update([
                $column => true,
                'updated_by' => $user->name ?? 'System',
            ]);

            // Tentukan level approval berikutnya
            $nextLevel = null;
            if ($level === 'KTT') {
                $nextLevel = 'OHS_DH';
            } elseif ($level === 'OHS_DH') {
                $nextLevel = $report->is_environmental ? 'ENV_DH' : 'PJA';
            } elseif ($level === 'ENV_DH') {
                $nextLevel = 'PJA';
            } elseif ($level === 'PJA') {
                $nextLevel = 'COMPLETED';
            }

            $updateData = [];
            if ($nextLevel === 'COMPLETED') {
                $updateData['current_approval_level'] = 'COMPLETED';
                $updateData['investigation_status'] = 'Completed';
            } else {
                $updateData['current_approval_level'] = $nextLevel;
                $updateData['investigation_status'] = "Waiting for {$nextLevel}";
            }

            $report->update($updateData);

            DB::commit();
            return SafetyResponse::success($report->load('approvals'), "Berhasil menyetujui Laporan pada level {$level}");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error approving investigation report: ' . $e->getMessage());
            return SafetyResponse::error(null, 'Gagal memproses approval: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/investigation-report/{id}/return
     */
    public function return(Request $request, string $id)
    {
        $report = InvestigationReport::with('approvals')->find($id);

        if (!$report) {
            return SafetyResponse::error(null, 'Laporan tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'approval_level' => 'required|in:KTT,OHS_DH,ENV_DH,PJA',
            'comment' => 'required|string', // Comment wajib saat return
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $level = $request->input('approval_level');
        $user = auth('api')->user();

        $approval = $report->approvals()->where('approval_level', $level)->first();

        if (!$approval) {
            return SafetyResponse::error(null, "Alur approval level {$level} tidak ditemukan", 404);
        }

        DB::beginTransaction();
        try {
            $approval->update([
                'approved_by' => $user->id,
                'comment' => $request->input('comment'),
                'tick_box' => false,
                'status' => 'Returned',
                'approved_at' => now(),
            ]);

            // Set approved boolean di parent report
            $column = strtolower($level) . '_approved';
            if ($level === 'ENV_DH') {
                $column = 'env_approved';
            } elseif ($level === 'OHS_DH') {
                $column = 'ohs_approved';
            }

            // Kembalikan ke level sebelumnya
            $prevLevel = 'KTT'; // Default return ke KTT
            if ($level === 'PJA') {
                $prevLevel = $report->is_environmental ? 'ENV_DH' : 'OHS_DH';
            } elseif ($level === 'ENV_DH') {
                $prevLevel = 'OHS_DH';
            }

            $report->update([
                $column => false,
                'current_approval_level' => $prevLevel,
                'investigation_status' => 'Returned',
                'updated_by' => $user->name ?? 'System',
            ]);

            // Reset status approvals yang dikembalikan
            $report->approvals()->where('approval_level', $prevLevel)->update([
                'status' => 'Pending',
                'tick_box' => false,
                'approved_by' => null,
            ]);

            $prevColumn = strtolower($prevLevel) . '_approved';
            if ($prevLevel === 'ENV_DH') {
                $prevColumn = 'env_approved';
            } elseif ($prevLevel === 'OHS_DH') {
                $prevColumn = 'ohs_approved';
            }
            $report->update([$prevColumn => false]);

            DB::commit();
            return SafetyResponse::success($report->load('approvals'), "Laporan berhasil dikembalikan dari level {$level} ke {$prevLevel}");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error returning investigation report: ' . $e->getMessage());
            return SafetyResponse::error(null, 'Gagal memproses return: ' . $e->getMessage(), 500);
        }
    }
}
