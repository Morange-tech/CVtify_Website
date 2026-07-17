<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

it('sends a password reset link for a known email', function () {
    Notification::fake();
    $user = User::factory()->create();

    $this->postJson('/api/forgot-password', ['email' => $user->email])
        ->assertOk()
        ->assertJsonPath('message', 'Password reset link sent to your email');

    Notification::assertSentTo($user, ResetPassword::class);
});

it('rejects a password reset link request for an unknown email', function () {
    Notification::fake();

    $this->postJson('/api/forgot-password', ['email' => 'nobody@example.com'])
        ->assertStatus(422)
        ->assertJsonValidationErrors('email');
});

it('resets the password with a valid token', function () {
    $user = User::factory()->create(['password' => bcrypt('old-password')]);

    $token = Password::createToken($user);

    $this->postJson('/api/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'brand-new-password',
        'password_confirmation' => 'brand-new-password',
    ])->assertOk()->assertJsonPath('message', 'Password has been reset successfully');

    expect(Hash::check('brand-new-password', $user->fresh()->password))->toBeTrue();
});

it('rejects a password reset with an invalid token', function () {
    $user = User::factory()->create();

    $this->postJson('/api/reset-password', [
        'token' => 'not-a-real-token',
        'email' => $user->email,
        'password' => 'brand-new-password',
        'password_confirmation' => 'brand-new-password',
    ])->assertStatus(422)->assertJsonValidationErrors('email');
});
