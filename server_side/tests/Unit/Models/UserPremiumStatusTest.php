<?php

use App\Models\User;

it('is premium when plan is premium and there is no expiry', function () {
    $user = User::factory()->create();
    $user->forceFill(['plan' => 'premium', 'plan_expires_at' => null])->save();

    expect($user->isPremium())->toBeTrue();
});

it('is premium when plan is premium and the expiry is in the future', function () {
    $user = User::factory()->create();
    $user->forceFill(['plan' => 'premium', 'plan_expires_at' => now()->addMonth()])->save();

    expect($user->isPremium())->toBeTrue();
});

it('is not premium when the plan expiry is in the past', function () {
    $user = User::factory()->create();
    $user->forceFill(['plan' => 'premium', 'plan_expires_at' => now()->subDay()])->save();

    expect($user->isPremium())->toBeFalse();
});

it('is not premium on the free plan', function () {
    $user = User::factory()->create();

    // `plan` isn't in the factory definition, so the in-memory model doesn't
    // carry the DB column default until reloaded — refresh() picks up 'free'.
    $user->refresh();

    expect($user->plan)->toBe('free');
    expect($user->isPremium())->toBeFalse();
});

it('identifies admins via the role column', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $regular = User::factory()->create(['role' => 'user']);

    expect($admin->isAdmin())->toBeTrue();
    expect($regular->isAdmin())->toBeFalse();
});
