<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Testimonial::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('testimonial', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $testimonials = $query->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($testimonials);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'testimonial' => 'required|string',
            'photo' => 'nullable|string',
            'rating' => 'required|integer|min:1|max:5',
            'course_name' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $testimonial = Testimonial::create([
            'name' => $request->name,
            'position' => $request->position,
            'company' => $request->company,
            'testimonial' => $request->testimonial,
            'photo' => $request->photo,
            'rating' => $request->rating,
            'course_name' => $request->course_name,
            'is_featured' => $request->boolean('is_featured'),
            'sort_order' => $request->sort_order ?? 0,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Testimonial created successfully',
            'testimonial' => $testimonial,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);

        return response()->json($testimonial);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'position' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'testimonial' => 'sometimes|string',
            'photo' => 'nullable|string',
            'rating' => 'sometimes|integer|min:1|max:5',
            'course_name' => 'nullable|string|max:255',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $updateData = $request->only([
            'name',
            'position',
            'company',
            'testimonial',
            'photo',
            'rating',
            'course_name',
            'sort_order',
            'status',
        ]);

        if ($request->has('is_featured')) {
            $updateData['is_featured'] = $request->boolean('is_featured');
        }

        $testimonial->update($updateData);

        return response()->json([
            'message' => 'Testimonial updated successfully',
            'testimonial' => $testimonial,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json([
            'message' => 'Testimonial deleted successfully',
        ]);
    }
}

