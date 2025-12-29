<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\InstructorController;
use Illuminate\Support\Facades\Route;

// Public API Routes
Route::prefix('v1')->group(function () {
    // Courses
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{slug}', [CourseController::class, 'show']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);

    // Instructors
    Route::get('/instructors', [InstructorController::class, 'index']);
    Route::get('/instructors/{id}', [InstructorController::class, 'show']);

        // Enrollments
        Route::post('/enrollments', [EnrollmentController::class, 'store']);

        // Testimonials
        Route::get('/testimonials', [\App\Http\Controllers\Api\TestimonialController::class, 'index']);

        // Gallery
        Route::get('/gallery', [\App\Http\Controllers\Api\GalleryController::class, 'index']);

        // Facilities
        Route::get('/facilities', [\App\Http\Controllers\Api\FacilityController::class, 'index']);

    // Authentication routes
    Route::post('/auth/login', [\App\Http\Controllers\Auth\AuthController::class, 'login']);
    
    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        Route::post('/auth/logout', [\App\Http\Controllers\Auth\AuthController::class, 'logout']);
        Route::get('/auth/me', [\App\Http\Controllers\Auth\AuthController::class, 'me']);
        
        // Student routes
            // Admin routes
            Route::prefix('admin')->group(function () {
                Route::apiResource('courses', \App\Http\Controllers\Admin\CourseController::class);
                Route::apiResource('categories', \App\Http\Controllers\Admin\CategoryController::class);
                Route::apiResource('instructors', \App\Http\Controllers\Admin\InstructorController::class);
                Route::apiResource('testimonials', \App\Http\Controllers\Admin\TestimonialController::class);
                Route::apiResource('gallery', \App\Http\Controllers\Admin\GalleryController::class);
                Route::apiResource('facilities', \App\Http\Controllers\Admin\FacilityController::class);
                Route::get('upload/test', [\App\Http\Controllers\Admin\FileUploadController::class, 'test']);
                Route::post('upload', [\App\Http\Controllers\Admin\FileUploadController::class, 'upload']);
                Route::get('enrollments', [\App\Http\Controllers\Admin\EnrollmentController::class, 'index']);
                Route::get('enrollments/{id}', [\App\Http\Controllers\Admin\EnrollmentController::class, 'show']);
                Route::put('enrollments/{id}', [\App\Http\Controllers\Admin\EnrollmentController::class, 'update']);
            });
    });
});

