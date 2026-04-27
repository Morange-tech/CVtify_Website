<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Document;
use App\Models\PremiumRequest;
use App\Models\Template;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    /**
     * GET /api/admin/dashboard?period=7d
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'period' => 'sometimes|string|in:24h,7d,30d,90d',
        ]);

        $period = $request->get('period', '7d');

        return response()->json([
            'stats'            => $this->getStats($period),
            'recentActivity'   => $this->getRecentActivity(),
            'pendingRequests'  => $this->getPendingRequests(),
            'topTemplates'     => $this->getTopTemplates($period),
            'revenueBreakdown' => $this->getRevenueBreakdown($period),
            'userBreakdown'    => $this->getUserBreakdown(),
            'conversionRate'   => $this->getConversionRate(),
        ]);
    }

    /**
     * GET /api/admin/dashboard/stats?period=7d
     */
    public function stats(Request $request): JsonResponse
    {
        $period = $request->get('period', '7d');

        return response()->json([
            'stats' => $this->getStats($period),
        ]);
    }

    /**
     * POST /api/admin/premium-requests/{id}/approve
     */
    public function approveRequest(Request $request, PremiumRequest $premiumRequest): JsonResponse
    {
        if ($premiumRequest->status !== 'pending') {
            return response()->json(['message' => 'Request already processed'], 422);
        }

        $premiumRequest->update([
            'status'      => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_note'  => $request->get('note'),
        ]);

        // Upgrade the user
        $user = $premiumRequest->user;
        $user->update([
            'paying_period'            => 'premium',
            'max_cvs'         => 100,
            'paying_period_expires_at' => $premiumRequest->paying_period === 'yearly'
                ? now()->addYear()
                : now()->addMonth(),
        ]);

        // Log activity
        ActivityLog::log(
            'premium',
            "{$user->name} upgraded to Premium ({$premiumRequest->paying_period})",
            $user->id,
            ['plan' => $premiumRequest->paying_period, 'amount' => $premiumRequest->amount]
        );

        return response()->json([
            'message' => 'Request approved successfully',
            'request' => $this->formatPremiumRequest($premiumRequest->fresh()),
        ]);
    }

    /**
     * POST /api/admin/premium-requests/{id}/reject
     */
    public function rejectRequest(Request $request, PremiumRequest $premiumRequest): JsonResponse
    {
        if ($premiumRequest->status !== 'pending') {
            return response()->json(['message' => 'Request already processed'], 422);
        }

        $premiumRequest->update([
            'status'      => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_note'  => $request->get('note', 'Request rejected'),
        ]);

        ActivityLog::log(
            'request',
            "Premium request from {$premiumRequest->user->name} was rejected",
            $premiumRequest->user_id
        );

        return response()->json([
            'message' => 'Request rejected',
            'request' => $this->formatPremiumRequest($premiumRequest->fresh()),
        ]);
    }

    // ─── Private Helpers ────────────────────────────────────

    private function getStats(string $period): array
    {
        $now = Carbon::now();
        $periodStart = $this->getPeriodStart($period);
        $previousStart = $this->getPreviousPeriodStart($period);

        // Total Users
        $totalUsers = User::where('role', 'user')->count();
        $usersInPeriod = User::where('role', 'user')
            ->where('created_at', '>=', $periodStart)->count();
        $usersPrevious = User::where('role', 'user')
            ->whereBetween('created_at', [$previousStart, $periodStart])->count();
        $usersChange = $this->calculateChange($usersInPeriod, $usersPrevious);

        // Premium Users
        $premiumUsers = User::where('plan', 'premium')->where('role', 'user')->count();
        $premiumInPeriod = User::where('plan', 'premium')->where('role', 'user')
            ->where('updated_at', '>=', $periodStart)->count();
        $premiumPrevious = User::where('plan', 'premium')->where('role', 'user')
            ->whereBetween('updated_at', [$previousStart, $periodStart])->count();
        $premiumChange = $this->calculateChange($premiumInPeriod, $premiumPrevious);

        // Documents Created
        $totalDocs = Document::count();
        $docsInPeriod = Document::where('created_at', '>=', $periodStart)->count();
        $docsPrevious = Document::whereBetween('created_at', [$previousStart, $periodStart])->count();
        $docsChange = $this->calculateChange($docsInPeriod, $docsPrevious);

        // Total Downloads
        $totalDownloads = Document::sum('downloads');
        $downloadsInPeriod = Document::where('updated_at', '>=', $periodStart)->sum('downloads');
        $downloadsPrevious = Document::whereBetween('updated_at', [$previousStart, $periodStart])->sum('downloads');
        $downloadsChange = $this->calculateChange($downloadsInPeriod, $downloadsPrevious);

        // Revenue
        $totalRevenue = PremiumRequest::approved()->sum('amount');
        $revenueInPeriod = PremiumRequest::approved()
            ->where('reviewed_at', '>=', $periodStart)->sum('amount');
        $revenuePrevious = PremiumRequest::approved()
            ->whereBetween('reviewed_at', [$previousStart, $periodStart])->sum('amount');
        $revenueChange = $this->calculateChange($revenueInPeriod, $revenuePrevious);

        // Pending Requests
        $pendingCount = PremiumRequest::pending()->count();
        $newPending = PremiumRequest::pending()
            ->where('created_at', '>=', $periodStart)->count();

        // New Users Today
        $newUsersToday = User::where('role', 'user')
            ->whereDate('created_at', today())->count();
        $newUsersYesterday = User::where('role', 'user')
            ->whereDate('created_at', today()->subDay())->count();
        $newUsersChange = $this->calculateChange($newUsersToday, $newUsersYesterday);

        // Active Users (logged in within period)
        $activeUsers = User::where('role', 'user')
            ->where('last_login_at', '>=', $periodStart)->count();
        $activePrevious = User::where('role', 'user')
            ->whereBetween('last_login_at', [$previousStart, $periodStart])->count();
        $activeChange = $this->calculateChange($activeUsers, $activePrevious);

        return [
            [
                'label'      => 'Total Users',
                'value'      => $this->formatNumber($totalUsers),
                'change'     => $usersChange['formatted'],
                'changeType' => $usersChange['type'],
                'icon'       => 'people',
                'color'      => '#667eea',
                'sparkline'  => $this->getSparklineData('users', $period),
                'detail'     => "{$usersInPeriod} this " . $this->getPeriodLabel($period),
            ],
            [
                'label'      => 'Premium Users',
                'value'      => $this->formatNumber($premiumUsers),
                'change'     => $premiumChange['formatted'],
                'changeType' => $premiumChange['type'],
                'icon'       => 'premium',
                'color'      => '#8b5cf6',
                'sparkline'  => $this->getSparklineData('premium', $period),
                'detail'     => "{$premiumInPeriod} this " . $this->getPeriodLabel($period),
            ],
            [
                'label'      => 'Total CVs & Letters Created',
                'value'      => $this->formatNumber($totalDocs),
                'change'     => $docsChange['formatted'],
                'changeType' => $docsChange['type'],
                'icon'       => 'description',
                'color'      => '#10b981',
                'sparkline'  => $this->getSparklineData('documents', $period),
                'detail'     => "{$docsInPeriod} this " . $this->getPeriodLabel($period),
            ],
            [
                'label'      => 'Total Downloads',
                'value'      => $this->formatNumber($totalDownloads),
                'change'     => $downloadsChange['formatted'],
                'changeType' => $downloadsChange['type'],
                'icon'       => 'download',
                'color'      => '#06b6d4',
                'sparkline'  => $this->getSparklineData('downloads', $period),
                'detail'     => "{$this->formatNumber($downloadsInPeriod)} this " . $this->getPeriodLabel($period),
            ],
            [
                'label'      => 'Revenue',
                'value'      => '$' . number_format($totalRevenue, 0),
                'change'     => $revenueChange['formatted'],
                'changeType' => $revenueChange['type'],
                'icon'       => 'money',
                'color'      => '#f59e0b',
                'sparkline'  => $this->getSparklineData('revenue', $period),
                'detail'     => '$' . number_format($revenueInPeriod, 0) . ' this ' . $this->getPeriodLabel($period),
            ],
            [
                'label'      => 'Pending Requests',
                'value'      => (string) $pendingCount,
                'change'     => "+{$newPending}",
                'changeType' => $pendingCount > 0 ? 'up' : 'neutral',
                'icon'       => 'pending',
                'color'      => '#ef4444',
                'sparkline'  => $this->getSparklineData('pending', $period),
                'detail'     => $pendingCount > 0 ? 'Needs attention' : 'All clear',
                'urgent'     => $pendingCount > 0,
            ],
            [
                'label'      => 'New Users Today',
                'value'      => (string) $newUsersToday,
                'change'     => $newUsersChange['formatted'],
                'changeType' => $newUsersChange['type'],
                'icon'       => 'personAdd',
                'color'      => '#ec4899',
                'sparkline'  => $this->getSparklineData('newUsers', $period),
                'detail'     => "vs {$newUsersYesterday} yesterday",
            ],
            [
                'label'      => 'Active Users',
                'value'      => $this->formatNumber($activeUsers),
                'change'     => $activeChange['formatted'],
                'changeType' => $activeChange['type'],
                'icon'       => 'group',
                'color'      => '#14b8a6',
                'sparkline'  => $this->getSparklineData('active', $period),
                'detail'     => 'In selected period',
            ],
        ];
    }

    private function getRecentActivity(): array
    {
        return ActivityLog::with('user:id,name,email')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id'   => $log->id,
                    'text' => $log->description,
                    'time' => $log->created_at->diffForHumans(null, false, true),
                    'type' => $log->type,
                    'color' => $this->getActivityColor($log->type),
                    'icon'  => $this->getActivityIcon($log->type),
                    'user'  => $log->user ? [
                        'name'  => $log->user->name,
                        'email' => $log->user->email,
                    ] : null,
                ];
            })
            ->toArray();
    }

    private function getPendingRequests(): array
    {
        return PremiumRequest::pending()
            ->with('user:id,name,email,avatar')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn ($r) => $this->formatPremiumRequest($r))
            ->toArray();
    }

    private function formatPremiumRequest(PremiumRequest $request): array
    {
        return [
            'id'          => $request->id,
            'name'        => $request->user->name,
            'email'       => $request->user->email,
            'avatar'      => $request->user->avatar,
            'paying_period'        => ucfirst($request->paying_period),
            'amount'      => '$' . number_format($request->amount, 2),
            'status'      => $request->status,
            'requestedAt' => $request->created_at->diffForHumans(null, false, true),
        ];
    }

    private function getTopTemplates(string $period): array
    {
        $periodStart = $this->getPeriodStart($period);

        $templates = Document::where('created_at', '>=', $periodStart)
            ->whereNotNull('template_name')
            ->selectRaw('template_name as name, COUNT(*) as uses')
            ->groupBy('template_name')
            ->orderByDesc('uses')
            ->limit(5)
            ->get();

        $totalUses = $templates->sum('uses') ?: 1;

        return $templates->map(fn ($t) => [
            'name'       => $t->name,
            'uses'       => $t->uses,
            'percentage' => round(($t->uses / $totalUses) * 100),
        ])->toArray();
    }

    private function getRevenueBreakdown(string $period): array
    {
        $periodStart = $this->getPeriodStart($period);

        $monthly = PremiumRequest::approved()
            ->where('paying_period', 'monthly')
            ->where('reviewed_at', '>=', $periodStart)
            ->sum('amount');

        $yearly = PremiumRequest::approved()
            ->where('paying_period', 'yearly')
            ->where('reviewed_at', '>=', $periodStart)
            ->sum('amount');

        $total = $monthly + $yearly;
        $total = $total ?: 1; // avoid division by zero

        return [
            'total' => '$' . number_format($monthly + $yearly, 0),
            'breakdown' => [
                [
                    'label'      => 'Monthly Subs',
                    'value'      => '$' . number_format($monthly, 0),
                    'percentage' => round(($monthly / $total) * 100),
                    'color'      => '#667eea',
                ],
                [
                    'label'      => 'Yearly Subs',
                    'value'      => '$' . number_format($yearly, 0),
                    'percentage' => round(($yearly / $total) * 100),
                    'color'      => '#10b981',
                ],
            ],
        ];
    }

    private function getUserBreakdown(): array
    {
        $totalUsers = User::where('role', 'user')->count() ?: 1;

        $freeUsers = User::where('role', 'user')->where('plan', 'free')->count();

        $premiumMonthly = PremiumRequest::approved()
            ->where('paying_period', 'monthly')
            ->distinct('user_id')
            ->count('user_id');

        $premiumYearly = PremiumRequest::approved()
            ->where('paying_period', 'yearly')
            ->distinct('user_id')
            ->count('user_id');

        return [
            [
                'label'      => 'Free Users',
                'value'      => $this->formatNumber($freeUsers),
                'percentage' => round(($freeUsers / $totalUsers) * 100),
                'color'      => '#64748b',
            ],
            [
                'label'      => 'Premium Monthly',
                'value'      => $this->formatNumber($premiumMonthly),
                'percentage' => round(($premiumMonthly / $totalUsers) * 100),
                'color'      => '#667eea',
            ],
            [
                'label'      => 'Premium Yearly',
                'value'      => $this->formatNumber($premiumYearly),
                'percentage' => round(($premiumYearly / $totalUsers) * 100),
                'color'      => '#10b981',
            ],
        ];
    }

    private function getConversionRate(): array
    {
        $totalUsers = User::where('role', 'user')->count() ?: 1;
        $premiumUsers = User::where('role', 'user')->where('plan', 'premium')->count();
        $rate = round(($premiumUsers / $totalUsers) * 100, 1);

        // Previous month comparison
        $lastMonth = now()->subMonth();
        $totalLastMonth = User::where('role', 'user')
            ->where('created_at', '<=', $lastMonth)->count() ?: 1;
        $premiumLastMonth = User::where('role', 'user')
            ->where('plan', 'premium')
            ->where('updated_at', '<=', $lastMonth)->count();
        $prevRate = round(($premiumLastMonth / $totalLastMonth) * 100, 1);

        $change = round($rate - $prevRate, 1);

        return [
            'rate'       => $rate,
            'change'     => ($change >= 0 ? '+' : '') . $change . '%',
            'changeType' => $change >= 0 ? 'up' : 'down',
        ];
    }

    // ─── Utility Methods ────────────────────────────────────

    private function getSparklineData(string $type, string $period): array
    {
        $points = 12;
        $periodStart = $this->getPeriodStart($period);
        $now = Carbon::now();
        $interval = $now->diffInSeconds($periodStart) / $points;
        $data = [];

        for ($i = 0; $i < $points; $i++) {
            $start = $periodStart->copy()->addSeconds($interval * $i);
            $end = $periodStart->copy()->addSeconds($interval * ($i + 1));

            $value = match ($type) {
                'users'     => User::where('role', 'user')->where('created_at', '<=', $end)->count(),
                'premium'   => User::where('plan', 'premium')->where('updated_at', '<=', $end)->count(),
                'documents' => Document::where('created_at', '<=', $end)->count(),
                'downloads' => Document::where('updated_at', '<=', $end)->sum('downloads'),
                'revenue'   => PremiumRequest::approved()->where('reviewed_at', '<=', $end)->sum('amount'),
                'pending'   => PremiumRequest::pending()->where('created_at', '<=', $end)->count(),
                'newUsers'  => User::where('role', 'user')->whereBetween('created_at', [$start, $end])->count(),
                'active'    => User::where('last_login_at', '>=', $start)->where('last_login_at', '<=', $end)->count(),
                default     => 0,
            };

            $data[] = $value;
        }

        return $data;
    }

    private function getPeriodStart(string $period): Carbon
    {
        return match ($period) {
            '24h' => now()->subDay(),
            '7d'  => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            default => now()->subDays(7),
        };
    }

    private function getPreviousPeriodStart(string $period): Carbon
    {
        return match ($period) {
            '24h' => now()->subDays(2),
            '7d'  => now()->subDays(14),
            '30d' => now()->subDays(60),
            '90d' => now()->subDays(180),
            default => now()->subDays(14),
        };
    }

    private function getPeriodLabel(string $period): string
    {
        return match ($period) {
            '24h' => 'day',
            '7d'  => 'week',
            '30d' => 'month',
            '90d' => 'quarter',
            default => 'week',
        };
    }

    private function calculateChange(int|float $current, int|float $previous): array
    {
        if ($previous == 0) {
            return [
                'formatted' => $current > 0 ? '+100%' : '0%',
                'type'      => $current > 0 ? 'up' : 'neutral',
            ];
        }

        $change = round((($current - $previous) / $previous) * 100, 1);

        return [
            'formatted' => ($change >= 0 ? '+' : '') . $change . '%',
            'type'      => $change >= 0 ? 'up' : 'down',
        ];
    }

    private function formatNumber(int|float $number): string
    {
        if ($number >= 1000000) return round($number / 1000000, 1) . 'M';
        if ($number >= 1000) return number_format($number);
        return (string) $number;
    }

    private function getActivityColor(string $type): string
    {
        return match ($type) {
            'cv', 'motivation_letter' => '#667eea',
            'premium'                 => '#10b981',
            'user'                    => '#8b5cf6',
            'payment'                 => '#f59e0b',
            'template'                => '#64748b',
            'download'                => '#06b6d4',
            'request'                 => '#ef4444',
            default                   => '#64748b',
        };
    }

    private function getActivityIcon(string $type): string
    {
        return match ($type) {
            'cv', 'motivation_letter' => 'description',
            'premium'                 => 'premium',
            'user'                    => 'personAdd',
            'payment'                 => 'payment',
            'template'                => 'brush',
            'download'                => 'download',
            'request'                 => 'pending',
            default                   => 'info',
        };
    }
}
