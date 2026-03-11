<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsPremium
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();

    if (!$user) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    // Check expiration first
    if ($user->subscription_expires_at &&
        now()->greaterThan($user->subscription_expires_at)) {

        $user->update([
            'plan' => 'free',
            'subscription_status' => 'inactive',
            'subscription_expires_at' => null,
        ]);

        return response()->json([
            'message' => 'Subscription expired'
        ], 403);
    }

    if ($user->subscription_status !== 'active') {
        return response()->json([
            'message' => 'Premium subscription required'
        ], 403);
    }

    return $next($request);
}
}
