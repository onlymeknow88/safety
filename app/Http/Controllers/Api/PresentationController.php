<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Helpers\SafetyResponse;
use App\Models\Presentation;
use Illuminate\Support\Facades\Validator;

class PresentationController extends Controller
{
    /**
     * GET /api/presentation
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $load = $request->load ?? 10;
        
        $query = Presentation::with([
            'investigationReport.accidentNotification.ccow',
            'investigationReport.accidentNotification.company',
            'investigationReport.accidentNotification.location',
            'investigationReport.accidentNotification.incidentType',
            'editedBy'
        ])
        ->when($search, function ($q) use ($search) {
            $q->whereHas('investigationReport', function ($sq) use ($search) {
                $sq->where('report_number', 'like', "%$search%")
                   ->orWhereHas('accidentNotification', function ($sq2) use ($search) {
                       $sq2->where('notification_number', 'like', "%$search%")
                          ->orWhere('accident_number', 'like', "%$search%");
                   });
            });
        });

        $data = $query->latest()->paginate($load);

        return SafetyResponse::success($data, 'Berhasil mengambil data Jadwal Presentasi');
    }

    /**
     * PUT/PATCH /api/presentation/{id}
     */
    public function update(Request $request, string $id)
    {
        $presentation = Presentation::find($id);

        if (!$presentation) {
            return SafetyResponse::error(null, 'Jadwal presentasi tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'actual_date' => 'required|date',
            'status' => 'required|in:Scheduled,Completed,Revised',
        ]);

        if ($validator->fails()) {
            return SafetyResponse::error($validator->errors(), 'Validasi Gagal', 422);
        }

        $user = auth('api')->user();

        $presentation->update([
            'actual_date' => $request->actual_date,
            'status' => $request->status,
            'edited_by' => $user->id ?? null,
        ]);

        return SafetyResponse::success(
            $presentation->load('editedBy'),
            'Berhasil memperbarui jadwal presentasi'
        );
    }
}
