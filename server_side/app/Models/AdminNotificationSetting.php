<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminNotificationSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_user_id',
        'new_user',
        'premium_request',
        'payment',
        'new_message',
        'sound',
        'desktop',
        'email',
    ];

    protected $casts = [
        'new_user' => 'boolean',
        'premium_request' => 'boolean',
        'payment' => 'boolean',
        'new_message' => 'boolean',
        'sound' => 'boolean',
        'desktop' => 'boolean',
        'email' => 'boolean',
    ];

    public function adminUser()
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }
}
