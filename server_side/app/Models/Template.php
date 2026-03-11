<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'image_path',
        'badges',
        'rating',
        'uses_count',
        'is_free',
        'is_active',
        'template_id',
        'sort_order',
    ];

    protected $casts = [
        'badges'    => 'array',
        'rating'    => 'decimal:1',
        'is_free'   => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): string
    {
        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }
        return asset('storage/' . $this->image_path);
    }

    public function wishlistedBy()
    {
        return $this->belongsToMany(User::class, 'template_wishlists')
                     ->withTimestamps();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFree(Builder $query): Builder
    {
        return $query->where('is_free', true);
    }

    public function scopePremium(Builder $query): Builder
    {
        return $query->where('is_free', false);
    }

    public function scopePopular(Builder $query): Builder
    {
        return $query->whereJsonContains('badges', 'popular');
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeFilter(Builder $query, string $filter): Builder
    {
        return match ($filter) {
            'free'    => $query->free(),
            'premium' => $query->premium(),
            'popular' => $query->popular(),
            default   => $query,
        };
    }
}
