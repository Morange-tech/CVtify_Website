<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->log_code ?: (string) $this->id,
            'dbId' => $this->id,
            'type' => $this->type,
            'severity' => $this->severity ?? 'info',
            'action' => $this->action ?? ucwords(str_replace('_', ' ', $this->type)),
            'details' => $this->description,
            'actor' => $this->actor ?? $this->user?->name ?? 'Unknown',
            'actorEmail' => $this->actor_email ?? $this->user?->email ?? '',
            'actorRole' => $this->actor_role ?? $this->user?->role ?? 'user',
            'target' => $this->target,
            'ip' => $this->ip,
            'location' => $this->location,
            'device' => $this->device,
            'metadata' => $this->metadata ?? [],
            'timestamp' => optional($this->created_at)->toISOString(),
            'createdAt' => optional($this->created_at)->toISOString(),
            'updatedAt' => optional($this->updated_at)->toISOString(),
        ];
    }
}
