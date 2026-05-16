<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class EmailGroupController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/EmailGroup/Index', [
            'groups' => EmailGroup::with('recipients')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'recipients' => 'required|array',
            'recipients.*.email' => 'required|email',
        ]);

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

        return redirect()->back()->with('success', 'Email group created successfully.');
    }

    public function update(Request $request, EmailGroup $emailGroup)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'recipients' => 'required|array',
            'recipients.*.email' => 'required|email',
        ]);

        $emailGroup->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        // Simple sync: delete and recreate
        $emailGroup->recipients()->delete();
        foreach ($request->recipients as $recipient) {
            $emailGroup->recipients()->create([
                'email' => $recipient['email'],
                'name' => $recipient['name'] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'Email group updated successfully.');
    }

    public function destroy(EmailGroup $emailGroup)
    {
        $emailGroup->delete();
        return redirect()->back()->with('success', 'Email group deleted successfully.');
    }
}
