<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cv extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'template_name',
        'content',
        'is_public',
        'public_token',
        'downloads',
    ];

    protected $casts = [
        'content' => 'array',
        'is_public' => 'boolean',
        'downloads' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function downloadHistories()
    {
        return $this->morphMany(\App\Models\DownloadHistory::class, 'downloadable');
    }
}
