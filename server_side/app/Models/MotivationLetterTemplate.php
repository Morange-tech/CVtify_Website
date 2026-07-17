<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MotivationLetterTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'preview_image',
        'is_premium',
        'is_published',
        'uses',
        'downloads',
        'rating',
        'metadata',
    ];

    protected $casts = [
        'is_premium'   => 'boolean',
        'is_published' => 'boolean',
        'uses'         => 'integer',
        'downloads'    => 'integer',
        'rating'       => 'decimal:1',
        'metadata'     => 'array',
    ];

    protected $appends = ['preview_image_url'];

    // ─── Auto-generate slug ───
    protected static function booted(): void
    {
        static::creating(function (self $template) {
            if (empty($template->slug)) {
                $template->slug = self::generateUniqueSlug($template->name);
            }
        });

        static::updating(function (self $template) {
            if ($template->isDirty('name')) {
                $template->slug = self::generateUniqueSlug($template->name, $template->id);
            }
        });
    }

    private static function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $counter = 1;

        $query = self::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = "{$original}-{$counter}";
            $counter++;
            $query = self::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }

    // ─── Accessor ───
    public function getPreviewImageUrlAttribute(): ?string
    {
        if (!$this->preview_image) {
            return null;
        }

        if (Str::startsWith($this->preview_image, ['http://', 'https://'])) {
            return $this->preview_image;
        }

        return asset('storage/' . $this->preview_image);
    }

    // ─── Scopes ───
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeUnpublished($query)
    {
        return $query->where('is_published', false);
    }

    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    public function scopeFree($query)
    {
        return $query->where('is_premium', false);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
                ->orWhere('description', 'LIKE', "%{$term}%")
                ->orWhere('category', 'LIKE', "%{$term}%");
        });
    }

    public function scopeSorted($query, string $sort = 'newest')
    {
        return match ($sort) {
            'popular'   => $query->orderByDesc('uses'),
            'name'      => $query->orderBy('name'),
            'downloads' => $query->orderByDesc('downloads'),
            'rating'    => $query->orderByDesc('rating'),
            'oldest'    => $query->orderBy('created_at'),
            default     => $query->orderByDesc('created_at'), // newest
        };
    }

    // ─── Helpers ───
    public function incrementUses(): void
    {
        $this->increment('uses');
    }

    public function incrementDownloads(): void
    {
        $this->increment('downloads');
    }

    public function wishlistedBy()
    {
        return $this->belongsToMany(
            \App\Models\User::class,
            'motivation_template_wishlists',
            'motivation_template_id',
            'user_id'
        )->withTimestamps();
    }
}
