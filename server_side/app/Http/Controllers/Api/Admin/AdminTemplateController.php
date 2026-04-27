<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminTemplateController extends Controller
{
    /**
     * GET /api/admin/templates?search=&tab=all&category=all&sort=popular
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'search'   => 'sometimes|string|max:255',
            'tab'      => 'sometimes|string|in:all,premium,free,unpublished',
            'category' => 'sometimes|string',
            'sort'     => 'sometimes|string|in:popular,newest,name,downloads,rating',
        ]);

        $query = Template::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Tab filter
        $tab = $request->get('tab', 'all');
        switch ($tab) {
            case 'premium':
                $query->where('is_free', false);
                break;
            case 'free':
                $query->where('is_free', true);
                break;
            case 'unpublished':
                $query->where('is_active', false);
                break;
        }

        // Category filter
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Sort
        $sort = $request->get('sort', 'popular');
        switch ($sort) {
            case 'popular':
                $query->orderByDesc('uses_count_raw');
                break;
            case 'newest':
                $query->orderByDesc('created_at');
                break;
            case 'name':
                $query->orderBy('name');
                break;
            case 'downloads':
                $query->orderByDesc('downloads_count');
                break;
            case 'rating':
                $query->orderByDesc('rating');
                break;
            default:
                $query->orderByDesc('sort_order');
        }

        $templates = $query->get()->map(fn ($t) => $this->formatTemplate($t));

        // Stats
        $allTemplates = Template::all();
        $stats = [
            'total'       => $allTemplates->count(),
            'premium'     => $allTemplates->where('is_free', false)->count(),
            'free'        => $allTemplates->where('is_free', true)->count(),
            'published'   => $allTemplates->where('is_active', true)->count(),
            'unpublished' => $allTemplates->where('is_active', false)->count(),
            'totalUses'   => $allTemplates->sum('uses_count_raw'),
        ];

        return response()->json([
            'templates' => $templates,
            'stats'     => $stats,
        ]);
    }

    /**
     * POST /api/admin/templates
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'description' => 'nullable|string|max:1000',
            'is_premium'  => 'boolean',
            'is_published' => 'boolean',
            'preview_image' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:5120',
        ]);

        // Find next template_id
        $nextTemplateId = (Template::max('template_id') ?? 0) + 1;
        $nextSortOrder = (Template::max('sort_order') ?? 0) + 1;

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('preview_image')) {
            $imagePath = $request->file('preview_image')
                ->store('templates', 'public');
        }

        $template = Template::create([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'category'    => $request->category,
            'description' => $request->description,
            'image_path'  => $imagePath,
            'badges'      => $this->generateBadges($request->boolean('is_premium'), true),
            'rating'      => 0,
            'uses_count'  => '0',
            'uses_count_raw' => 0,
            'downloads_count' => 0,
            'is_free'     => !$request->boolean('is_premium'),
            'is_active'   => $request->boolean('is_published', true),
            'template_id' => $nextTemplateId,
            'sort_order'  => $nextSortOrder,
        ]);

        ActivityLog::log(
            'template',
            "Template \"{$template->name}\" was created",
            $request->user()->id,
            ['template_id' => $template->id]
        );

        return response()->json([
            'message'  => "Template \"{$template->name}\" created!",
            'template' => $this->formatTemplate($template),
        ], 201);
    }

    /**
     * PUT /api/admin/templates/{template}
     */
    public function update(Request $request, Template $template): JsonResponse
    {
        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'category'    => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:1000',
            'is_premium'  => 'sometimes|boolean',
            'is_published' => 'sometimes|boolean',
            'preview_image' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:5120',
        ]);

        // Handle image upload
        if ($request->hasFile('preview_image')) {
            // Delete old image
            if ($template->image_path && Storage::disk('public')->exists($template->image_path)) {
                Storage::disk('public')->delete($template->image_path);
            }
            $template->image_path = $request->file('preview_image')
                ->store('templates', 'public');
        }

        if ($request->has('name')) {
            $template->name = $request->name;
            $template->slug = Str::slug($request->name);
        }

        if ($request->has('category')) {
            $template->category = $request->category;
        }

        if ($request->has('description')) {
            $template->description = $request->description;
        }

        if ($request->has('is_premium')) {
            $template->is_free = !$request->boolean('is_premium');
            $template->badges = $this->generateBadges(
                $request->boolean('is_premium'),
                false,
                $template->badges
            );
        }

        if ($request->has('is_published')) {
            $template->is_active = $request->boolean('is_published');
        }

        $template->save();

        ActivityLog::log(
            'template',
            "Template \"{$template->name}\" was updated",
            $request->user()->id,
            ['template_id' => $template->id]
        );

        return response()->json([
            'message'  => "Template \"{$template->name}\" updated!",
            'template' => $this->formatTemplate($template),
        ]);
    }

    /**
     * DELETE /api/admin/templates/{template}
     */
    public function destroy(Request $request, Template $template): JsonResponse
    {
        $name = $template->name;

        // Delete image
        if ($template->image_path && Storage::disk('public')->exists($template->image_path)) {
            Storage::disk('public')->delete($template->image_path);
        }

        $template->delete();

        ActivityLog::log(
            'template',
            "Template \"{$name}\" was deleted",
            $request->user()->id
        );

        return response()->json([
            'message' => "Template \"{$name}\" deleted.",
        ]);
    }

    /**
     * PATCH /api/admin/templates/{template}/toggle-premium
     */
    public function togglePremium(Request $request, Template $template): JsonResponse
    {
        $template->is_free = !$template->is_free;
        $template->badges = $this->generateBadges(
            !$template->is_free,
            false,
            $template->badges
        );
        $template->save();

        $status = $template->is_free ? 'Free' : 'Premium';

        ActivityLog::log(
            'template',
            "\"{$template->name}\" set to {$status}",
            $request->user()->id
        );

        return response()->json([
            'message'  => "\"{$template->name}\" set to {$status}.",
            'template' => $this->formatTemplate($template),
        ]);
    }

    /**
     * PATCH /api/admin/templates/{template}/toggle-published
     */
    public function togglePublished(Request $request, Template $template): JsonResponse
    {
        $template->is_active = !$template->is_active;
        $template->save();

        $status = $template->is_active ? 'published' : 'unpublished';

        ActivityLog::log(
            'template',
            "\"{$template->name}\" was {$status}",
            $request->user()->id
        );

        return response()->json([
            'message'  => "\"{$template->name}\" {$status}.",
            'template' => $this->formatTemplate($template),
        ]);
    }

    /**
     * DELETE /api/admin/templates/{template}/image
     */
    public function removeImage(Request $request, Template $template): JsonResponse
    {
        if ($template->image_path && Storage::disk('public')->exists($template->image_path)) {
            Storage::disk('public')->delete($template->image_path);
        }

        $template->update(['image_path' => null]);

        return response()->json([
            'message' => 'Image removed.',
        ]);
    }

    // ─── Private Helpers ────────────────────────────────────

    private function formatTemplate(Template $template): array
    {
        return [
            'id'           => $template->id,
            'name'         => $template->name,
            'slug'         => $template->slug,
            'category'     => $template->category,
            'description'  => $template->description,
            'isPremium'    => !$template->is_free,
            'isPublished'  => $template->is_active,
            'previewImage' => $template->image_url ?: null,
            'uses'         => $template->uses_count_raw ?? 0,
            'downloads'    => $template->downloads_count ?? 0,
            'rating'       => (float) $template->rating,
            'badges'       => $template->badges ?? [],
            'templateId'   => $template->template_id,
            'createdAt'    => $template->created_at?->format('Y-m-d'),
            'updatedAt'    => $template->updated_at?->format('Y-m-d'),
        ];
    }

    private function generateBadges(bool $isPremium, bool $isNew, ?array $existingBadges = null): array
    {
        $badges = [];

        if ($isPremium) {
            $badges[] = 'premium';
        } else {
            $badges[] = 'free';
        }

        if ($isNew) {
            $badges[] = 'new';
        }

        // Preserve 'popular' from existing badges
        if ($existingBadges && in_array('popular', $existingBadges)) {
            $badges[] = 'popular';
        }

        return array_unique($badges);
    }
}
