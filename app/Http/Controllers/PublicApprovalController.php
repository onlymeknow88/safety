<?php

namespace App\Http\Controllers;

use App\Models\AccidentNotification;
use App\Models\MasterData\Status;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicApprovalController extends Controller
{
    /**
     * Show the public approval page
     */
    public function show($uuid)
    {
        $record = AccidentNotification::with([
            'status', 'ccow', 'location', 'incidentType', 'department', 
            'victimGender', 'victimAgeInterval', 'victimPosition', 
            'victimExperience', 'company', 'companyContractor',
            'reporter', 'approver', 'progressStatus'
        ])->where('uuid', $uuid)->firstOrFail();

        return Inertia::render('Public/AccidentApproval', [
            'accident' => $record
        ]);
    }

    /**
     * Approve the record
     */
    public function approve(Request $request, $uuid)
    {
        $record = AccidentNotification::where('uuid', $uuid)->firstOrFail();

        // Security check: verify NIK/Email
        $verifier = $request->input('verifier');
        if (!$record->approver || (strtoupper($record->approver->nik) !== strtoupper($verifier) && strtolower($record->approver->email) !== strtolower($verifier))) {
            return back()->withErrors(['verifier' => 'Verifikasi gagal. NIK atau Email tidak sesuai dengan data Approver.']);
        }

        $status = Status::where('name', 'like', '%approved%')->first();
        $statusId = $status ? $status->id : 7;

        $record->update([
            'status_id' => $statusId,
            'approval_comment' => $request->input('comment'),
            'updated_by' => $record->approver->name . ' (Public Approval)',
        ]);

        return back()->with('success', 'Laporan berhasil disetujui.');
    }

    /**
     * Return the record
     */
    public function return(Request $request, $uuid)
    {
        $record = AccidentNotification::where('uuid', $uuid)->firstOrFail();

        // Security check
        $verifier = $request->input('verifier');
        if (!$record->approver || (strtoupper($record->approver->nik) !== strtoupper($verifier) && strtolower($record->approver->email) !== strtolower($verifier))) {
            return back()->withErrors(['verifier' => 'Verifikasi gagal. NIK atau Email tidak sesuai dengan data Approver.']);
        }

        $status = Status::where('name', 'like', '%return%')->first();
        $statusId = $status ? $status->id : 8;

        $record->update([
            'status_id' => $statusId,
            'approval_comment' => $request->input('comment'),
            'updated_by' => $record->approver->name . ' (Public Return)',
        ]);

        return back()->with('success', 'Laporan telah dikembalikan untuk diperbaiki.');
    }
}
