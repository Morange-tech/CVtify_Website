<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard
     * Returns all dashboard data based on user plan
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $isPremium = $user->isPremium();

        return response()->json([
            'user'            => $this->getUserData($user),
            'stats'           => $this->getStats($user, $isPremium),
            'recentDocuments' => $this->getRecentDocuments($user),
            'storage'         => $user->getStorageUsage(),
            'isPremium'       => $isPremium,

            // Premium-only data
            ...($isPremium ? [
                'profileStrength' => $this->getProfileStrength($user),
                'advancedStats'   => $this->getAdvancedStats($user),
                'tips'            => $this->getTips($user),
            ] : []),
        ]);
    }

    /**
     * GET /api/dashboard/stats
     * Lightweight endpoint for just stats
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $isPremium = $user->isPremium();

        return response()->json([
            'stats'     => $this->getStats($user, $isPremium),
            'storage'   => $user->getStorageUsage(),
            'isPremium' => $isPremium,
        ]);
    }

    /**
     * GET /api/dashboard/documents
     * Recent documents with pagination
     */
    public function documents(Request $request): JsonResponse
    {
        $user = $request->user();

        $documents = $user->documents()
            ->orderByDesc('updated_at')
            ->limit($request->get('limit', 5))
            ->get()
            ->map(fn ($doc) => $this->formatDocument($doc));

        return response()->json([
            'documents' => $documents,
            'total'     => $user->documents()->count(),
        ]);
    }

    // ─── Private Helpers ────────────────────────────

    private function getUserData($user): array
    {
        return [
            'id'     => $user->id,
            'name'   => $user->name,
            'email'  => $user->email,
            'avatar' => $user->avatar,
            'plan'   => $user->plan,
        ];
    }

    private function getStats($user, bool $isPremium): array
    {
        $now = Carbon::now();
        $weekAgo = $now->copy()->subWeek();
        $monthAgo = $now->copy()->subMonth();

        // CVs created
        $totalCvs = $user->cvs()->count();
        $cvsThisWeek = $user->cvs()->where('created_at', '>=', $weekAgo)->count();

        // Downloads
        $totalDownloads = $user->documents()->sum('downloads');
        $downloadsThisMonth = $user->documents()
            ->where('updated_at', '>=', $monthAgo)
            ->sum('downloads');

        // Templates used
        $templatesUsed = $user->documents()
            ->whereNotNull('template_name')
            ->distinct('template_name')
            ->count('template_name');

        $templateNames = $user->documents()
            ->whereNotNull('template_name')
            ->distinct()
            ->pluck('template_name')
            ->take(3)
            ->implode(', ');

        // Last edited
        $lastDoc = $user->documents()->orderByDesc('updated_at')->first();
        $lastEdited = $lastDoc
            ? $lastDoc->updated_at->diffForHumans(null, false, true)
            : 'Never';
        $lastEditedTitle = $lastDoc?->title ?? 'No documents';

        $stats = [
            [
                'label' => 'CVs Created',
                'value' => (string) $totalCvs,
                'color' => '#667eea',
                'icon'  => '📄',
                'sub'   => "+{$cvsThisWeek} this week",
            ],
            [
                'label' => 'Downloads',
                'value' => (string) $totalDownloads,
                'color' => '#10b981',
                'icon'  => '⬇️',
                'sub'   => "+{$downloadsThisMonth} this month",
            ],
        ];

        if ($isPremium) {
            // Premium stats
            $profileStrengthScore = $this->getProfileStrength($user)['score'];

            $totalViews = $user->documents()
                ->withCount('views')
                ->get()
                ->sum('views_count');

            $viewsLastMonth = 0;
            foreach ($user->documents as $doc) {
                $viewsLastMonth += $doc->views()
                    ->where('created_at', '>=', $monthAgo)
                    ->count();
            }

            $stats[] = [
                'label' => 'Profile Strength Score',
                'value' => (string) $profileStrengthScore,
                'color' => '#764ba2',
                'icon'  => '🎯',
                'sub'   => $profileStrengthScore >= 70 ? 'Well-optimized CV' : 'Needs improvement',
            ];
            $stats[] = [
                'label' => 'Profile Views',
                'value' => (string) $totalViews,
                'color' => '#f59e0b',
                'icon'  => '👁️',
                'sub'   => "+{$viewsLastMonth} this month",
            ];
        } else {
            // Free stats
            $stats[] = [
                'label' => 'Templates Used',
                'value' => (string) $templatesUsed,
                'color' => '#764ba2',
                'icon'  => '🎨',
                'sub'   => $templateNames ?: 'None yet',
            ];
            $stats[] = [
                'label' => 'Last Edited',
                'value' => $lastEdited,
                'color' => '#f59e0b',
                'icon'  => '✏️',
                'sub'   => $lastEditedTitle,
            ];
        }

        return $stats;
    }

    private function getRecentDocuments($user): array
    {
        return $user->documents()
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(fn ($doc) => $this->formatDocument($doc))
            ->toArray();
    }

    private function formatDocument($doc): array
    {
        return [
            'id'          => $doc->id,
            'title'       => $doc->title,
            'type'        => $doc->type,
            'template'    => $doc->template_name ?? 'Custom',
            'templateId'  => $doc->template_id,
            'lastEdited'  => $doc->updated_at->diffForHumans(null, false, true),
            'downloads'   => $doc->downloads,
            'status'      => ucfirst($doc->status),
            'statusColor' => $doc->status === 'complete' ? '#10b981' : '#f59e0b',
        ];
    }

    /**
     * Scores how complete the user's most recently edited CV is across 5 sections
     * (Personal Info, Experience, Education, Skills, Summary), based purely on how
     * many fields are filled in. This is NOT a real ATS (Applicant Tracking System)
     * compatibility check — it doesn't parse formatting or match keywords against a
     * job description. Surfaced to users as "Profile Strength Score" for that reason;
     * do not relabel it "ATS Score" until genuine keyword-matching against a supplied
     * job description is implemented.
     */
    private function getProfileStrength($user): array
    {
        $lastDoc = $user->documents()->orderByDesc('updated_at')->first();
        $content = $lastDoc?->content ?? [];

        $sections = [
            [
                'label'    => 'Personal Info',
                'progress' => $this->calculateSectionProgress($content, 'personal_info'),
                'color'    => '#10b981',
            ],
            [
                'label'    => 'Work Experience',
                'progress' => $this->calculateSectionProgress($content, 'experience'),
                'color'    => '#667eea',
            ],
            [
                'label'    => 'Education',
                'progress' => $this->calculateSectionProgress($content, 'education'),
                'color'    => '#667eea',
            ],
            [
                'label'    => 'Skills',
                'progress' => $this->calculateSectionProgress($content, 'skills'),
                'color'    => '#f59e0b',
            ],
            [
                'label'    => 'Summary',
                'progress' => $this->calculateSectionProgress($content, 'summary'),
                'color'    => '#ef4444',
            ],
        ];

        // Update colors based on actual progress
        foreach ($sections as &$section) {
            if ($section['progress'] >= 80) {
                $section['color'] = '#10b981';
            } elseif ($section['progress'] >= 50) {
                $section['color'] = '#667eea';
            } elseif ($section['progress'] >= 30) {
                $section['color'] = '#f59e0b';
            } else {
                $section['color'] = '#ef4444';
            }
        }

        $totalScore = count($sections) > 0
            ? round(array_sum(array_column($sections, 'progress')) / count($sections))
            : 0;

        return [
            'score'    => $totalScore,
            'sections' => $sections,
        ];
    }

    private function calculateSectionProgress(array $content, string $section): int
    {
        if (empty($content) || !isset($content[$section])) {
            return 0;
        }

        $data = $content[$section];

        if (is_string($data)) {
            return strlen(trim($data)) > 10 ? 100 : (strlen(trim($data)) > 0 ? 50 : 0);
        }

        if (is_array($data)) {
            if (empty($data)) return 0;

            $filledFields = 0;
            $totalFields = 0;

            foreach ($data as $value) {
                $totalFields++;
                if (is_array($value)) {
                    $subFilled = count(array_filter($value, fn ($v) => !empty($v)));
                    $subTotal = count($value);
                    $filledFields += $subTotal > 0 ? ($subFilled / $subTotal) : 0;
                } elseif (!empty($value)) {
                    $filledFields++;
                }
            }

            return $totalFields > 0 ? round(($filledFields / $totalFields) * 100) : 0;
        }

        return 0;
    }

    private function getAdvancedStats($user): array
    {
        $now = Carbon::now();
        $monthAgo = $now->copy()->subMonth();
        $twoMonthsAgo = $now->copy()->subMonths(2);

        // Views this month
        $viewsThisMonth = 0;
        $viewsLastMonth = 0;
        foreach ($user->documents as $doc) {
            $viewsThisMonth += $doc->views()
                ->where('created_at', '>=', $monthAgo)
                ->count();
            $viewsLastMonth += $doc->views()
                ->whereBetween('created_at', [$twoMonthsAgo, $monthAgo])
                ->count();
        }

        $viewsChange = $viewsLastMonth > 0
            ? round((($viewsThisMonth - $viewsLastMonth) / $viewsLastMonth) * 100)
            : 0;

        // Download rate
        $totalViews = max(1, $viewsThisMonth + $viewsLastMonth);
        $totalDownloads = $user->documents()->sum('downloads');
        $downloadRate = round(($totalDownloads / $totalViews) * 100);

        // Avg time spent
        $avgTime = $user->documents()
            ->join('document_views', 'documents.id', '=', 'document_views.document_id')
            ->avg('document_views.time_spent_seconds') ?? 0;

        $minutes = floor($avgTime / 60);
        $seconds = $avgTime % 60;
        $avgTimeFormatted = "{$minutes}m {$seconds}s";

        // Profile Strength Score — see getProfileStrength() docblock for methodology.
        $profileStrengthScore = $this->getProfileStrength($user)['score'];

        return [
            [
                'label'       => 'CV Views (30d)',
                'value'       => (string) $viewsThisMonth,
                'change'      => ($viewsChange >= 0 ? '+' : '') . $viewsChange . '%',
                'changeColor' => $viewsChange >= 0 ? '#10b981' : '#ef4444',
            ],
            [
                'label'       => 'Download Rate',
                'value'       => $downloadRate . '%',
                'change'      => '+5%',
                'changeColor' => '#10b981',
            ],
            [
                'label'       => 'Avg. Time Spent',
                'value'       => $avgTimeFormatted,
                'change'      => '-',
                'changeColor' => '#64748b',
            ],
            [
                'label'       => 'Profile Strength Score',
                'value'       => $profileStrengthScore . '/100',
                'change'      => $profileStrengthScore >= 70 ? 'Good' : 'Improve',
                'changeColor' => $profileStrengthScore >= 70 ? '#10b981' : '#f59e0b',
            ],
        ];
    }

    private function getTips($user): array
    {
        $lastDoc = $user->documents()->orderByDesc('updated_at')->first();
        $content = $lastDoc?->content ?? [];
        $tips = [];

        if (empty($content['summary'] ?? null)) {
            $tips[] = [
                'tip'    => 'Add a professional summary',
                'impact' => 'High Impact',
                'color'  => '#ef4444',
            ];
        }

        if (empty($content['experience'] ?? null)) {
            $tips[] = [
                'tip'    => 'Include measurable achievements',
                'impact' => 'High Impact',
                'color'  => '#ef4444',
            ];
        }

        if (empty($content['skills'] ?? null) || (is_array($content['skills'] ?? null) && count($content['skills']) < 5)) {
            $tips[] = [
                'tip'    => 'Add more relevant skills',
                'impact' => 'Medium Impact',
                'color'  => '#f59e0b',
            ];
        }

        if (empty($user->avatar)) {
            $tips[] = [
                'tip'    => 'Upload a professional photo',
                'impact' => 'Low Impact',
                'color'  => '#10b981',
            ];
        }

        if (empty($content['education'] ?? null)) {
            $tips[] = [
                'tip'    => 'Add your education details',
                'impact' => 'Medium Impact',
                'color'  => '#f59e0b',
            ];
        }

        // Always return at least some tips
        if (empty($tips)) {
            $tips[] = [
                'tip'    => 'Keep your CV updated regularly',
                'impact' => 'Good Practice',
                'color'  => '#10b981',
            ];
            $tips[] = [
                'tip'    => 'Tailor your CV for each application',
                'impact' => 'High Impact',
                'color'  => '#ef4444',
            ];
        }

        return $tips;
    }
}
