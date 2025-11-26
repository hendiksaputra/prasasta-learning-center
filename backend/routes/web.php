<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'PRASASTA Learning Center API',
        'version' => '1.0.0',
    ]);
});

