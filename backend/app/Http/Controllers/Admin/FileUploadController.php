<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class FileUploadController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        try {
            // Log request start
            Log::info('Upload request received', [
                'has_file' => $request->hasFile('file'),
                'folder' => $request->input('folder'),
                'content_type' => $request->header('Content-Type'),
            ]);

            // Validate request
            $validated = $request->validate([
                'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // Max 10MB
                'folder' => 'nullable|string|max:255',
            ]);

            $file = $request->file('file');
            $folder = $request->input('folder', 'uploads');
            
            // Log file info
            Log::info('File info', [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'folder' => $folder,
            ]);
            
            // Generate unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            
            // Store file in storage/app/public/{folder}
            $path = $file->storeAs('public/' . $folder, $filename);
            
            Log::info('File stored', ['path' => $path]);
            
            // Get public URL
            // Storage::url() expects path relative to storage/app/public
            // It returns /storage/{path}
            $url = Storage::url($folder . '/' . $filename);
            
            // For production, prepend the base URL
            $baseUrl = config('app.url', 'http://localhost:8000');
            // Ensure URL doesn't have double slashes
            $fullUrl = rtrim($baseUrl, '/') . $url;
            
            Log::info('Upload successful', ['url' => $fullUrl]);
            
            return response()->json([
                'message' => 'File uploaded successfully',
                'url' => $fullUrl,
                'path' => $url,
            ], 200);
        } catch (ValidationException $e) {
            Log::error('Upload validation failed', [
                'errors' => $e->errors(),
            ]);
            
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Upload failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Failed to upload file',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

