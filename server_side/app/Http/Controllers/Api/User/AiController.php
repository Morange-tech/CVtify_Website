<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Services\GroqService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function generateText(Request $request, GroqService $groq): JsonResponse
    {
        $data = $request->validate([
            'content_type' => 'required|string|in:profile,education,experience,additional_section',
            'section_label' => 'nullable|string|max:100',
            'mode' => 'required|string|in:generate,improve',
            'existing_text' => 'nullable|string|max:2000',
            'context' => 'nullable|array',
            'context.*' => 'nullable|string|max:200',
            'max_length' => 'nullable|integer|min:20|max:5000',
        ]);

        $maxLength = $data['max_length'] ?? null;

        $systemPrompt = 'You are a professional CV-writing assistant. Write concise, achievement-oriented '
            . 'CV content (no markdown, no headings, no bullet characters, plain prose only). '
            . 'Write in the same language as the information you are given.'
            . ($maxLength ? " Your response must be no longer than {$maxLength} characters, including spaces." : '');

        $label = $data['section_label'] ?? $this->defaultLabel($data['content_type']);

        $contextLines = collect($data['context'] ?? [])
            ->filter(fn ($value) => filled($value))
            ->map(fn ($value, $key) => "{$key}: {$value}")
            ->implode("\n");

        $userPrompt = "Section: {$label}\n";

        if ($contextLines) {
            $userPrompt .= "Known details:\n{$contextLines}\n";
        }

        if ($data['mode'] === 'improve' && filled($data['existing_text'] ?? null)) {
            $userPrompt .= "Improve the following text: fix grammar/phrasing and make it more professional, "
                . "but keep the same facts and meaning — do not invent new information and do not replace it "
                . "with unrelated content. Return only the improved version.\n\nText:\n"
                . $data['existing_text'];
        } else {
            $userPrompt .= 'Write a new description for this section from the details above.';
        }

        if ($maxLength) {
            $userPrompt .= "\n\n(Stay within {$maxLength} characters.)";
        }

        $text = $groq->generate($systemPrompt, $userPrompt);

        if ($maxLength) {
            $text = $this->truncateToLength($text, $maxLength);
        }

        return response()->json(['text' => $text]);
    }

    /**
     * Hard safety net in case the model doesn't respect the requested length —
     * cuts at the last whole word/sentence within the limit rather than mid-word.
     */
    private function truncateToLength(string $text, int $maxLength): string
    {
        if (mb_strlen($text) <= $maxLength) {
            return $text;
        }

        $truncated = mb_substr($text, 0, $maxLength);

        $lastPeriod = mb_strrpos($truncated, '.');
        if ($lastPeriod !== false && $lastPeriod > $maxLength * 0.5) {
            return mb_substr($truncated, 0, $lastPeriod + 1);
        }

        $lastSpace = mb_strrpos($truncated, ' ');

        return $lastSpace !== false ? mb_substr($truncated, 0, $lastSpace) : $truncated;
    }

    private function defaultLabel(string $contentType): string
    {
        return match ($contentType) {
            'profile' => 'Profile summary',
            'education' => 'Education description',
            'experience' => 'Job experience description',
            default => 'CV section',
        };
    }
}
