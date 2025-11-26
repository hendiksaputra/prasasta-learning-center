<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Course::with(['category', 'instructors', 'lessons'])
            ->published();

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by level
        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Featured courses
        if ($request->boolean('featured')) {
            $query->featured();
        }

        $courses = $query->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 12));

        return response()->json($courses);
    }

    public function show(string $slug): JsonResponse
    {
        $course = Course::with([
            'category',
            'instructors',
            'lessons' => function ($query) {
                $query->orderBy('sort_order');
            },
            'materials',
        ])
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($course);
    }
}

