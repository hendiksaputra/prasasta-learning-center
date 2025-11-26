<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EnrollmentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $course = Course::findOrFail($request->course_id);

        // Check if course is published
        if ($course->status !== 'published') {
            return response()->json([
                'message' => 'Course is not available for enrollment',
            ], 400);
        }

        // Check if course has available slots
        if ($course->max_students) {
            $currentEnrollments = Enrollment::where('course_id', $course->id)
                ->whereIn('status', ['confirmed', 'in_progress'])
                ->count();

            if ($currentEnrollments >= $course->max_students) {
                return response()->json([
                    'message' => 'Course is full',
                ], 400);
            }
        }

        // Find or create student
        $student = Student::firstOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
            ]
        );

        // Create enrollment
        $enrollment = Enrollment::create([
            'student_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'pending',
            'enrollment_date' => now(),
            'amount_paid' => 0,
            'payment_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Enrollment request submitted successfully',
            'enrollment' => $enrollment->load(['student', 'course']),
        ], 201);
    }
}

