<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GroqService
{
    private const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

    public function generate(string $systemPrompt, string $userPrompt): string
    {
        $apiKey = config('services.groq.key');

        if (!$apiKey) {
            throw new RuntimeException('Groq API key is not configured.');
        }

        $response = Http::withToken($apiKey)
            ->timeout(20)
            ->post(self::ENDPOINT, [
                'model' => config('services.groq.model'),
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt],
                ],
                'temperature' => 0.7,
                'max_tokens' => 400,
            ]);

        if (!$response->successful()) {
            throw new RuntimeException('Groq API request failed: ' . $response->body());
        }

        $text = $response->json('choices.0.message.content');

        if (!$text) {
            throw new RuntimeException('Groq API returned no content.');
        }

        return trim($text);
    }

    public function generateJson(string $systemPrompt, string $userPrompt, int $maxTokens = 4000, int $timeout = 45): array
    {
        $apiKey = config('services.groq.key');

        if (!$apiKey) {
            throw new RuntimeException('Groq API key is not configured.');
        }

        $response = Http::withToken($apiKey)
            ->timeout($timeout)
            ->post(self::ENDPOINT, [
                'model' => config('services.groq.model'),
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt],
                ],
                'temperature' => 0,
                'max_tokens' => $maxTokens,
                'response_format' => ['type' => 'json_object'],
            ]);

        if (!$response->successful()) {
            throw new RuntimeException('Groq API request failed: ' . $response->body());
        }

        $content = $response->json('choices.0.message.content');

        if (!$content) {
            throw new RuntimeException('Groq API returned no content.');
        }

        $decoded = json_decode($content, true);

        if (!is_array($decoded) || json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException('Groq API returned non-JSON or malformed JSON content.');
        }

        return $decoded;
    }
}
