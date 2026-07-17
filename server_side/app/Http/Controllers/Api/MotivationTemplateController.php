<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MotivationTemplateCollection;
use App\Http\Resources\MotivationTemplateResource;
use App\Models\MotivationLetterTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MotivationTemplateController extends Controller
{
    public function index(Request $request): MotivationTemplateCollection
    {
        $request->validate([
            'filter'   => 'sometimes|string|in:all,free,premium,popular',
            'category' => 'sometimes|string',
        ]);

        $templates = MotivationLetterTemplate::query()
            ->published()
            ->when(
                $request->filled('filter') && $request->filter !== 'all',
                function ($q) use ($request) {
                    match ($request->filter) {
                        'free' => $q->free(),
                        'premium' => $q->premium(),
                        'popular' => $q->orderByDesc('uses'),
                        default => null,
                    };
                }
            )
            ->when(
                $request->filled('category'),
                fn($q) => $q->byCategory($request->category)
            )
            ->with('wishlistedBy:id')
            ->orderByDesc('rating')
            ->orderByDesc('created_at')
            ->get();

        return new MotivationTemplateCollection($templates);
    }

    public function show(MotivationLetterTemplate $motivationTemplate): MotivationTemplateResource
    {
        $motivationTemplate->load('wishlistedBy:id');

        return new MotivationTemplateResource($motivationTemplate);
    }

    public function toggleWishlist(Request $request, MotivationLetterTemplate $motivationTemplate): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Authentication required'], 401);
        }

        $exists = $user->wishlistedMotivationTemplates()
            ->where('motivation_template_id', $motivationTemplate->id)
            ->exists();

        if ($exists) {
            $user->wishlistedMotivationTemplates()->detach($motivationTemplate->id);
            $isWishlisted = false;
            $message = 'Template removed from wishlist';
        } else {
            $user->wishlistedMotivationTemplates()->attach($motivationTemplate->id);
            $isWishlisted = true;
            $message = 'Template added to wishlist';
        }

        return response()->json([
            'message' => $message,
            'is_wishlisted' => $isWishlisted,
        ]);
    }

    public function userWishlist(Request $request): MotivationTemplateCollection
    {
        $templates = $request->user()
            ->wishlistedMotivationTemplates()
            ->published()
            ->orderByDesc('motivation_template_wishlists.created_at')
            ->get();

        return new MotivationTemplateCollection($templates);
    }
}
