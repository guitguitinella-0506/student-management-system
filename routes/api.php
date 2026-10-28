<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// Login: no authentication required
Route::post('/login', [AuthController::class, 'login']);

// Public student listing and details
Route::apiResource('students', StudentController::class)
    ->only(['index', 'show']);

// Protected routes: authentication required
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('students', StudentController::class)
        ->except(['index', 'show']);
});
