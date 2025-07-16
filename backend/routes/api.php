<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\API\{
    AdminController,
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
    MessageController,
    RHController,
    StagiaireController,
    EncadreurController,
    UserController
};
use App\Http\Controllers\FileUploadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 📤 Upload public
Route::post('/upload', [FileUploadController::class, 'upload']);

// 🧾 Auth publique
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🚀 ROUTE PUBLIQUE POUR LA SOUMISSION DE CANDIDATURE
Route::post('/apply', [ApplicationController::class, 'storePublicApplication']);

// 🔐 Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Profils
    Route::apiResource('profiles', ProfileController::class);

    // Applications (accès limité)
    Route::middleware('role:stagiaire,rh,admin')->group(function () {
        Route::apiResource('applications', ApplicationController::class);
    });

    // Documents
    Route::apiResource('documents', DocumentController::class);
    Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
    Route::get('/internships/{id}/generate-letter', [DocumentController::class, 'generateInternshipLetter']);
    Route::get('/internships/{id}/generate-certificate', [DocumentController::class, 'generateCertificate']);

    // Interviews (stagiaire/rh/admin)
    Route::middleware('role:stagiaire,rh,admin')->group(function () {
        Route::apiResource('interviews', InterviewController::class);
    });

    // <<<<<<<<<<< ROUTES D'ADMINISTRATION (UNIQUEMENT PAR 'admin')
    Route::middleware('role:admin')->group(function () {
        // Utilisez apiResource pour toutes les actions CRUD
        Route::apiResource('admin/users', AdminController::class);
    });
    // >>>>>>>>>>> FIN DES ROUTES D'ADMINISTRATION 

    // USERS (protection par rôle, exemple admin/rh)
    Route::middleware('role:admin,rh')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });

    // Stages
    Route::apiResource('stages', StageController::class);

    // Présences (Accès limité)
    Route::middleware('role:stagiaire,supervisor,admin')->group(function () {
        Route::apiResource('presences', PresenceController::class);
    });

    // Rapports
    Route::apiResource('reports', ReportController::class);

    // Badges (stagiaire/rh/admin)
    Route::middleware('role:stagiaire,rh,admin')->group(function () {
        Route::apiResource('badges', BadgeController::class);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/{id}', [NotificationController::class, 'show']);
        Route::post('/', [NotificationController::class, 'store']);
        Route::put('/{id}', [NotificationController::class, 'update']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/read-all', [NotificationController::class, 'markAllAsRead']);
    });

    // Messages
    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'index']);
        Route::get('/{id}', [MessageController::class, 'show']);
        Route::post('/', [MessageController::class, 'store']);
        Route::put('/{id}', [MessageController::class, 'update']);
        Route::delete('/{id}', [MessageController::class, 'destroy']);
        Route::get('/conversation/{userId}', [MessageController::class, 'getConversation']);
    });

    // Ressources RH
    Route::apiResource('rh', RHController::class);

    // Ressources Stagiaires
    Route::apiResource('stagiaires', StagiaireController::class);

    // Ressources Encadreurs
    Route::apiResource('encadreurs', EncadreurController::class);

    // Routes spécifiques par rôle
    Route::middleware('role:rh')->group(function () {
        Route::post('/rh/applications', [RHController::class, 'processApplication']);
    });

    Route::middleware('role:encadreur')->group(function () {
        Route::get('/encadreur/my-interns', [EncadreurController::class, 'myInterns']);
    });

    Route::middleware('role:stagiaire')->group(function () {
        Route::get('/stagiaire/my-profile', [StagiaireController::class, 'myProfile']);
    });
});