<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;

class ResourceController extends Controller
{
    /**
     * GET /api/resources
     */
    public function index(): JsonResponse
    {
        $resources = Resource::published()->orderBy('sort_order')->get();

        $format = fn (Resource $r) => [
            'id' => $r->id,
            'title' => $r->title,
            'description' => $r->description,
            'readTime' => $r->read_time,
            'icon' => $r->icon,
            'category' => $r->category,
            'featured' => $r->is_featured,
            'checklist' => $r->checklist,
        ];

        $faqs = Faq::query()
            ->where('page', 'resources')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Faq $f) => [
                'id' => $f->id,
                'question' => $f->question,
                'answer' => $f->answer,
            ]);

        return response()->json([
            'data' => [
                'cvGuides' => $resources->where('type', 'cv_guide')->values()->map($format),
                'coverLetterTips' => $resources->where('type', 'cover_letter_tip')->values()->map($format),
                'interviewPrep' => $resources->where('type', 'interview_prep')->values()->map($format),
                'careerAdvice' => $resources->where('type', 'career_advice')->values()->map($format),
                'faqs' => $faqs,
            ],
        ]);
    }
}
