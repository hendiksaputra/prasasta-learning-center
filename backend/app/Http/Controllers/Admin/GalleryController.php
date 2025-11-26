<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GalleryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = GalleryImage::query();

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

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $images = $query->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($images);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'required|string',
            'category' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $image = GalleryImage::create([
            'title' => $request->title,
            'description' => $request->description,
            'image_url' => $request->image_url,
            'category' => $request->category,
            'is_featured' => $request->boolean('is_featured'),
            'sort_order' => $request->sort_order ?? 0,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Gallery image created successfully',
            'image' => $image,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $image = GalleryImage::findOrFail($id);

        return response()->json($image);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $image = GalleryImage::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'sometimes|string',
            'category' => 'nullable|string|max:255',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $updateData = $request->only([
            'title',
            'description',
            'image_url',
            'category',
            'sort_order',
            'status',
        ]);

        if ($request->has('is_featured')) {
            $updateData['is_featured'] = $request->boolean('is_featured');
        }

        $image->update($updateData);

        return response()->json([
            'message' => 'Gallery image updated successfully',
            'image' => $image,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $image = GalleryImage::findOrFail($id);
        $image->delete();

        return response()->json([
            'message' => 'Gallery image deleted successfully',
        ]);
    }
}

