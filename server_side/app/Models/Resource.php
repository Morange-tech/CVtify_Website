<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        'type',
        'title',
        'description',
        'read_time',
        'icon',
        'category',
        'is_featured',
        'checklist',
        'sort_order',
        'is_published',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'checklist' => 'array',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
