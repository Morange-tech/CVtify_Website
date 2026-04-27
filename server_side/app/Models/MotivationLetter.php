<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotivationLetter extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'company',
        'position',
        'linked_cv',
        'content',
        'status',
        'downloads',
        'share_token',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
