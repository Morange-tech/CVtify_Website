<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TemplateCollection extends ResourceCollection
{
    public $collects = TemplateResource::class;

    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total'   => $this->collection->count(),
                'filters' => [
                    ['label' => 'All Templates', 'value' => 'all'],
                    ['label' => 'Free',          'value' => 'free'],
                    ['label' => 'Premium',       'value' => 'premium'],
                    ['label' => 'Popular',       'value' => 'popular'],
                ],
            ],
        ];
    }
}
