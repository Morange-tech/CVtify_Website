<?php

use App\Models\Cv;
use App\Models\User;
use App\Services\CvDocxExporter;
use PhpOffice\PhpWord\IOFactory;

it('exports a CV with a rich content payload to a real, re-openable docx file', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->create([
        'user_id' => $user->id,
        'content' => [
            'personalInfo' => [
                'firstName' => 'Ada',
                'lastName' => 'Lovelace',
                'email' => 'ada@example.com',
                'phoneNumber' => '+44 20 7946 0958',
            ],
            'profile' => '<p>Mathematician & <strong>writer</strong></p>',
            'experience' => [
                [
                    'position' => 'Analytical Engineer',
                    'employer' => 'Analytical Engine Ltd',
                    'city' => 'London',
                    'startMonth' => '01',
                    'startYear' => '1843',
                    'isPresent' => false,
                    'endMonth' => '12',
                    'endYear' => '1843',
                    'description' => 'Wrote the first algorithm intended for machine processing.',
                ],
            ],
            'education' => [
                ['education' => 'Mathematics', 'school' => 'Self-taught', 'city' => '', 'description' => ''],
            ],
            'skills' => [['skill' => 'Algorithms', 'level' => '06']],
            'languages' => [['language' => 'English', 'level' => '06']],
            'interests' => [['interest' => 'Mathematics']],
            'customSections' => [
                ['title' => 'Notes', 'type' => 'description', 'description' => 'A custom section.'],
            ],
            'signature' => [
                ['city' => 'London', 'date' => '1843-01-01', 'signatureType' => 'type', 'signature' => 'A. Lovelace'],
            ],
        ],
    ]);

    $path = (new CvDocxExporter())->export($cv);

    expect(file_exists($path))->toBeTrue();
    expect(substr(file_get_contents($path), 0, 2))->toBe('PK');

    // A malformed docx would throw when PhpWord tries to re-parse it.
    $reopened = IOFactory::load($path);
    expect($reopened)->toBeInstanceOf(\PhpOffice\PhpWord\PhpWord::class);

    @unlink($path);
});

it('exports an empty CV without error, producing a minimal valid docx', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->create(['user_id' => $user->id, 'content' => []]);

    $path = (new CvDocxExporter())->export($cv);

    expect(file_exists($path))->toBeTrue();
    IOFactory::load($path);

    @unlink($path);
});
