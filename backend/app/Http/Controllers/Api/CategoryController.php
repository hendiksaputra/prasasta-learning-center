<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseCategory;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = CourseCategory::where('is_active', true)
            ->withCount('activeCourses')
            ->orderBy('sort_order')
            ->get();

        return response()->json($categories);
    }

    public function show(string $slug): JsonResponse
    {
        $category = CourseCategory::where('slug', $slug)
            ->where('is_active', true)
            ->with(['courses' => function ($query) {
                $query->published()->orderBy('sort_order');
            }])
            ->firstOrFail();

        return response()->json($category);
    }
}

