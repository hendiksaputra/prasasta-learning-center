<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Instructor extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'bio',
        'specialization',
        'photo',
        'qualifications',
        'years_experience',
        'is_active',
    ];

    protected $casts = [
        'qualifications' => 'array',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_instructor')
            ->withPivot('is_primary')
            ->withTimestamps();
    }
}

