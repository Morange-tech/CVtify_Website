<?php

use App\Models\MotivationLetter;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('allows a free user to create up to 3 motivation letters', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    foreach (range(1, 3) as $i) {
        $this->postJson('/api/motivation-letters', ['title' => "Letter {$i}"])->assertCreated();
    }

    expect(MotivationLetter::where('user_id', $user->id)->count())->toBe(3);
});

/**
 * Unlike the CV cap (403, success:false), the motivation-letter cap returns
 * 422 with a plain {message} body — a real inconsistency in this codebase,
 * asserted here as current behavior rather than "fixed" to match CV's shape.
 */
it('blocks a free user from creating a 4th motivation letter with a 422', function () {
    $user = User::factory()->create();
    MotivationLetter::factory()->count(3)->create(['user_id' => $user->id]);
    Sanctum::actingAs($user);

    $this->postJson('/api/motivation-letters', ['title' => 'Letter 4'])
        ->assertStatus(422)
        ->assertJson(['message' => 'You have reached the free plan limit of 3 letters.']);

    expect(MotivationLetter::where('user_id', $user->id)->count())->toBe(3);
});

it('allows a premium user to create more than 3 motivation letters', function () {
    $user = User::factory()->premium()->create();
    MotivationLetter::factory()->count(3)->create(['user_id' => $user->id]);
    Sanctum::actingAs($user);

    $this->postJson('/api/motivation-letters', ['title' => 'Letter 4'])->assertCreated();

    expect(MotivationLetter::where('user_id', $user->id)->count())->toBe(4);
});

it('blocks a free user from duplicating a letter past the 3 letter cap', function () {
    $user = User::factory()->create();
    $letters = MotivationLetter::factory()->count(3)->create(['user_id' => $user->id]);
    Sanctum::actingAs($user);

    $this->postJson("/api/motivation-letters/{$letters->first()->id}/duplicate")
        ->assertStatus(422)
        ->assertJson(['message' => 'You have reached the free plan limit of 3 letters.']);
});
