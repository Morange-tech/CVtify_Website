<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function activate(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $user->update([
            'plan' => 'premium',
            'subscription_status' => 'active',
            'subscription_expires_at' => now()->addMonth(),
        ]);

        return response()->json([
            'message' => 'User upgraded to premium successfully.',
            'user' => $user
        ]);
    }
}
