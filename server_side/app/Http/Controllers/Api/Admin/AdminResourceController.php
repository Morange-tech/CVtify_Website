<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Faq;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminResourceController extends Controller
{
    private const TYPES = ['cv_guide', 'cover_letter_tip', 'interview_prep', 'career_advice'];

    // ─── Resources (guides / tips / prep / advice) ───────────────

    /**
     * GET /api/admin/resources?type=
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'type' => ['sometimes', Rule::in(self::TYPES)],
        ]);

        $query = Resource::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $resources = $query->orderBy('type')->orderBy('sort_order')->get()
            ->map(fn (Resource $r) => $this->format($r));

        return response()->json([
            'resources' => $resources,
        ]);
    }

    /**
     * POST /api/admin/resources
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', Rule::in(self::TYPES)],
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'read_time' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'checklist' => 'nullable|array',
            'checklist.*' => 'string|max:255',
        ]);

        $nextSortOrder = (Resource::where('type', $validated['type'])->max('sort_order') ?? 0) + 1;

        $resource = Resource::create([
            ...$validated,
            'is_featured' => $request->boolean('is_featured'),
            'is_published' => $request->boolean('is_published', true),
            'sort_order' => $nextSortOrder,
        ]);

        ActivityLog::log(
            'resource',
            "Resource \"{$resource->title}\" was created",
            $request->user()->id,
            ['resource_id' => $resource->id]
        );

        return response()->json([
            'message' => "Resource \"{$resource->title}\" created!",
            'resource' => $this->format($resource),
        ], 201);
    }

    /**
     * PUT /api/admin/resources/{resource}
     */
    public function update(Request $request, Resource $resource): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['sometimes', Rule::in(self::TYPES)],
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:2000',
            'read_time' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'sometimes|boolean',
            'is_published' => 'sometimes|boolean',
            'checklist' => 'nullable|array',
            'checklist.*' => 'string|max:255',
        ]);

        $resource->update($validated);

        ActivityLog::log(
            'resource',
            "Resource \"{$resource->title}\" was updated",
            $request->user()->id,
            ['resource_id' => $resource->id]
        );

        return response()->json([
            'message' => "Resource \"{$resource->title}\" updated!",
            'resource' => $this->format($resource),
        ]);
    }

    /**
     * DELETE /api/admin/resources/{resource}
     */
    public function destroy(Request $request, Resource $resource): JsonResponse
    {
        $title = $resource->title;
        $resource->delete();

        ActivityLog::log('resource', "Resource \"{$title}\" was deleted", $request->user()->id);

        return response()->json(['message' => "Resource \"{$title}\" deleted."]);
    }

    /**
     * PATCH /api/admin/resources/{resource}/toggle-published
     */
    public function togglePublished(Request $request, Resource $resource): JsonResponse
    {
        $resource->is_published = !$resource->is_published;
        $resource->save();

        return response()->json([
            'message' => $resource->is_published ? 'Resource published.' : 'Resource unpublished.',
            'resource' => $this->format($resource),
        ]);
    }

    /**
     * PATCH /api/admin/resources/{resource}/toggle-featured
     */
    public function toggleFeatured(Request $request, Resource $resource): JsonResponse
    {
        $resource->is_featured = !$resource->is_featured;
        $resource->save();

        return response()->json([
            'message' => $resource->is_featured ? 'Resource featured.' : 'Resource unfeatured.',
            'resource' => $this->format($resource),
        ]);
    }

    // ─── FAQ (resources page) ─────────────────────────────────────

    /**
     * GET /api/admin/resources/faqs
     */
    public function faqIndex(): JsonResponse
    {
        $faqs = Faq::where('page', 'resources')->orderBy('sort_order')->get();

        return response()->json(['faqs' => $faqs]);
    }

    /**
     * POST /api/admin/resources/faqs
     */
    public function faqStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string|max:5000',
            'is_active' => 'boolean',
        ]);

        $nextSortOrder = (Faq::where('page', 'resources')->max('sort_order') ?? 0) + 1;

        $faq = Faq::create([
            'page' => 'resources',
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $nextSortOrder,
        ]);

        return response()->json(['message' => 'FAQ created!', 'faq' => $faq], 201);
    }

    /**
     * PUT /api/admin/resources/faqs/{faq}
     */
    public function faqUpdate(Request $request, Faq $faq): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'sometimes|string|max:500',
            'answer' => 'sometimes|string|max:5000',
            'is_active' => 'sometimes|boolean',
        ]);

        $faq->update($validated);

        return response()->json(['message' => 'FAQ updated!', 'faq' => $faq]);
    }

    /**
     * DELETE /api/admin/resources/faqs/{faq}
     */
    public function faqDestroy(Faq $faq): JsonResponse
    {
        $faq->delete();

        return response()->json(['message' => 'FAQ deleted.']);
    }

    /**
     * PATCH /api/admin/resources/faqs/{faq}/toggle-active
     */
    public function faqToggleActive(Faq $faq): JsonResponse
    {
        $faq->is_active = !$faq->is_active;
        $faq->save();

        return response()->json([
            'message' => $faq->is_active ? 'FAQ activated.' : 'FAQ deactivated.',
            'faq' => $faq,
        ]);
    }

    // ─── Private Helpers ────────────────────────────────────────

    private function format(Resource $r): array
    {
        return [
            'id' => $r->id,
            'type' => $r->type,
            'title' => $r->title,
            'description' => $r->description,
            'readTime' => $r->read_time,
            'icon' => $r->icon,
            'category' => $r->category,
            'isFeatured' => $r->is_featured,
            'isPublished' => $r->is_published,
            'checklist' => $r->checklist,
            'sortOrder' => $r->sort_order,
            'createdAt' => $r->created_at?->format('Y-m-d'),
        ];
    }
}
