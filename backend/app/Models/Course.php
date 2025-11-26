<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'description',
        'short_description',
        'image',
        'price',
        'duration_days',
        'total_hours',
        'max_students',
        'min_students',
        'learning_objectives',
        'prerequisites',
        'what_you_will_learn',
        'course_materials',
        'requirements',
        'facilities',
        'internship_opportunity',
        'certification_info',
        'certification_price',
        'registration_link',
        'registration_deadline',
        'limited_quota',
        'training_method',
        'level',
        'status',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'certification_price' => 'decimal:2',
        'is_featured' => 'boolean',
        'limited_quota' => 'boolean',
        'course_materials' => 'array',
        'requirements' => 'array',
        'facilities' => 'array',
        'registration_deadline' => 'date',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'category_id');
    }

    public function instructors(): BelongsToMany
    {
        return $this->belongsToMany(Instructor::class, 'course_instructor')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function primaryInstructor(): BelongsToMany
    {
        return $this->instructors()->wherePivot('is_primary', true);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order');
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}

