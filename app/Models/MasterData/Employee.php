<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'm_employees';

    protected $fillable = [
        'nik',
        'name',
        'ccow_id',
        'company_id',
        'department_id',
        'jabatan_id',
        'email',
        'can_approve',
        'is_active',
    ];

    public function ccow(): BelongsTo
    {
        return $this->belongsTo(Ccow::class, 'ccow_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function jabatan(): BelongsTo
    {
        return $this->belongsTo(Jabatan::class, 'jabatan_id');
    }
}
