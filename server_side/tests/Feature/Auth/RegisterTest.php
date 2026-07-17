<?php

use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

it('registers a new user and returns a token', function () {
    Mail::fake();

    $response = $this->postJson('/api/register', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['message', 'user', 'token'])
        ->assertJsonPath('user.email', 'jane@example.com');

    $this->assertDatabaseHas('users', ['email' => 'jane@example.com']);

    $user = User::where('email', 'jane@example.com')->first();
    expect($user->plan)->toBe('free');
    expect($user->subscription_status)->toBe('inactive');

    Mail::assertSent(WelcomeEmail::class, fn ($mail) => $mail->user->is($user));
});

it('rejects registration with a duplicate email', function () {
    Mail::fake();
    User::factory()->create(['email' => 'taken@example.com']);

    $response = $this->postJson('/api/register', [
        'name' => 'Someone Else',
        'email' => 'taken@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors('email');
});

it('rejects registration when the password confirmation does not match', function () {
    Mail::fake();

    $response = $this->postJson('/api/register', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'password123',
        'password_confirmation' => 'different',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors('password');
});

it('rejects registration with missing required fields', function () {
    Mail::fake();

    $response = $this->postJson('/api/register', []);

    $response->assertStatus(422)->assertJsonValidationErrors(['name', 'email', 'password']);
});
