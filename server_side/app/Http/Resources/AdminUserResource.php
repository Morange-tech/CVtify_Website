<?php

namespace App\Http\Resources;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $status = 'active';

        if ($this->is_suspended) {
            $status = 'suspended';
        } elseif (!$this->is_active) {
            $status = 'inactive';
        }

        return [
            'id' => 'ADM-' . str_pad((string) $this->id, 3, '0', STR_PAD_LEFT),
            'dbId' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'status' => $status,
            'avatar' => null,
            'lastLogin' => optional($this->last_login_at)?->toISOString(),
            'createdAt' => optional($this->created_at)?->toISOString(),
            'actionsCount' => ActivityLog::where('user_id', $this->id)->count(),
            'isCurrent' => $request->user()?->id === $this->id,
            'twoFactorEnabled' => (bool) $this->two_factor_enabled,
        ];
    }
}
