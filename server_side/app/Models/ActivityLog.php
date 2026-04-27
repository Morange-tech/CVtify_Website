<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'log_code',
        'user_id',
        'type',
        'severity',
        'action',
        'description',
        'actor',
        'actor_email',
        'actor_role',
        'target',
        'ip',
        'location',
        'device',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeRecent(Builder $query, int $limit = 10): Builder
    {
        return $query->orderByDesc('created_at')->limit($limit);
    }

    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeInPeriod(Builder $query, string $period): Builder
    {
        $date = match ($period) {
            '24h' => now()->subDay(),
            '7d'  => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            default => now()->subDays(7),
        };

        return $query->where('created_at', '>=', $date);
    }

    public static function log(
        string $type,
        string $description,
        ?int $userId = null,
        array $metadata = [],
        string $severity = 'info',
        ?string $action = null,
        ?string $target = null
    ): self {
        $user = $userId ? User::find($userId) : null;

        return self::create([
            'log_code' => 'LOG-' . strtoupper(uniqid()),
            'user_id' => $userId,
            'type' => $type,
            'severity' => $severity,
            'action' => $action ?? ucwords(str_replace('_', ' ', $type)),
            'description' => $description,
            'actor' => $user?->name ?? 'System',
            'actor_email' => $user?->email,
            'actor_role' => $user?->role ?? 'system',
            'target' => $target,
            'ip' => request()->ip(),
            'location' => null,
            'device' => request()->userAgent(),
            'metadata' => $metadata,
        ]);
    }
}
