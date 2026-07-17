<?php

use App\Models\Cv;
use App\Models\DownloadHistory;
use App\Models\MotivationLetter;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('updates the authenticated user profile', function () {
    $user = User::factory()->create(['name' => 'Old Name', 'email' => 'old@example.com']);
    Sanctum::actingAs($user);

    $this->patchJson('/api/profile', [
        'name' => 'New Name',
        'email' => 'new@example.com',
    ])->assertOk()->assertJsonPath('user.name', 'New Name');

    $this->assertDatabaseHas('users', ['id' => $user->id, 'email' => 'new@example.com']);
});

it('allows updating a profile without changing its own email (unique check excludes self)', function () {
    $user = User::factory()->create(['email' => 'me@example.com']);
    Sanctum::actingAs($user);

    $this->patchJson('/api/profile', [
        'name' => 'Same Email',
        'email' => 'me@example.com',
    ])->assertOk();
});

it('rejects a profile update that collides with another user email', function () {
    User::factory()->create(['email' => 'taken@example.com']);
    $user = User::factory()->create(['email' => 'me@example.com']);
    Sanctum::actingAs($user);

    $this->patchJson('/api/profile', [
        'name' => 'Me',
        'email' => 'taken@example.com',
    ])->assertStatus(422)->assertJsonValidationErrors('email');
});

it('changes the password when the current password is correct', function () {
    $user = User::factory()->create(['password' => bcrypt('old-password')]);
    Sanctum::actingAs($user);

    $this->postJson('/api/change-password', [
        'current_password' => 'old-password',
        'new_password' => 'new-password-123',
        'new_password_confirmation' => 'new-password-123',
    ])->assertOk();

    expect(Illuminate\Support\Facades\Hash::check('new-password-123', $user->fresh()->password))->toBeTrue();
});

it('rejects a password change with the wrong current password', function () {
    $user = User::factory()->create(['password' => bcrypt('old-password')]);
    Sanctum::actingAs($user);

    $this->postJson('/api/change-password', [
        'current_password' => 'wrong-password',
        'new_password' => 'new-password-123',
        'new_password_confirmation' => 'new-password-123',
    ])->assertStatus(422)->assertJsonValidationErrors('current_password');
});

it('deletes the account and cascades owned resources', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->create(['user_id' => $user->id]);
    $letter = MotivationLetter::factory()->create(['user_id' => $user->id]);
    DownloadHistory::create([
        'user_id' => $user->id,
        'downloadable_id' => $cv->id,
        'downloadable_type' => Cv::class,
        'type' => 'cv',
        'file_name' => 'cv.pdf',
        'format' => 'PDF',
        'is_premium_quality' => false,
        'has_watermark' => true,
    ]);
    $user->createToken('device-a');

    Sanctum::actingAs($user);

    $this->deleteJson('/api/account')->assertOk();

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
    $this->assertDatabaseMissing('cvs', ['id' => $cv->id]);
    $this->assertDatabaseMissing('motivation_letters', ['id' => $letter->id]);
    $this->assertDatabaseMissing('download_histories', ['user_id' => $user->id]);
    $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $user->id]);
});
