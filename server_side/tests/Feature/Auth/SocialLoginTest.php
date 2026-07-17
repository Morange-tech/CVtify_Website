<?php

use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

it('creates a new user on first social login', function () {
    Mail::fake();

    $response = $this->postJson('/api/social-login', [
        'provider' => 'google',
        'provider_id' => 'google-123',
        'name' => 'New Social User',
        'email' => 'social@example.com',
        'avatar' => 'https://example.com/avatar.jpg',
    ]);

    $response->assertOk()
        ->assertJsonPath('is_new_user', true)
        ->assertJsonStructure(['message', 'user', 'token']);

    $this->assertDatabaseHas('users', [
        'email' => 'social@example.com',
        'provider' => 'google',
        'provider_id' => 'google-123',
    ]);

    Mail::assertSent(WelcomeEmail::class);
});

it('logs in an existing social user without creating a duplicate', function () {
    Mail::fake();
    $user = User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->postJson('/api/social-login', [
        'provider' => 'linkedin',
        'provider_id' => 'li-456',
        'name' => $user->name,
        'email' => 'existing@example.com',
        'avatar' => null,
    ]);

    $response->assertOk()->assertJsonPath('is_new_user', false);

    expect(User::where('email', 'existing@example.com')->count())->toBe(1);
});

/**
 * Characterization test: socialLogin() matches purely by email and updates
 * provider/provider_id on any existing user with that email, with no check
 * that the account was previously a social account or owned by this caller.
 * A password-based account can have its provider info silently overwritten
 * by an unauthenticated POST with a matching email. This documents current
 * behavior; fixing it is a separate follow-up, not part of this test suite.
 */
it('overwrites provider info on an existing password-based account matched by email', function () {
    Mail::fake();
    $user = User::factory()->create([
        'email' => 'passwordowner@example.com',
        'provider' => null,
        'provider_id' => null,
    ]);

    $this->postJson('/api/social-login', [
        'provider' => 'google',
        'provider_id' => 'attacker-controlled-id',
        'name' => 'Anyone',
        'email' => 'passwordowner@example.com',
        'avatar' => null,
    ])->assertOk();

    $user->refresh();
    expect($user->provider)->toBe('google');
    expect($user->provider_id)->toBe('attacker-controlled-id');
});

it('rejects social login with an invalid provider', function () {
    $this->postJson('/api/social-login', [
        'provider' => 'facebook',
        'provider_id' => '123',
        'name' => 'Someone',
        'email' => 'someone@example.com',
    ])->assertStatus(422)->assertJsonValidationErrors('provider');
});
