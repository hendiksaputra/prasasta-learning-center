<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\JsonResponse;

class InstructorController extends Controller
{
    public function index(): JsonResponse
    {
        $instructors = Instructor::where('is_active', true)
            ->with('courses')
            ->get();

        return response()->json($instructors);
    }

    public function show(int $id): JsonResponse
    {
        $instructor = Instructor::where('is_active', true)
            ->with(['courses' => function ($query) {
                $query->published();
            }])
            ->findOrFail($id);

        return response()->json($instructor);
    }
}

