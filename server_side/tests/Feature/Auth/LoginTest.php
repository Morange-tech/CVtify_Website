<?php

use App\Models\User;

it('logs in with valid credentials and returns the expected user shape', function () {
    $user = User::factory()->create(['password' => bcrypt('correct-password')]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'correct-password',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'message',
            'user' => ['id', 'name', 'email', 'plan', 'subscription_status', 'subscription_expires_at', 'role'],
            'token',
        ])
        ->assertJsonPath('user.id', $user->id);

    $user->refresh();
    expect($user->last_login_at)->not->toBeNull();
});

it('rejects login with an incorrect password', function () {
    $user = User::factory()->create(['password' => bcrypt('correct-password')]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors('email');
});

it('rejects login for an unknown email', function () {
    $response = $this->postJson('/api/login', [
        'email' => 'nobody@example.com',
        'password' => 'whatever',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors('email');
});

it('requires authentication to fetch the current user', function () {
    $this->getJson('/api/user')->assertStatus(401);
});

it('returns the authenticated user for a valid token', function () {
    $user = User::factory()->create();

    Laravel\Sanctum\Sanctum::actingAs($user);

    $this->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('user.id', $user->id);
});
