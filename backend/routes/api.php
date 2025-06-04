<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\{
    AuthController,
    ProfileController,
    ApplicationController,
    DocumentController,
    InterviewController,
    StageController,
    PresenceController,
    ReportController,
    BadgeController,
    NotificationController,
    MessageController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    
    // Profile routes
    Route::apiResource('profiles', ProfileController::class);
    
    // Application routes
    Route::middleware('role:student,hr,admin')->group(function () {
        Route::apiResource('applications', ApplicationController::class);
    });
    
    // Document routes
    Route::apiResource('documents', DocumentController::class);
    
    // Interview routes
    Route::middleware('role:hr,admin')->group(function () {
        Route::apiResource('interviews', InterviewController::class);
    });
    
    // Stage routes
    Route::apiResource('stages', StageController::class);
    
    // Presence routes
    Route::middleware('role:student,supervisor,admin')->group(function () {
        Route::apiResource('presences', PresenceController::class);
    });
    
    // Report routes
    Route::apiResource('reports', ReportController::class);
    
    // Badge routes
    Route::middleware('role:hr,admin')->group(function () {
        Route::apiResource('badges', BadgeController::class);
    });
    
    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/{id}', [NotificationController::class, 'show']);
        Route::post('/', [NotificationController::class, 'store']);
        Route::put('/{id}', [NotificationController::class, 'update']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/read-all', [NotificationController::class, 'markAllAsRead']);
    });
    
    // Message routes
    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'index']);
        Route::get('/{id}', [MessageController::class, 'show']);
        Route::post('/', [MessageController::class, 'store']);
        Route::put('/{id}', [MessageController::class, 'update']);
        Route::delete('/{id}', [MessageController::class, 'destroy']);
        Route::get('/conversation/{userId}', [MessageController::class, 'getConversation']);
    });
});