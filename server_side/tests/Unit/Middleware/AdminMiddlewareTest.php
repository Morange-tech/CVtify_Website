<?php

use App\Http\Middleware\AdminMiddleware;
use App\Models\User;
use Illuminate\Http\Request;

it('rejects a non-admin user with 403', function () {
    $user = User::factory()->create(['role' => 'user']);
    $request = Request::create('/test');
    $request->setUserResolver(fn () => $user);

    $response = (new AdminMiddleware())->handle($request, fn ($req) => response()->json(['ok' => true]));

    expect($response->getStatusCode())->toBe(403);
    expect($response->getData(true)['message'])->toBe('Unauthorized. Admin access required.');
});

it('rejects an unauthenticated request with 403', function () {
    $request = Request::create('/test');
    $request->setUserResolver(fn () => null);

    $response = (new AdminMiddleware())->handle($request, fn ($req) => response()->json(['ok' => true]));

    expect($response->getStatusCode())->toBe(403);
});

it('allows an admin user through', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $request = Request::create('/test');
    $request->setUserResolver(fn () => $admin);

    $response = (new AdminMiddleware())->handle($request, fn ($req) => response()->json(['ok' => true]));

    expect($response->getStatusCode())->toBe(200);
});
