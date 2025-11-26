<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\JsonResponse;

class GalleryController extends Controller
{
    public function index(): JsonResponse
    {
        $images = GalleryImage::published()
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return response()->json([
            'data' => $images,
        ]);
    }
}

