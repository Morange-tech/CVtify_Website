<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class MotivationTemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'templateId' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'category' => $this->category,
            'description' => $this->description,
            'image' => $this->preview_image_url,
            'previewImage' => $this->preview_image_url,
            'isPremium' => (bool) $this->is_premium,
            'isFree' => !(bool) $this->is_premium,
            'isPublished' => (bool) $this->is_published,
            'uses' => (int) $this->uses,
            'downloads' => (int) $this->downloads,
            'rating' => (float) $this->rating,
            'badges' => array_values(array_filter([
                $this->is_premium ? 'premium' : 'free',
                $this->uses > 50 ? 'popular' : null,
            ])),
            'isWishlisted' => $user
                ? $this->wishlistedBy->contains('id', $user->id)
                : false,
        ];
    }
}
