<?php

use App\Models\Cv;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('allows a free user to create up to 3 CVs', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    foreach (range(1, 3) as $i) {
        $this->postJson('/api/cvs', ['title' => "CV {$i}"])
            ->assertCreated()
            ->assertJsonPath('success', true);
    }

    expect(Cv::where('user_id', $user->id)->count())->toBe(3);
});

it('blocks a free user from creating a 4th CV', function () {
    $user = User::factory()->create();
    Cv::factory()->count(3)->create(['user_id' => $user->id]);
    Sanctum::actingAs($user);

    $this->postJson('/api/cvs', ['title' => 'CV 4'])
        ->assertStatus(403)
        ->assertJson([
            'success' => false,
            'message' => 'Free plan limit reached. Upgrade to create more CVs.',
        ]);

    expect(Cv::where('user_id', $user->id)->count())->toBe(3);
});

it('allows a premium user to create more than 3 CVs', function () {
    $user = User::factory()->premium()->create();
    Cv::factory()->count(3)->create(['user_id' => $user->id]);
    Sanctum::actingAs($user);

    $this->postJson('/api/cvs', ['title' => 'CV 4'])
        ->assertCreated()
        ->assertJsonPath('success', true);

    expect(Cv::where('user_id', $user->id)->count())->toBe(4);
});

it('blocks a free user from duplicating a CV past the 3 CV cap', function () {
    $user = User::factory()->create();
    $cvs = Cv::factory()->count(3)->create(['user_id' => $user->id]);
    Sanctum::actingAs($user);

    $this->postJson("/api/cvs/{$cvs->first()->id}/duplicate")
        ->assertStatus(403)
        ->assertJson([
            'success' => false,
            'message' => 'Free plan limit reached. Upgrade to duplicate more CVs.',
        ]);
});

it('allows a premium user to duplicate a CV past the 3 CV cap', function () {
    $user = User::factory()->premium()->create();
    $cvs = Cv::factory()->count(3)->create(['user_id' => $user->id]);
    Sanctum::actingAs($user);

    $this->postJson("/api/cvs/{$cvs->first()->id}/duplicate")
        ->assertCreated()
        ->assertJsonPath('success', true);
});

it('returns 404, not 403, when accessing another user\'s CV', function () {
    $owner = User::factory()->create();
    $cv = Cv::factory()->create(['user_id' => $owner->id]);

    $intruder = User::factory()->create();
    Sanctum::actingAs($intruder);

    $this->getJson("/api/cvs/{$cv->id}")->assertStatus(404);
    $this->patchJson("/api/cvs/{$cv->id}", ['title' => 'Hijacked'])->assertStatus(404);
    $this->deleteJson("/api/cvs/{$cv->id}")->assertStatus(404);

    $this->assertDatabaseHas('cvs', ['id' => $cv->id, 'title' => $cv->title]);
});
