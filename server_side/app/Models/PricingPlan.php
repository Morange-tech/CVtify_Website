<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'currency',
        'monthly_price',
        'yearly_price',
        'short_description',
        'is_active',
        'is_recommended',
        'sort_order',
        'meta',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_recommended' => 'boolean',
        'meta' => 'array',
    ];
}
