<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cv>
 */
class CvFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->jobTitle() . ' CV',
            'template_name' => 'Default',
            'content' => [
                'personalInfo' => [
                    'firstName' => fake()->firstName(),
                    'lastName' => fake()->lastName(),
                    'email' => fake()->safeEmail(),
                ],
            ],
            'is_public' => false,
            'public_token' => Str::random(32),
            'downloads' => 0,
        ];
    }
}
