# Prompt Planning: Form Notifikasi Kecelakaan (Pemberitahuan Kecelakaan)

> **Project:** Laravel 11 · Inertia.js v2 · React 18 (JSX) · Ant Design 5 · TanStack Table v8 · MySQL 8  
> **Catatan:** Stack & dependency sudah terinstall. Ikuti panduan ini secara berurutan: **0. Backend** (Migration → Model → API Controller → Route API → Route Web) → **1–8. Frontend** (halaman form full-page, bukan modal).

---

## 0. Backend — Migration, Model, API Controller, Route API & Web

> Kerjakan bagian ini **sebelum** membuat halaman React.

---

### 0.1 Migration

Buat file migration baru:
```
database/migrations/YYYY_MM_DD_HHMMSS_create_accident_notifications_table.php
```

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accident_notifications', function (Blueprint $table) {
            $table->id();

            // ── Header Dokumen ──────────────────────────────────
            $table->string('notification_number')->unique()->nullable(); // Auto-generate
            $table->boolean('is_hpri')->default(false);

            // ── Ringkasan Insiden ───────────────────────────────
            $table->date('incident_date');
            $table->time('incident_time');
            $table->string('location');
            $table->string('company_contractor')->nullable();
            $table->string('incident_classification')->nullable();

            // ── Keparahan Aktual ────────────────────────────────
            $table->unsignedTinyInteger('actual_k3')->default(1);  // 1–5
            $table->unsignedTinyInteger('actual_kk')->default(1);
            $table->unsignedTinyInteger('actual_lh')->default(1);

            // ── Keparahan Potensial ─────────────────────────────
            $table->unsignedTinyInteger('potential_k3')->default(1);
            $table->unsignedTinyInteger('potential_kk')->default(1);
            $table->unsignedTinyInteger('potential_lh')->default(1);

            // ── Kronologi & Fakta ───────────────────────────────
            $table->text('chronology')->nullable();
            $table->json('incident_facts')->nullable();     // array of strings
            $table->json('corrective_actions')->nullable(); // array of strings

            // ── Akibat Kecelakaan ───────────────────────────────
            $table->string('consequence_human')->nullable();
            $table->string('consequence_equipment')->nullable();
            $table->string('consequence_environment')->nullable();

            // ── Reporter & Approver ─────────────────────────────
            $table->string('reporter_name')->nullable();
            $table->string('reporter_position')->nullable();
            $table->string('approver_name')->nullable();
            $table->string('approver_position')->nullable();

            // ── Status & Metadata ───────────────────────────────
            $table->enum('status', ['draft', 'submitted'])->default('draft');
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        // Foto disimpan di tabel terpisah (one-to-many, max 3 file)
        Schema::create('accident_notification_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accident_notification_id')
                  ->constrained('accident_notifications')
                  ->cascadeOnDelete();
            $table->string('path');    // storage path relatif
            $table->string('filename')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accident_notification_photos');
        Schema::dropIfExists('accident_notifications');
    }
};
```

Jalankan:
```bash
php artisan migrate
```

---

### 0.2 Model

**`app/Models/AccidentNotification.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccidentNotification extends Model
{
    protected $table = 'accident_notifications';
    protected $guarded = [];

    protected $casts = [
        'incident_facts'     => 'array',
        'corrective_actions' => 'array',
        'is_hpri'            => 'boolean',
        'incident_date'      => 'date',
    ];

    // Auto-generate notification_number sebelum create
    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (empty($model->notification_number)) {
                $year  = now()->format('Y');
                $month = now()->format('m');
                $count = static::whereYear('created_at', $year)
                               ->whereMonth('created_at', $month)
                               ->count() + 1;
                $model->notification_number = sprintf('AN/%s/%s/%04d', $year, $month, $count);
            }
        });
    }

    public function photos()
    {
        return $this->hasMany(AccidentNotificationPhoto::class);
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}
```

**`app/Models/AccidentNotificationPhoto.php`**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccidentNotificationPhoto extends Model
{
    protected $table = 'accident_notification_photos';
    protected $guarded = [];

    public function accidentNotification()
    {
        return $this->belongsTo(AccidentNotification::class);
    }
}
```

---

### 0.3 API Controller

**`app/Http/Controllers/Api/AccidentNotificationController.php`**

Ikuti pola `CcowController` — gunakan `ResponseFormatter`, `Validator`, dan `apiResource`.

```php
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

        $query = AccidentNotification::with('photos')
            ->when($search, fn($q) => $q
                ->where('notification_number', 'like', "%$search%")
                ->orWhere('location', 'like', "%$search%")
                ->orWhere('incident_classification', 'like', "%$search%")
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
            'location'                => 'required|string|max:255',
            'company_contractor'      => 'nullable|string|max:255',
            'incident_classification' => 'nullable|string|max:255',
            'actual_k3'               => 'required|integer|min:1|max:5',
            'actual_kk'               => 'required|integer|min:1|max:5',
            'actual_lh'               => 'required|integer|min:1|max:5',
            'potential_k3'            => 'required|integer|min:1|max:5',
            'potential_kk'            => 'required|integer|min:1|max:5',
            'potential_lh'            => 'required|integer|min:1|max:5',
            'chronology'              => 'nullable|string',
            'reporter_name'           => 'nullable|string|max:255',
            'reporter_position'       => 'nullable|string|max:255',
            'approver_name'           => 'nullable|string|max:255',
            'approver_position'       => 'nullable|string|max:255',
            'status'                  => 'in:draft,submitted',
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
            'location'                => 'required|string|max:255',
            'company_contractor'      => 'nullable|string|max:255',
            'incident_classification' => 'nullable|string|max:255',
            'actual_k3'               => 'required|integer|min:1|max:5',
            'actual_kk'               => 'required|integer|min:1|max:5',
            'actual_lh'               => 'required|integer|min:1|max:5',
            'potential_k3'            => 'required|integer|min:1|max:5',
            'potential_kk'            => 'required|integer|min:1|max:5',
            'potential_lh'            => 'required|integer|min:1|max:5',
            'chronology'              => 'nullable|string',
            'reporter_name'           => 'nullable|string|max:255',
            'reporter_position'       => 'nullable|string|max:255',
            'approver_name'           => 'nullable|string|max:255',
            'approver_position'       => 'nullable|string|max:255',
            'status'                  => 'in:draft,submitted',
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
```

---

### 0.4 Route API

Edit **`routes/api.php`** — tambahkan di dalam blok `Route::middleware('auth:api')->group()`:

```php
// Di bagian use (atas file)
use App\Http\Controllers\Api\AccidentNotificationController;

// Di dalam blok protected:
// Accident Notification
Route::delete('accident-notification/{id}/photos/{photoId}', [AccidentNotificationController::class, 'destroyPhoto']);
Route::apiResource('accident-notification', AccidentNotificationController::class);
```

> **Catatan urutan:** Route `DELETE .../photos/{photoId}` harus dideklarasikan **sebelum** `apiResource` agar tidak tertimpa oleh route `destroy` bawaan.

---

### 0.5 Route Web (Inertia)

Edit **`routes/web.php`** — tambahkan group baru di dalam `Route::middleware(['auth', 'verified'])->group()`:

```php
// Accident Notification
Route::prefix('accident-notification')->name('accident-notification.')->group(function () {
    Route::get('/',          function () {
        return Inertia::render('AccidentNotification/Index');
    })->name('index');

    Route::get('/create',    function () {
        return Inertia::render('AccidentNotification/Form');
    })->name('create');

    Route::get('/{id}/edit', function ($id) {
        // Ambil data dari model untuk di-pass sebagai prop Inertia
        $record = \App\Models\AccidentNotification::with('photos')->findOrFail($id);
        return Inertia::render('AccidentNotification/Form', [
            'accidentNotification' => $record,
        ]);
    })->name('edit');
});
```

> Pola ini konsisten dengan web route MasterData (misal `/master-data/ccow`), hanya menggunakan Inertia::render tanpa logika bisnis — semua data diambil via API dari React.

---

### 0.6 Ringkasan Struktur Backend

```
📁 database/migrations/
   └── YYYY_MM_DD_create_accident_notifications_table.php   [NEW]

📁 app/Models/
   ├── AccidentNotification.php                             [NEW]
   └── AccidentNotificationPhoto.php                        [NEW]

📁 app/Http/Controllers/Api/
   └── AccidentNotificationController.php                   [NEW]

📄 routes/api.php     ← tambah 2 baris route
📄 routes/web.php     ← tambah group accident-notification
```

---

## 1. Struktur File yang Perlu Dibuat

```
resources/js/Pages/AccidentNotification/
├── Index.jsx                    ← Halaman list (opsional, untuk nanti)
├── Form.jsx                     ← Halaman form CREATE / EDIT utama
├── Hooks/
│   └── useAccidentNotification.jsx   ← Custom hook (API calls, state, handlers)
└── Partials/
    ├── IncidentOverviewSection.jsx   ← Section ringkasan insiden
    ├── SeveritySection.jsx           ← Section keparahan aktual & potensial
    ├── ChronologySection.jsx         ← Section kronologi & fakta
    ├── ConsequenceSection.jsx        ← Section akibat kecelakaan
    ├── MediaSection.jsx              ← Section upload foto
    └── ReporterSection.jsx           ← Section reporter & approver
```

---

## 2. Pola yang Harus Diikuti

### 2.1 Layout
Gunakan `DashboardLayout` seperti semua halaman lain:
```jsx
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";

export default function AccidentNotificationForm() {
    return (
        <DashboardLayout title="Pemberitahuan Kecelakaan">
            <Head title="Pemberitahuan Kecelakaan" />
            {/* konten form */}
        </DashboardLayout>
    );
}
```

### 2.2 API Request — Gunakan Helper yang Sudah Ada
Gunakan `useRequest` dari `@/Helpers/useRequest` seperti di `useCcow.jsx`:
```jsx
import { useGet, usePost, usePut, useDelete } from "@/Helpers/useRequest";

const [postRequest, postFeedback] = usePost("accident-notification");
const [putRequest, putFeedback] = usePut("accident-notification");
```

### 2.3 Notifikasi — Gunakan Ant Design App Context
```jsx
import { App } from "antd";

const { notification } = App.useApp();
notification.success({ message: "Berhasil", description: "Data berhasil disimpan." });
notification.error({ message: "Gagal", description: "..." });
```

### 2.4 Theme — Gunakan ThemeContext
```jsx
import { useTheme } from "@/Contexts/ThemeContext";
const { isDarkMode } = useTheme();
```

### 2.5 Form — Gunakan Ant Design Form (bukan useForm Inertia, karena ada file upload)
```jsx
import { Form, Input, DatePicker, TimePicker, Switch, Upload, Button } from "antd";

const [form] = Form.useForm();

const handleSubmit = async (status) => {
    try {
        const values = await form.validateFields();
        const formData = new FormData();
        // ... append ke formData, termasuk photos
        const response = await postRequest(formData);
        if (response.data?.meta?.status === 'success') {
            notification.success({ message: "Berhasil disimpan" });
        }
    } catch (err) {
        // handle validation error
    }
};
```

---

## 3. Sections Form & Field

| # | Section Label | Fields |
|---|---|---|
| 1 | **Header Form** | `document_id` (read-only: F-MAC-IMS-14-001), `document_rev` (read-only: 4.0), `notification_number` (auto-generate, read-only), tombol HPRI toggle |
| 2 | **Ringkasan Insiden (Incident Overview)** | `incident_date` (DatePicker), `incident_time` (TimePicker), `location` (Input), `company_contractor` (Input), `incident_classification` (Input/Select) |
| 3 | **Keparahan Aktual (Actual Severity)** | `actual_k3` (1–5 button selector), `actual_kk` (1–5), `actual_lh` (1–5) |
| 4 | **Keparahan Potensial (Potential Severity)** | `potential_k3` (1–5), `potential_kk` (1–5), `potential_lh` (1–5) |
| 5 | **Kronologi & Fakta** | `chronology` (TextArea), `incident_facts` (dynamic list tambah/hapus item), `corrective_actions` (dynamic list) |
| 6 | **Akibat Kecelakaan** | `consequence_human` (Input), `consequence_equipment` (Input), `consequence_environment` (Input) |
| 7 | **Lampiran Media** | `photos` (Upload, max 3 file, preview thumbnail, accept jpg/jpeg/png) |
| 8 | **Reporter & Approver** | `reporter_name`, `reporter_position`, `approver_name`, `approver_position` (semua Input) |
| 9 | **Action Buttons** | **Save As Draft** · **Submit** |

---

## 4. Komponen Reusable dalam Partials

### 4.1 SeveritySelector (tombol 1–5)
Buat sebagai komponen sederhana, **bukan** Ant Design Rate:
```jsx
// Dipakai di SeveritySection.jsx
function SeveritySelector({ label, value, onChange }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                {label}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        type="button"
                        onClick={() => onChange(num)}
                        style={{
                            width: 40, height: 40, borderRadius: 6, border: '1px solid',
                            cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                            background: value === num ? '#2563eb' : '#fff',
                            color: value === num ? '#fff' : '#374151',
                            borderColor: value === num ? '#2563eb' : '#d1d5db',
                        }}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
}
```

### 4.2 DynamicList (fakta kejadian / tindakan perbaikan)
```jsx
// Tambah/hapus baris input secara dinamis
function DynamicList({ label, value = [''], onChange }) {
    const addItem   = () => onChange([...value, '']);
    const removeItem = (i) => onChange(value.filter((_, idx) => idx !== i));
    const updateItem = (i, val) => {
        const updated = [...value];
        updated[i] = val;
        onChange(updated);
    };
    // render Input per item + tombol X + Tambah item
}
```

### 4.3 HpriToggle (Switch TIDAK / YA)
Letakkan di pojok kanan atas header form, tampilkan label **TIDAK** / **YA** sesuai state:
```jsx
<Switch
    checked={isHpri}
    onChange={(val) => setIsHpri(val)}
    checkedChildren="YA"
    unCheckedChildren="TIDAK"
/>
```

### 4.4 PhotoUpload
Gunakan `Upload` Ant Design dengan `listType="picture-card"`, maxCount=3, beforeUpload untuk prevent auto-upload (simpan file ke state):
```jsx
<Upload
    listType="picture-card"
    fileList={fileList}
    beforeUpload={(file) => { setFileList(prev => [...prev, file]); return false; }}
    onRemove={(file) => setFileList(prev => prev.filter(f => f.uid !== file.uid))}
    maxCount={3}
    accept=".jpg,.jpeg,.png"
>
    {fileList.length < 3 && <div>+ Upload</div>}
</Upload>
```

---

## 5. Custom Hook: `useAccidentNotification.jsx`

Hook ini mengurus semua logika:

```jsx
import { useState } from "react";
import { usePost, usePut } from "@/Helpers/useRequest";
import { App } from "antd";
import { router } from "@inertiajs/react";

export default function useAccidentNotification(initialData = null) {
    const { notification } = App.useApp();
    const [postRequest, postFeedback] = usePost("accident-notification");
    const [putRequest, putFeedback] = usePut("accident-notification");

    const [isHpri, setIsHpri] = useState(initialData?.is_hpri ?? false);
    const [severity, setSeverity] = useState({
        actual_k3: initialData?.actual_k3 ?? 1,
        actual_kk: initialData?.actual_kk ?? 1,
        actual_lh: initialData?.actual_lh ?? 1,
        potential_k3: initialData?.potential_k3 ?? 1,
        potential_kk: initialData?.potential_kk ?? 1,
        potential_lh: initialData?.potential_lh ?? 1,
    });
    const [incidentFacts, setIncidentFacts]         = useState(initialData?.incident_facts ?? ['']);
    const [correctiveActions, setCorrectiveActions] = useState(initialData?.corrective_actions ?? ['']);
    const [fileList, setFileList] = useState([]);

    const buildFormData = (values, status) => {
        const fd = new FormData();
        fd.append('status', status);
        fd.append('is_hpri', isHpri ? 1 : 0);
        Object.entries(severity).forEach(([k, v]) => fd.append(k, v));
        incidentFacts.forEach((f, i) => fd.append(`incident_facts[${i}]`, f));
        correctiveActions.forEach((a, i) => fd.append(`corrective_actions[${i}]`, a));
        fileList.forEach((file) => fd.append('photos[]', file));
        // Append semua nilai Ant Design Form
        Object.entries(values).forEach(([k, v]) => {
            if (v !== undefined && v !== null) fd.append(k, v);
        });
        return fd;
    };

    const handleSave = async (form, status) => {
        try {
            const values = await form.validateFields();
            const fd = buildFormData(values, status);
            const isEditing = !!initialData;
            const response = isEditing
                ? await putRequest(fd, initialData.id)
                : await postRequest(fd);

            if (response.data?.meta?.status === 'success') {
                notification.success({
                    message: status === 'draft' ? 'Draft Disimpan' : 'Berhasil Disubmit',
                    description: response.data?.meta?.message,
                });
                router.visit(route('accident-notification.index'));
            }
        } catch (error) {
            if (error?.errorFields) return; // Ant Design validation error, sudah ditampilkan
            notification.error({
                message: "Gagal",
                description: error.response?.data?.meta?.message || "Terjadi kesalahan pada server",
            });
        }
    };

    return {
        isHpri, setIsHpri,
        severity, setSeverity,
        incidentFacts, setIncidentFacts,
        correctiveActions, setCorrectiveActions,
        fileList, setFileList,
        handleSave,
        loading: postFeedback.loading || putFeedback.loading,
    };
}
```

---

## 6. Form.jsx — Struktur Utama

```jsx
import React from "react";
import { Head } from "@inertiajs/react";
import { Form, Button, Card, Row, Col, Divider, Space } from "antd";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTheme } from "@/Contexts/ThemeContext";
import { App } from "antd";
import useAccidentNotification from "./Hooks/useAccidentNotification";
import IncidentOverviewSection from "./Partials/IncidentOverviewSection";
import SeveritySection from "./Partials/SeveritySection";
import ChronologySection from "./Partials/ChronologySection";
import ConsequenceSection from "./Partials/ConsequenceSection";
import MediaSection from "./Partials/MediaSection";
import ReporterSection from "./Partials/ReporterSection";

export default function AccidentNotificationForm({ accidentNotification = null }) {
    const { isDarkMode } = useTheme();
    const [form] = Form.useForm();
    const {
        isHpri, setIsHpri,
        severity, setSeverity,
        incidentFacts, setIncidentFacts,
        correctiveActions, setCorrectiveActions,
        fileList, setFileList,
        handleSave,
        loading,
    } = useAccidentNotification(accidentNotification);

    const cardStyle = {
        marginBottom: 24,
        borderRadius: 12,
        border: "none",
        background: isDarkMode ? "#1f1f1f" : "#fff",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    };

    return (
        <DashboardLayout title="Pemberitahuan Kecelakaan">
            <Head title="Pemberitahuan Kecelakaan" />
            <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>

                {/* ── Header Dokumen ── */}
                <Row justify="space-between" align="top" style={{ marginBottom: 24 }}>
                    <Col>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: isDarkMode ? "#fff" : "#1e293b" }}>
                            PEMBERITAHUAN KECELAKAAN
                        </h2>
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        {/* Document ID, Rev, Notification Number */}
                        <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700 }}>
                            F-MAC-IMS-14-001 Rev. 4.0
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                            {accidentNotification?.notification_number ?? "Auto-Generate"}
                        </div>
                        {/* HPRI Toggle */}
                        <div style={{ marginTop: 12 }}>
                            {/* HpriToggle component di sini */}
                        </div>
                    </Col>
                </Row>

                <Form form={form} layout="vertical" initialValues={accidentNotification}>

                    {/* Section 1: Ringkasan Insiden */}
                    <Card title="Ringkasan Insiden (Incident Overview)" style={cardStyle}>
                        <IncidentOverviewSection />
                    </Card>

                    {/* Section 2 & 3: Severity */}
                    <Card title="Keparahan" style={cardStyle}>
                        <Row gutter={[32, 0]}>
                            <Col xs={24} md={12}>
                                <SeveritySection
                                    title="Keparahan Aktual (Actual Severity)"
                                    prefix="actual"
                                    severity={severity}
                                    setSeverity={setSeverity}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <SeveritySection
                                    title="Keparahan Potensial (Potential Severity)"
                                    prefix="potential"
                                    severity={severity}
                                    setSeverity={setSeverity}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* Section 4: Kronologi & Fakta */}
                    <Card title="Kronologi & Fakta" style={cardStyle}>
                        <ChronologySection
                            incidentFacts={incidentFacts}
                            setIncidentFacts={setIncidentFacts}
                            correctiveActions={correctiveActions}
                            setCorrectiveActions={setCorrectiveActions}
                        />
                    </Card>

                    {/* Section 5: Akibat */}
                    <Card title="Akibat Kecelakaan" style={cardStyle}>
                        <ConsequenceSection />
                    </Card>

                    {/* Section 6: Media */}
                    <Card title="Lampiran Media" style={cardStyle}>
                        <MediaSection fileList={fileList} setFileList={setFileList} />
                    </Card>

                    {/* Section 7: Reporter & Approver */}
                    <Card title="Reporter & Approver" style={cardStyle}>
                        <ReporterSection />
                    </Card>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 8 }}>
                        <Button
                            size="large"
                            onClick={() => handleSave(form, 'draft')}
                            loading={loading}
                        >
                            Save As Draft
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => handleSave(form, 'submitted')}
                            loading={loading}
                            style={{
                                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                                border: "none",
                                fontWeight: 600,
                            }}
                        >
                            Submit
                        </Button>
                    </div>

                </Form>
            </div>
        </DashboardLayout>
    );
}
```

---

## 7. Sections Breakdown (Tampilan Sesuai Gambar)

| # | Section | Tampilan / Catatan |
|---|---|---|
| Header | Document Info + HPRI | Kanan atas: nomor dokumen (biru), nomor notifikasi. Toggle HPRI kotak putih pojok kanan atas dengan label **TIDAK / YA** |
| 1 | Ringkasan Insiden | 2 kolom: Tanggal Insiden + Jam Insiden / Lokasi + Perusahaan/Kontraktor. Baris bawah: Klasifikasi Insiden |
| 2 | Keparahan Aktual | 3 baris: K3 / KK / LH, masing-masing tombol 1–5 (aktif = biru) |
| 3 | Keparahan Potensial | Sama dengan Keparahan Aktual, 2 kolom sejajar di layar |
| 4 | Kronologi & Fakta | TextArea narasi, lalu dynamic list **Fakta Kejadian** & **Tindakan Perbaikan** |
| 5 | Akibat Kecelakaan | 3 input: Manusia / Equipment / Lingkungan (tampilan kanan atas form mirip kotak kecil) |
| 6 | Lampiran Media | Grid upload max 3 foto, preview thumbnail |
| 7 | Reporter & Approver | 2 kolom: Reporter (Nama + Jabatan) / Approver (Nama + Jabatan) |
| 8 | Action | **Save As Draft** (outline) + **Submit** (biru primary) — rata kanan bawah |

---

## 8. Catatan Penting

- **Tidak menggunakan form modal** — form adalah halaman full-page tersendiri.
- **Ant Design Form** dipakai untuk layout & validasi field teks/tanggal. State khusus (severity, dynamic list, foto) dikelola secara manual di hook.
- **FormData** wajib digunakan saat submit agar file foto terkirim (`multipart/form-data`).
- Severity selector (1–5) dibuat dengan `<button type="button">` bukan Ant Design Rate, agar tampilannya kotak dan bisa dikustomisasi warna aktif.
- `notification_number` dibuat otomatis di controller, jangan tampilkan sebagai input yang bisa diedit.
- Gunakan `router.visit(route('accident-notification.index'))` dari `@inertiajs/react` setelah berhasil submit, bukan `redirect()` langsung.
- HPRI toggle ditempatkan di pojok kanan atas kartu header, bukan di dalam section form biasa.
- Ikuti pola dark mode: seluruh Card, wrapper menggunakan `isDarkMode` dari `useTheme()`.
