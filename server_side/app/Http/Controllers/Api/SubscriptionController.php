<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function activate(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        // plan/subscription_status/subscription_expires_at aren't in $fillable,
        // so forceFill is required for this mass update to actually persist.
        $user->forceFill([
            'plan' => 'premium',
            'subscription_status' => 'active',
            'subscription_expires_at' => now()->addMonth(),
            'plan_expires_at' => now()->addMonth(),
        ])->save();

        return response()->json([
            'message' => 'User upgraded to premium successfully.',
            'user' => $user
        ]);
    }

    /**
     * Cancel the authenticated user's premium subscription. Access remains
     * active until plan_expires_at (no refund), matching the settings page's
     * "access continues until the end of your billing period" messaging.
     */
    public function cancel(Request $request)
    {
        $user = $request->user();

        if (!$user->isPremium()) {
            return response()->json([
                'message' => 'You do not have an active premium subscription.',
            ], 422);
        }

        $user->forceFill([
            'subscription_status' => 'inactive',
        ])->save();

        ActivityLog::log('subscription_cancelled', "{$user->name} cancelled their premium subscription", $user->id);

        return response()->json([
            'message' => 'Subscription cancelled. Access continues until the end of your billing period.',
            'accessUntil' => optional($user->plan_expires_at)->toISOString(),
        ]);
    }
}
