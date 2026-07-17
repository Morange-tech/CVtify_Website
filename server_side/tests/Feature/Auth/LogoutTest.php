<?php

use App\Models\User;

it('logs out and deletes only the current access token', function () {
    $user = User::factory()->create();

    $tokenA = $user->createToken('device-a')->plainTextToken;
    $tokenB = $user->createToken('device-b')->plainTextToken;

    expect($user->tokens()->count())->toBe(2);

    $this->withHeader('Authorization', "Bearer {$tokenA}")
        ->postJson('/api/logout')
        ->assertOk()
        ->assertJsonPath('message', 'Logged out successfully');

    expect($user->tokens()->count())->toBe(1);

    // Sanctum's guard memoizes the resolved user for the lifetime of the test's
    // service container, so it must be reset before authenticating as a
    // different token within the same test.
    $this->app['auth']->forgetGuards();

    // The other device's token is untouched and still works.
    $this->withHeader('Authorization', "Bearer {$tokenB}")
        ->getJson('/api/user')
        ->assertOk();

    $this->app['auth']->forgetGuards();

    // The logged-out token no longer authenticates.
    $this->withHeader('Authorization', "Bearer {$tokenA}")
        ->getJson('/api/user')
        ->assertStatus(401);
});

it('requires authentication to log out', function () {
    $this->postJson('/api/logout')->assertStatus(401);
});
