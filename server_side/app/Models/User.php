<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'provider',
        'provider_id',
        'avatar',
        'is_active',
        'is_suspended',
        'email_verified_at',
        'two_factor_enabled',
        'last_login_at',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'plan_expires_at'   => 'datetime',
            'password' => 'hashed',
            'max_cvs'           => 'integer',
            'is_active' => 'boolean',
            'is_suspended' => 'boolean',
            'two_factor_enabled' => 'boolean',
            'last_login_at' => 'datetime',

        ];
    }

    // ─── Relationships ──────────────────────────────

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function cvs()
    {
        return $this->hasMany(Document::class)->where('type', 'cv');
    }

    public function motivationLetters()
    {
        return $this->hasMany(Document::class)->where('type', 'motivation_letter');
    }

    public function wishlistedTemplates()
    {
        return $this->belongsToMany(Template::class, 'template_wishlists')
            ->withTimestamps();
    }

    public function wishlistedMotivationTemplates()
    {
        return $this->belongsToMany(MotivationTemplate::class, 'motivation_template_wishlists')
            ->withTimestamps();
    }

    // ─── Helpers ────────────────────────────────────

    public function isPremium(): bool
    {
        return $this->plan === 'premium'
            && ($this->plan_expires_at === null || $this->plan_expires_at->isFuture());
    }

    public function getCvsCreatedCount(): int
    {
        return $this->cvs()->count();
    }

    public function getTotalDownloads(): int
    {
        return $this->documents()->sum('downloads');
    }

    public function getStorageUsage(): array
    {
        $used = $this->documents()->count();
        $max  = $this->isPremium() ? 100 : 10;

        return [
            'used'    => $used,
            'max'     => $max,
            'percent' => $max > 0 ? round(($used / $max) * 100) : 0,
            'label'   => $this->isPremium() ? 'Premium plan: 100 CVs max' : 'Free plan: 10 CVs max',
        ];
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function premiumRequests()
    {
        return $this->hasMany(PremiumRequest::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function supportTickets()
    {
        return $this->hasMany(\App\Models\SupportTicket::class);
    }

    public function downloadHistories()
    {
        return $this->hasMany(\App\Models\DownloadHistory::class);
    }
}
