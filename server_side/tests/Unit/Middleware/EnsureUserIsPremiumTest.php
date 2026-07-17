<?php

use App\Http\Middleware\EnsureUserIsPremium;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * This middleware exists but is not wired into routes/api.php (verified during
 * research) — it's tested directly here since it's real, reachable code, not
 * because any route currently depends on it.
 */
$requestFor = function (User $user): Request {
    $request = Request::create('/test');
    $request->setUserResolver(fn () => $user);

    return $request;
};

it('passes through for an active, unexpired subscription', function () use ($requestFor) {
    $user = User::factory()->create();
    $user->forceFill(['subscription_status' => 'active', 'subscription_expires_at' => now()->addMonth()])->save();

    $middleware = new EnsureUserIsPremium();
    $response = $middleware->handle($requestFor($user), fn ($req) => response()->json(['ok' => true]));

    expect($response->getStatusCode())->toBe(200);
});

/**
 * Characterization test: the middleware's "auto-downgrade on expiry" calls
 * $user->update(['plan' => 'free', 'subscription_status' => 'inactive', ...]),
 * but none of those columns are in User::$fillable, so update() silently
 * discards them (no strict mass-assignment mode is configured in this app).
 * The 403 response is still returned, but the downgrade never actually
 * persists to the database. Documented here as-is; fixing it (e.g. via
 * forceFill()) is a follow-up, not part of this test suite.
 */
it('returns 403 on expiry, but the DB downgrade silently no-ops (fillable bug)', function () use ($requestFor) {
    $user = User::factory()->create();
    $user->forceFill(['plan' => 'premium', 'subscription_status' => 'active', 'subscription_expires_at' => now()->subDay()])->save();

    $middleware = new EnsureUserIsPremium();
    $response = $middleware->handle($requestFor($user), fn ($req) => response()->json(['ok' => true]));

    expect($response->getStatusCode())->toBe(403);
    expect($response->getData(true)['message'])->toBe('Subscription expired');

    $user->refresh();
    expect($user->plan)->toBe('premium');
    expect($user->subscription_status)->toBe('active');
    expect($user->subscription_expires_at)->not->toBeNull();
});

it('rejects with 403 when the subscription is not active', function () use ($requestFor) {
    $user = User::factory()->create();
    $user->forceFill(['subscription_status' => 'inactive'])->save();

    $middleware = new EnsureUserIsPremium();
    $response = $middleware->handle($requestFor($user), fn ($req) => response()->json(['ok' => true]));

    expect($response->getStatusCode())->toBe(403);
    expect($response->getData(true)['message'])->toBe('Premium subscription required');
});

it('rejects with 401 when there is no authenticated user', function () {
    $request = Request::create('/test');
    $request->setUserResolver(fn () => null);

    $middleware = new EnsureUserIsPremium();
    $response = $middleware->handle($request, fn ($req) => response()->json(['ok' => true]));

    expect($response->getStatusCode())->toBe(401);
});
