<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Enrollment::with(['student', 'course']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $enrollments = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($enrollments);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $enrollment = Enrollment::findOrFail($id);

        $enrollment->update($request->only([
            'status',
            'start_date',
            'completion_date',
            'amount_paid',
            'payment_status',
            'notes',
        ]));

        return response()->json([
            'message' => 'Enrollment updated successfully',
            'enrollment' => $enrollment->load(['student', 'course']),
        ]);
    }
}

