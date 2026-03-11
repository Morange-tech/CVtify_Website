<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TemplateCollection;
use App\Http\Resources\TemplateResource;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index(Request $request): TemplateCollection
    {
        $request->validate([
            'filter'   => 'sometimes|string|in:all,free,premium,popular',
            'category' => 'sometimes|string|in:creative,professional,simple',
        ]);

        $templates = Template::active()
            ->when(
                $request->filled('filter') && $request->filter !== 'all',
                fn ($q) => $q->filter($request->filter)
            )
            ->when(
                $request->filled('category'),
                fn ($q) => $q->byCategory($request->category)
            )
            ->with('wishlistedBy:id')
            ->orderBy('sort_order')
            ->orderByDesc('rating')
            ->get();

        return new TemplateCollection($templates);
    }

    public function show(Template $template): TemplateResource
    {
        $template->load('wishlistedBy:id');
        return new TemplateResource($template);
    }

    public function toggleWishlist(Request $request, Template $template): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication required'
            ], 401);
        }

        $exists = $user->wishlistedTemplates()
                       ->where('template_id', $template->id)
                       ->exists();

        if ($exists) {
            $user->wishlistedTemplates()->detach($template->id);
            $isWishlisted = false;
            $message = 'Template removed from wishlist';
        } else {
            $user->wishlistedTemplates()->attach($template->id);
            $isWishlisted = true;
            $message = 'Template added to wishlist';
        }

        return response()->json([
            'message'       => $message,
            'is_wishlisted' => $isWishlisted,
        ]);
    }

    public function userWishlist(Request $request): TemplateCollection
    {
        $templates = $request->user()
            ->wishlistedTemplates()
            ->active()
            ->orderByDesc('template_wishlists.created_at')
            ->get();

        return new TemplateCollection($templates);
    }
}
