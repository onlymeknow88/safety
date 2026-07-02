<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PicaItem;
use App\Models\InvestigationApproval;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PicaItemController extends Controller
{
    public function index(Request $request)
    {
        $query = PicaItem::with(['investigationReport', 'investigationApproval', 'creator']);

        if ($request->has('analisa_kecelakaan_id')) {
            $query->where('analisa_kecelakaan_id', $request->analisa_kecelakaan_id);
        }

        $user = auth()->user();
        $isCrs = $user && (
            $user->hasRole('crs', 'CRS', 'superadmin', 'super-admin', 'admin', 'hse admin', 'hse_admin') ||
            ($user->employee && $user->employee->can_approve)
        );

        if (!$isCrs && $user && $user->employee_id) {
            $query->whereHas('investigationReport.accidentNotification', function ($q) use ($user) {
                $q->where('company_id', $user->employee->company_id);
            });
        }

        return response()->json([
            'data' => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'analisa_kecelakaan_id' => 'required|exists:analisa_kecelakaan,id',
            'analisa_kecelakaan_approval_id' => 'nullable|exists:analisa_kecelakaan_approvals,id',
            'problem_identification' => 'required|string',
            'corrective_action' => 'required|string',
            'pic' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|string'
        ]);

        $validated['created_by'] = auth()->id() ?? 1;

        $picaItem = PicaItem::create($validated);

        return response()->json([
            'message' => 'PICA item created successfully',
            'data' => $picaItem->load(['investigationApproval', 'creator'])
        ], 201);
    }

    public function update(Request $request, PicaItem $pica)
    {
        $validated = $request->validate([
            'problem_identification' => 'sometimes|required|string',
            'corrective_action' => 'sometimes|required|string',
            'pic' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|string'
        ]);

        $pica->update($validated);

        return response()->json([
            'message' => 'PICA item updated successfully',
            'data' => $pica->fresh(['investigationApproval', 'creator'])
        ]);
    }

    public function destroy(PicaItem $pica)
    {
        $pica->delete();

        return response()->json([
            'message' => 'PICA item deleted successfully'
        ]);
    }
}
