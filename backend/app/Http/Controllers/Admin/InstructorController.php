<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InstructorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Instructor::with('courses');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $instructors = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($instructors);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors,email',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'specialization' => 'nullable|string',
            'years_experience' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $instructor = Instructor::create($request->only([
            'name',
            'email',
            'phone',
            'bio',
            'specialization',
            'years_experience',
            'qualifications',
        ]));

        return response()->json([
            'message' => 'Instructor created successfully',
            'instructor' => $instructor,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $instructor = Instructor::with('courses')->findOrFail($id);
        return response()->json($instructor);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $instructor = Instructor::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'email' => 'sometimes|email|unique:instructors,email,' . $id,
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $instructor->update($request->only([
            'name',
            'email',
            'phone',
            'bio',
            'specialization',
            'years_experience',
            'qualifications',
            'is_active',
        ]));

        return response()->json([
            'message' => 'Instructor updated successfully',
            'instructor' => $instructor,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $instructor = Instructor::findOrFail($id);
        $instructor->delete();

        return response()->json([
            'message' => 'Instructor deleted successfully',
        ]);
    }
}

