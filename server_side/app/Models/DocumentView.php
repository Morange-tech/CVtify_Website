<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentView extends Model
{
    protected $fillable = [
        'document_id',
        'ip_address',
        'user_agent',
        'time_spent_seconds',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
