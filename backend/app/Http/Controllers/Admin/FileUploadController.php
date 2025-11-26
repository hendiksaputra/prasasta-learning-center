<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
            'folder' => 'nullable|string|max:255',
        ]);

        try {
            $file = $request->file('file');
            $folder = $request->input('folder', 'testimonials');
            
            // Generate unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            
            // Store file in storage/app/public/{folder}
            $path = $file->storeAs('public/' . $folder, $filename);
            
            // Get public URL
            // Storage::url() expects path relative to storage/app/public
            // It returns /storage/{path}
            $url = Storage::url($folder . '/' . $filename);
            
            // For local development, prepend the base URL (http://localhost:8000)
            $baseUrl = config('app.url', 'http://localhost:8000');
            // Ensure URL doesn't have double slashes
            $fullUrl = rtrim($baseUrl, '/') . $url;
            
            return response()->json([
                'message' => 'File uploaded successfully',
                'url' => $fullUrl,
                'path' => $url,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload file',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

