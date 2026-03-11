<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/
Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/forgot-password', [App\Http\Controllers\Api\AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [App\Http\Controllers\Api\AuthController::class, 'resetPassword']);
Route::post('/social-login', [AuthController::class, 'socialLogin']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Authentication Required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [App\Http\Controllers\Api\AuthController::class, 'user']);
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::post('/admin/users/{id}/activate-premium', [\App\Http\Controllers\Api\Admin\SubscriptionController::class, 'activate']);
    Route::post('/templates/{template}/wishlist', [TemplateController::class, 'toggleWishlist']);
    Route::get('/user/wishlist', [TemplateController::class, 'userWishlist']);
});


/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Server is running',
        'timestamp' => now()->toDateTimeString()
    ]);
});
