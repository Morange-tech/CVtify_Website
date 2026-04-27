<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class MotivationTemplateCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total'   => $this->collection->count(),
                'filters' => [
                    ['label' => 'All Templates', 'value' => 'all'],
                    ['label' => 'Free',           'value' => 'free'],
                    ['label' => 'Premium',        'value' => 'premium'],
                    ['label' => 'Popular',        'value' => 'popular'],
                ],
            ],
        ];
    }
}
