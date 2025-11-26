<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Course::with(['category', 'instructors']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $courses = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($courses);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:course_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'total_hours' => 'required|integer|min:1',
            'level' => 'required|in:beginner,intermediate,advanced',
            'status' => 'required|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $courseData = [
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'description' => $request->description,
            'short_description' => $request->short_description,
            'price' => $request->price,
            'duration_days' => $request->duration_days,
            'total_hours' => $request->total_hours,
            'level' => $request->level,
            'status' => $request->status,
            'max_students' => $request->max_students,
            'min_students' => $request->min_students ?? 1,
            'learning_objectives' => $request->learning_objectives,
            'prerequisites' => $request->prerequisites,
            'what_you_will_learn' => $request->what_you_will_learn,
            'course_materials' => $request->course_materials ? (is_string($request->course_materials) ? json_decode($request->course_materials, true) : $request->course_materials) : null,
            'requirements' => $request->requirements ? (is_string($request->requirements) ? json_decode($request->requirements, true) : $request->requirements) : null,
            'facilities' => $request->facilities ? (is_string($request->facilities) ? json_decode($request->facilities, true) : $request->facilities) : null,
            'internship_opportunity' => $request->internship_opportunity,
            'certification_info' => $request->certification_info,
            'certification_price' => $request->certification_price,
            'registration_link' => $request->registration_link,
            'registration_deadline' => $request->registration_deadline,
            'training_method' => $request->training_method,
            'limited_quota' => $request->boolean('limited_quota'),
            'is_featured' => $request->boolean('is_featured'),
        ];

        $course = Course::create($courseData);

        if ($request->has('instructor_ids')) {
            $course->instructors()->attach($request->instructor_ids);
        }

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course->load(['category', 'instructors']),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $course = Course::with(['category', 'instructors', 'lessons', 'materials'])
            ->findOrFail($id);

        return response()->json($course);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $course = Course::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|exists:course_categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'level' => 'sometimes|in:beginner,intermediate,advanced',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $updateData = $request->only([
            'category_id',
            'title',
            'description',
            'short_description',
            'price',
            'duration_days',
            'total_hours',
            'level',
            'status',
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
            'training_method',
        ]);

        // Handle JSON fields
        if ($request->has('course_materials') && is_string($request->course_materials)) {
            $updateData['course_materials'] = json_decode($request->course_materials, true);
        }
        if ($request->has('requirements') && is_string($request->requirements)) {
            $updateData['requirements'] = json_decode($request->requirements, true);
        }
        if ($request->has('facilities') && is_string($request->facilities)) {
            $updateData['facilities'] = json_decode($request->facilities, true);
        }

        if ($request->has('limited_quota')) {
            $updateData['limited_quota'] = $request->boolean('limited_quota');
        }

        if ($request->has('title')) {
            $updateData['slug'] = Str::slug($request->title);
        }

        if ($request->has('is_featured')) {
            $updateData['is_featured'] = $request->boolean('is_featured');
        }

        $course->update($updateData);

        if ($request->has('instructor_ids')) {
            $course->instructors()->sync($request->instructor_ids);
        }

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $course->load(['category', 'instructors']),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully',
        ]);
    }
}

