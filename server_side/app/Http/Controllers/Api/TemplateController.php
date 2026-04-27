<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TemplateCollection;
use App\Http\Resources\TemplateResource;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class TemplateController extends Controller
{

    #[OA\Get(
        path: "/api/templates",
        summary: "Get all templates",
        tags: ["Templates"],
        parameters: [
            new OA\Parameter(
                name: "filter",
                description: "Filter templates",
                in: "query",
                required: false,
                schema: new OA\Schema(
                    type: "string",
                    enum: ["all","free","premium","popular"],
                    example: "all"
                )
            ),
            new OA\Parameter(
                name: "category",
                description: "Template category",
                in: "query",
                required: false,
                schema: new OA\Schema(
                    type: "string",
                    enum: ["creative","professional","simple"],
                    example: "creative"
                )
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Templates retrieved successfully"
            ),
            new OA\Response(
                response: 401,
                description: "Unauthenticated"
            )
        ]
    )]
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


    #[OA\Get(
        path: "/api/templates/{template}",
        summary: "Get a single template",
        tags: ["Templates"],
        parameters: [
            new OA\Parameter(
                name: "template",
                description: "Template ID",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Template retrieved successfully"),
            new OA\Response(response: 404, description: "Template not found")
        ]
    )]
    public function show(Template $template): TemplateResource
    {
        $template->load('wishlistedBy:id');
        return new TemplateResource($template);
    }


    #[OA\Post(
        path: "/api/templates/{template}/wishlist",
        summary: "Toggle template wishlist",
        tags: ["Templates"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "template",
                description: "Template ID",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer", example: 1)
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Wishlist updated"),
            new OA\Response(response: 401, description: "Authentication required")
        ]
    )]
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


    #[OA\Get(
        path: "/api/user/wishlist",
        summary: "Get user's wishlisted templates",
        tags: ["Templates"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Wishlist retrieved successfully"),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
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
