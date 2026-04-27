<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'type',
        'template_name',
        'template_id',
        'status',
        'downloads',
        'content',
        'ats_score',
    ];

    protected $casts = [
        'content'   => 'array',
        'downloads' => 'integer',
        'ats_score' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function views()
    {
        return $this->hasMany(DocumentView::class);
    }

    public function scopeCvs(Builder $query): Builder
    {
        return $query->where('type', 'cv');
    }

    public function scopeMotivationLetters(Builder $query): Builder
    {
        return $query->where('type', 'motivation_letter');
    }

    public function scopeComplete(Builder $query): Builder
    {
        return $query->where('status', 'complete');
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft');
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }
}
