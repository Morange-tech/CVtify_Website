<?php

use App\Models\Cv;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('downloads a docx export for the owner and increments the download counter', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->create([
        'user_id' => $user->id,
        'title' => 'My Software Engineer CV',
        'downloads' => 0,
    ]);
    Sanctum::actingAs($user);

    $response = $this->get("/api/cvs/{$cv->id}/export-docx");

    $response->assertOk();
    $response->assertDownload('my-software-engineer-cv.docx');
    expect($response->headers->get('content-type'))->toContain('application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    $cv->refresh();
    expect($cv->downloads)->toBe(1);

    // response()->download() doesn't stream (and thus doesn't delete) the file
    // during a test call, so the temp path is still readable here — verify it's
    // a real docx (zip signature) and re-openable by PhpWord, then clean it up.
    $path = $response->baseResponse->getFile()->getPathname();
    expect(file_exists($path))->toBeTrue();
    expect(substr(file_get_contents($path), 0, 2))->toBe('PK');
    \PhpOffice\PhpWord\IOFactory::load($path);
    @unlink($path);
});

it('returns 404 when exporting another user\'s CV', function () {
    $owner = User::factory()->create();
    $cv = Cv::factory()->create(['user_id' => $owner->id]);

    $intruder = User::factory()->create();
    Sanctum::actingAs($intruder);

    $this->get("/api/cvs/{$cv->id}/export-docx")->assertStatus(404);
});

it('requires authentication to export a docx', function () {
    $cv = Cv::factory()->create();

    $this->get("/api/cvs/{$cv->id}/export-docx")->assertStatus(401);
});
