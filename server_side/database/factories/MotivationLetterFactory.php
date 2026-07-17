<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MotivationLetter>
 */
class MotivationLetterFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->jobTitle() . ' Letter',
            'company' => fake()->company(),
            'position' => fake()->jobTitle(),
            'content' => fake()->paragraphs(3, true),
            'status' => 'draft',
            'downloads' => 0,
        ];
    }
}
