<?php

use App\Http\Controllers\Api\Admin\AdminLogController;
use App\Http\Controllers\Api\Admin\AdminManagementController;
use App\Http\Controllers\Api\Admin\AdminNotificationController;
use App\Http\Controllers\Api\Admin\AdminCvController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminSettingsController;
use App\Http\Controllers\Api\Admin\AdminTemplateController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\MotivationLetterTemplateController;
use App\Http\Controllers\Api\Admin\SupportTicketController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CvParseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\Admin\AdminResourceController;
use App\Http\Controllers\Api\MotivationTemplateController;
use App\Http\Controllers\Api\ResourceController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\SupportTicketController as ApiSupportTicketController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\User\AiController;
use App\Http\Controllers\Api\User\CvController;
use App\Http\Controllers\Api\User\DownloadHistoryController;
use App\Http\Controllers\Api\User\MotivationLetterController;
use App\Http\Controllers\Api\User\UpgradeContentController;
use App\Http\Controllers\LinkedInAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/login', function () {
    return response()->json([
        'message' => 'Unauthenticated.',
    ], 401);
})->name('login');

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
Route::get('/templates', [TemplateController::class, 'index']);
Route::get('/templates/{template}', [TemplateController::class, 'show']);
Route::get('/motivation-templates', [MotivationTemplateController::class, 'index']);
Route::get('/motivation-templates/{motivationTemplate}', [MotivationTemplateController::class, 'show']);
Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/public/motivation-letters/{token}', [MotivationLetterController::class, 'publicShow']);
Route::post('/cvs/parse', [CvParseController::class, 'parse'])->middleware('throttle:5,1');
Route::get('/auth/linkedin/redirect', [LinkedInAuthController::class, 'redirect']);
Route::get('/auth/linkedin/callback', [LinkedInAuthController::class, 'callback']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Authentication Required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [App\Http\Controllers\Api\AuthController::class, 'user']);
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::patch('/profile', [App\Http\Controllers\Api\AuthController::class, 'updateProfile']);
    Route::post('/change-password', [App\Http\Controllers\Api\AuthController::class, 'changePassword']);
    Route::delete('/account', [App\Http\Controllers\Api\AuthController::class, 'deleteAccount']);
    Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel']);
    Route::post('/admin/users/{id}/activate-premium', [\App\Http\Controllers\Api\Admin\SubscriptionController::class, 'activate']);
    Route::post('/templates/{template}/wishlist', [TemplateController::class, 'toggleWishlist']);
    Route::get('/user/wishlist', [TemplateController::class, 'userWishlist']);
    Route::post('/motivation-templates/{motivationTemplate}/wishlist', [MotivationTemplateController::class, 'toggleWishlist']);
    Route::get('/user/motivation-wishlist', [MotivationTemplateController::class, 'userWishlist']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/documents', [DashboardController::class, 'documents']);

    Route::get('/cvs', [CvController::class, 'index']);
    Route::post('/cvs', [CvController::class, 'store']);

    Route::get('/cvs/{cv}', [CvController::class, 'show'])->whereNumber('cv');
    Route::match(['put', 'patch'], '/cvs/{cv}', [CvController::class, 'update'])->whereNumber('cv');
    Route::patch('/cvs/{cv}/rename', [CvController::class, 'rename'])->whereNumber('cv');
    Route::post('/cvs/{cv}/duplicate', [CvController::class, 'duplicate'])->whereNumber('cv');
    Route::delete('/cvs/{cv}', [CvController::class, 'destroy'])->whereNumber('cv');
    Route::get('/cvs/{cv}/share', [CvController::class, 'share'])->whereNumber('cv');
    Route::get('/cvs/{cv}/download', [CvController::class, 'download'])->whereNumber('cv');
    Route::get('/cvs/{cv}/export-docx', [CvController::class, 'exportDocx'])->whereNumber('cv');

    Route::post('/ai/generate-text', [AiController::class, 'generateText'])->middleware('throttle:10,1');

    Route::get('/motivation-letters', [MotivationLetterController::class, 'index']);
    Route::post('/motivation-letters', [MotivationLetterController::class, 'store']);
    Route::get('/motivation-letters/{id}', [MotivationLetterController::class, 'show']);
    Route::patch('/motivation-letters/{id}', [MotivationLetterController::class, 'update']);
    Route::delete('/motivation-letters/{id}', [MotivationLetterController::class, 'destroy']);

    Route::post('/motivation-letters/{id}/duplicate', [MotivationLetterController::class, 'duplicate']);
    Route::post('/motivation-letters/{id}/share', [MotivationLetterController::class, 'share']);
    Route::post('/motivation-letters/{id}/download', [MotivationLetterController::class, 'incrementDownload']);

    Route::get('/downloads', [DownloadHistoryController::class, 'index']);
    Route::post('/downloads', [DownloadHistoryController::class, 'store']);
    Route::get('/downloads/{id}/file', [DownloadHistoryController::class, 'file'])->name('downloads.file'); // optional
    Route::delete('/downloads/{id}', [DownloadHistoryController::class, 'destroy']);
    Route::delete('/downloads', [DownloadHistoryController::class, 'clearAll']);

    Route::get('/upgrade-content', [UpgradeContentController::class, 'index']);
    Route::post('/support-tickets', [ApiSupportTicketController::class, 'store']);


    // ─── Admin Routes ───────────────────────────────────
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);

        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);
        Route::post('/premium-requests/{premiumRequest}/approve', [AdminDashboardController::class, 'approveRequest']);
        Route::post('/premium-requests/{premiumRequest}/reject', [AdminDashboardController::class, 'rejectRequest']);

        // Template Management
        Route::get('/templates', [AdminTemplateController::class, 'index']);
        Route::post('/templates', [AdminTemplateController::class, 'store']);
        Route::put('/templates/{template}', [AdminTemplateController::class, 'update']);
        Route::delete('/templates/{template}', [AdminTemplateController::class, 'destroy']);
        Route::patch('/templates/{template}/toggle-premium', [AdminTemplateController::class, 'togglePremium']);
        Route::patch('/templates/{template}/toggle-published', [AdminTemplateController::class, 'togglePublished']);
        Route::delete('/templates/{template}/image', [AdminTemplateController::class, 'removeImage']);

        // CV Management
        Route::get('/cvs', [AdminCvController::class, 'index']);
        Route::get('/cvs/{id}', [AdminCvController::class, 'show']);
        Route::delete('/cvs/{id}', [AdminCvController::class, 'destroy']);
        Route::post('/cvs/bulk-delete', [AdminCvController::class, 'bulkDelete']);

        // Support routes Management
        Route::get('/messages', [SupportTicketController::class, 'index']);
        Route::get('/messages/stats', [SupportTicketController::class, 'stats']);
        Route::post('/messages/{ticket}/reply', [SupportTicketController::class, 'reply']);
        Route::patch('/messages/{ticket}/status', [SupportTicketController::class, 'updateStatus']);
        Route::patch('/messages/{ticket}/toggle-read', [SupportTicketController::class, 'toggleRead']);
        Route::patch('/messages/{ticket}/toggle-star', [SupportTicketController::class, 'toggleStar']);
        Route::delete('/messages/{ticket}', [SupportTicketController::class, 'destroy']);

        // Notifications Management
        Route::get('/notifications', [AdminNotificationController::class, 'index']);
        Route::get('/notifications/stats', [AdminNotificationController::class, 'stats']);
        Route::get('/notifications/settings', [AdminNotificationController::class, 'settings']);
        Route::put('/notifications/settings', [AdminNotificationController::class, 'updateSettings']);
        Route::patch('/notifications/read-all', [AdminNotificationController::class, 'markAllRead']);
        Route::delete('/notifications/clear-read', [AdminNotificationController::class, 'clearRead']);
        Route::get('/notifications/{id}', [AdminNotificationController::class, 'show']);
        Route::patch('/notifications/{id}/read', [AdminNotificationController::class, 'markRead']);
        Route::patch('/notifications/{id}/pin', [AdminNotificationController::class, 'togglePin']);
        Route::delete('/notifications/{id}', [AdminNotificationController::class, 'destroy']);

        // Logs Management
        Route::get('/logs', [AdminLogController::class, 'index']);
        Route::get('/logs/stats', [AdminLogController::class, 'stats']);
        Route::post('/logs/clear', [AdminLogController::class, 'clear']);
        Route::get('/logs/{id}', [AdminLogController::class, 'show'])->whereNumber('id');
        Route::delete('/logs/{id}', [AdminLogController::class, 'destroy'])->whereNumber('id');

        // Settings Management
        Route::get('/settings', [AdminSettingsController::class, 'index']);
        Route::put('/settings', [AdminSettingsController::class, 'update']);
        Route::post('/settings/reset', [AdminSettingsController::class, 'reset']);

        // Admin Management
        Route::get('/admins', [AdminManagementController::class, 'index']);
        Route::get('/admins/stats', [AdminManagementController::class, 'stats']);
        Route::get('/admins/{id}', [AdminManagementController::class, 'show']);
        Route::post('/admins', [AdminManagementController::class, 'store']);
        Route::put('/admins/{id}', [AdminManagementController::class, 'update']);
        Route::patch('/admins/{id}/role', [AdminManagementController::class, 'updateRole']);
        Route::patch('/admins/{id}/status', [AdminManagementController::class, 'updateStatus']);
        Route::delete('/admins/{id}', [AdminManagementController::class, 'destroy']);

        // Resources (guides / tips / prep / advice + FAQ)
        Route::get('/resources/faqs', [AdminResourceController::class, 'faqIndex']);
        Route::post('/resources/faqs', [AdminResourceController::class, 'faqStore']);
        Route::put('/resources/faqs/{faq}', [AdminResourceController::class, 'faqUpdate']);
        Route::delete('/resources/faqs/{faq}', [AdminResourceController::class, 'faqDestroy']);
        Route::patch('/resources/faqs/{faq}/toggle-active', [AdminResourceController::class, 'faqToggleActive']);

        Route::get('/resources', [AdminResourceController::class, 'index']);
        Route::post('/resources', [AdminResourceController::class, 'store']);
        Route::put('/resources/{resource}', [AdminResourceController::class, 'update']);
        Route::delete('/resources/{resource}', [AdminResourceController::class, 'destroy']);
        Route::patch('/resources/{resource}/toggle-published', [AdminResourceController::class, 'togglePublished']);
        Route::patch('/resources/{resource}/toggle-featured', [AdminResourceController::class, 'toggleFeatured']);

        // Motivation Letter Templates
        Route::get('/motivation-letter-templates', [MotivationLetterTemplateController::class, 'index']);
        Route::post('/motivation-letter-templates', [MotivationLetterTemplateController::class, 'store']);
        // static routes FIRST if you have any
        Route::get('/motivation-letter-templates/stats', [MotivationLetterTemplateController::class, 'stats']);
        // dynamic routes AFTER
        Route::get('/motivation-letter-templates/{motivationLetterTemplate}', [MotivationLetterTemplateController::class, 'show']);
        Route::post('/motivation-letter-templates/{motivationLetterTemplate}', [MotivationLetterTemplateController::class, 'update']);
        Route::delete('/motivation-letter-templates/{motivationLetterTemplate}', [MotivationLetterTemplateController::class, 'destroy']);
        Route::patch('/motivation-letter-templates/{motivationLetterTemplate}/toggle-premium', [MotivationLetterTemplateController::class, 'togglePremium']);
        Route::patch('/motivation-letter-templates/{motivationLetterTemplate}/toggle-published', [MotivationLetterTemplateController::class, 'togglePublished']);
    });
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
