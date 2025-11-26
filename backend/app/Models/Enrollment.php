<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Enrollment extends Model
{
    protected $fillable = [
        'student_id',
        'course_id',
        'status',
        'enrollment_date',
        'start_date',
        'completion_date',
        'amount_paid',
        'payment_status',
        'notes',
    ];

    protected $casts = [
        'enrollment_date' => 'date',
        'start_date' => 'date',
        'completion_date' => 'date',
        'amount_paid' => 'decimal:2',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class);
    }
}

