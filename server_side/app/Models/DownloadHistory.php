<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DownloadHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'downloadable_type',
        'downloadable_id',
        'type',
        'file_name',
        'format',
        'file_size_bytes',
        'template',
        'is_premium_quality',
        'has_watermark',
        'file_path',
        'downloaded_at',
    ];

    protected $casts = [
        'downloaded_at' => 'datetime',
        'is_premium_quality' => 'boolean',
        'has_watermark' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function downloadable()
    {
        return $this->morphTo();
    }
}
