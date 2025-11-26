<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FacilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Facility::query();

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

        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        $facilities = $query->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($facilities);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'required|string|url',
            'sort_order' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'status' => 'in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $facility = Facility::create([
            'title' => $request->title,
            'description' => $request->description,
            'image_url' => $request->image_url,
            'sort_order' => $request->sort_order ?? 0,
            'is_featured' => $request->boolean('is_featured', false),
            'status' => $request->status ?? 'draft',
        ]);

        return response()->json([
            'message' => 'Facility created successfully',
            'facility' => $facility,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $facility = Facility::findOrFail($id);

        return response()->json($facility);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $facility = Facility::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'sometimes|string|url',
            'sort_order' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'status' => 'in:draft,published,archived',
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
            'sort_order',
            'status',
        ]);

        if ($request->has('is_featured')) {
            $updateData['is_featured'] = $request->boolean('is_featured');
        }

        $facility->update($updateData);

        return response()->json([
            'message' => 'Facility updated successfully',
            'facility' => $facility,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $facility = Facility::findOrFail($id);
        $facility->delete();

        return response()->json([
            'message' => 'Facility deleted successfully',
        ]);
    }
}

