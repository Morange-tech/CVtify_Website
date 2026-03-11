<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'slug'         => $this->slug,
            'category'     => $this->category,
            'image'        => $this->image_url,
            'badges'       => $this->badges ?? [],
            'rating'       => (float) $this->rating,
            'uses'         => $this->uses_count,
            'isFree'       => $this->is_free,
            'templateId'   => $this->template_id,
            'isWishlisted' => $user
                ? $this->wishlistedBy->contains('id', $user->id)
                : false,
        ];
    }
}
