<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MotivationLetterTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MotivationLetterTemplateController  extends Controller
{
    // ─── List with filters, search, sort ───
    public function index(Request $request): JsonResponse
    {
        try {
            $query = MotivationLetterTemplate::query();

            // Tab filter
            $tab = $request->input('tab', 'all');
            match ($tab) {
                'premium'     => $query->premium(),
                'free'        => $query->free(),
                'unpublished' => $query->unpublished(),
                default       => null,
            };

            // Category filter
            $category = $request->input('category', 'all');
            if ($category !== 'all') {
                $query->byCategory($category);
            }

            // Search
            $search = $request->input('search', '');
            if (!empty($search)) {
                $query->search($search);
            }

            // Sort
            $sort = $request->input('sort', 'newest');
            $query->sorted($sort);

            $templates = $query->get();

            // Stats (always calculated from full table)
            $stats = $this->getStats();

            return response()->json([
                'success'   => true,
                'templates' => $templates->map(fn($t) => $this->formatTemplate($t)),
                'stats'     => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('MotivationLetterTemplate index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch motivation letter templates.',
            ], 500);
        }
    }

    // ─── Create ───
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'category'     => 'required|string|in:professional,creative,executive,formal,simple,academic',
            'description'  => 'nullable|string|max:1000',
            'is_premium'   => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
            'preview_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('preview_image')) {
                $data['preview_image'] = $request->file('preview_image')
                    ->store('motivation-letter-templates', 'public');
            }

            $template = MotivationLetterTemplate::create($data);

            return response()->json([
                'success'  => true,
                'message'  => "Template \"{$template->name}\" created successfully.",
                'template' => $this->formatTemplate($template),
                'stats'    => $this->getStats(),
            ], 201);
        } catch (\Exception $e) {
            Log::error('MotivationLetterTemplate store error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create template.',
            ], 500);
        }
    }

    // ─── Show single ───
    public function show(MotivationLetterTemplate $motivationLetterTemplate): JsonResponse
    {
        return response()->json([
            'success'  => true,
            'template' => $this->formatTemplate($motivationLetterTemplate),
        ]);
    }

    // ─── Update ───
    public function update(Request $request, MotivationLetterTemplate $motivationLetterTemplate): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'         => 'sometimes|required|string|max:255',
            'category'     => 'sometimes|required|string|in:professional,creative,executive,formal,simple,academic',
            'description'  => 'nullable|string|max:1000',
            'is_premium'   => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
            'preview_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $data = $validator->validated();

            // Handle new image upload
            if ($request->hasFile('preview_image')) {
                // Delete old image
                if ($motivationLetterTemplate->preview_image) {
                    Storage::disk('public')->delete($motivationLetterTemplate->preview_image);
                }
                $data['preview_image'] = $request->file('preview_image')
                    ->store('motivation-letter-templates', 'public');
            }

            $motivationLetterTemplate->update($data);

            return response()->json([
                'success'  => true,
                'message'  => "Template \"{$motivationLetterTemplate->name}\" updated successfully.",
                'template' => $this->formatTemplate($motivationLetterTemplate->fresh()),
                'stats'    => $this->getStats(),
            ]);
        } catch (\Exception $e) {
            Log::error('MotivationLetterTemplate update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update template.',
            ], 500);
        }
    }

    // ─── Delete ───
    public function destroy(MotivationLetterTemplate $motivationLetterTemplate): JsonResponse
    {
        try {
            $name = $motivationLetterTemplate->name;

            // Delete associated image
            if ($motivationLetterTemplate->preview_image) {
                Storage::disk('public')->delete($motivationLetterTemplate->preview_image);
            }

            $motivationLetterTemplate->delete();

            return response()->json([
                'success' => true,
                'message' => "Template \"{$name}\" deleted successfully.",
                'stats'   => $this->getStats(),
            ]);
        } catch (\Exception $e) {
            Log::error('MotivationLetterTemplate destroy error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete template.',
            ], 500);
        }
    }

    // ─── Toggle Premium ───
    public function togglePremium(MotivationLetterTemplate $motivationLetterTemplate): JsonResponse
    {
        try {
            $motivationLetterTemplate->update([
                'is_premium' => !$motivationLetterTemplate->is_premium,
            ]);

            $status = $motivationLetterTemplate->is_premium ? 'Premium' : 'Free';

            return response()->json([
                'success'  => true,
                'message'  => "\"{$motivationLetterTemplate->name}\" is now {$status}.",
                'template' => $this->formatTemplate($motivationLetterTemplate->fresh()),
                'stats'    => $this->getStats(),
            ]);
        } catch (\Exception $e) {
            Log::error('MotivationLetterTemplate togglePremium error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle premium status.',
            ], 500);
        }
    }

    // ─── Toggle Published ───
    public function togglePublished(MotivationLetterTemplate $motivationLetterTemplate): JsonResponse
    {
        try {
            $motivationLetterTemplate->update([
                'is_published' => !$motivationLetterTemplate->is_published,
            ]);

            $status = $motivationLetterTemplate->is_published ? 'Published' : 'Unpublished';

            return response()->json([
                'success'  => true,
                'message'  => "\"{$motivationLetterTemplate->name}\" is now {$status}.",
                'template' => $this->formatTemplate($motivationLetterTemplate->fresh()),
                'stats'    => $this->getStats(),
            ]);
        } catch (\Exception $e) {
            Log::error('MotivationLetterTemplate togglePublished error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle publish status.',
            ], 500);
        }
    }

    // ─── Stats helper ───
    private function getStats(): array
    {
        return [
            'total'       => MotivationLetterTemplate::count(),
            'premium'     => MotivationLetterTemplate::premium()->count(),
            'free'        => MotivationLetterTemplate::free()->count(),
            'published'   => MotivationLetterTemplate::published()->count(),
            'unpublished' => MotivationLetterTemplate::unpublished()->count(),
            'totalUses'   => (int) MotivationLetterTemplate::sum('uses'),
        ];
    }

    // ─── Format template for API response ───
    private function formatTemplate(MotivationLetterTemplate $template): array
    {
        return [
            'id'           => $template->id,
            'name'         => $template->name,
            'slug'         => $template->slug,
            'category'     => $template->category,
            'description'  => $template->description,
            'previewImage' => $template->preview_image_url,
            'isPremium'    => $template->is_premium,
            'isPublished'  => $template->is_published,
            'uses'         => $template->uses,
            'downloads'    => $template->downloads,
            'rating'       => (float) $template->rating,
            'metadata'     => $template->metadata,
            'createdAt'    => $template->created_at?->toISOString(),
            'updatedAt'    => $template->updated_at?->toISOString(),
        ];
    }
}
