<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Cv;
use App\Models\DownloadHistory;
use App\Models\MotivationLetter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class DownloadHistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = $user->downloadHistories()->with('downloadable');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where('file_name', 'like', "%{$search}%");
        }

        $type = $request->query('type');
        if (in_array($type, ['cv', 'letter'], true)) {
            $query->where('type', $type);
        }

        switch ($request->query('sortBy', 'newest')) {
            case 'oldest':
                $query->orderBy('downloaded_at', 'asc');
                break;
            case 'name':
                $query->orderBy('file_name', 'asc');
                break;
            case 'size':
                $query->orderByDesc('file_size_bytes');
                break;
            case 'newest':
            default:
                $query->orderByDesc('downloaded_at');
                break;
        }

        $downloads = $query->get();

        return response()->json([
            'data' => $downloads->map(fn($download) => $this->transform($download))->values(),
            'stats' => [
                'totalDownloads' => $user->downloadHistories()->count(),
                'cvDownloads' => $user->downloadHistories()->where('type', 'cv')->count(),
                'letterDownloads' => $user->downloadHistories()->where('type', 'letter')->count(),
                'totalSizeBytes' => (int) $user->downloadHistories()->sum('file_size_bytes'),
                'totalSize' => $this->formatBytes((int) $user->downloadHistories()->sum('file_size_bytes')),
            ],
            'availableFormats' => $this->availableFormatsFor($user),
        ]);
    }

    /**
     * Create a download history row.
     * Usually called from your real export/download endpoint.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $allowedFormats = $this->availableFormatsFor($user);

        $validated = $request->validate([
            'type' => ['required', Rule::in(['cv', 'letter'])],
            'downloadableId' => ['required', 'integer'],
            'format' => ['required', Rule::in($allowedFormats)],
            'fileName' => ['nullable', 'string', 'max:255'],
            'template' => ['nullable', 'string', 'max:255'],
            'fileSizeBytes' => ['nullable', 'integer', 'min:0'],
            'filePath' => ['nullable', 'string', 'max:2048'],
        ]);

        $downloadable = $this->findOwnedDownloadable(
            $user->id,
            $validated['type'],
            (int) $validated['downloadableId']
        );

        $history = $user->downloadHistories()->create([
            'downloadable_type' => $downloadable::class,
            'downloadable_id' => $downloadable->id,
            'type' => $validated['type'],
            'file_name' => $validated['fileName'] ?? $this->buildFileName(
                $downloadable,
                $validated['type'],
                $validated['format']
            ),
            'format' => strtoupper($validated['format']),
            'file_size_bytes' => $validated['fileSizeBytes'] ?? 0,
            'template' => $validated['template']
                ?? ($downloadable->template_name ?? $downloadable->template ?? null),
            'is_premium_quality' => (($user->plan ?? 'free') === 'premium'),
            'has_watermark' => (($user->plan ?? 'free') !== 'premium'),
            'file_path' => $validated['filePath'] ?? null,
            'downloaded_at' => now(),
        ]);

        return response()->json([
            'message' => 'Download history saved successfully.',
            'data' => $this->transform($history),
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $download = $request->user()->downloadHistories()->findOrFail($id);

        $download->delete();

        return response()->json([
            'message' => 'Download removed from history.',
        ]);
    }

    public function clearAll(Request $request)
    {
        $deletedCount = $request->user()->downloadHistories()->count();
        $request->user()->downloadHistories()->delete();

        return response()->json([
            'message' => 'Download history cleared.',
            'deleted' => $deletedCount,
        ]);
    }

    /**
     * Optional: if you store generated files and want redownload by history row.
     */
    public function file(Request $request, $id)
    {
        $download = $request->user()->downloadHistories()->findOrFail($id);

        if (!$download->file_path || !Storage::disk('public')->exists($download->file_path)) {
            return response()->json([
                'message' => 'Stored file not found.',
            ], 404);
        }

        return Storage::disk('public')->download($download->file_path, $download->file_name);
    }

    private function findOwnedDownloadable(int $userId, string $type, int $id)
    {
        $modelClass = $type === 'cv' ? Cv::class : MotivationLetter::class;

        return $modelClass::where('user_id', $userId)->findOrFail($id);
    }

    private function availableFormatsFor($user): array
    {
        return (($user->plan ?? 'free') === 'premium')
            ? ['PDF', 'DOCX', 'PNG', 'JPG']
            : ['PDF'];
    }

    private function buildFileName($downloadable, string $type, string $format): string
    {
        $base = $downloadable->title
            ?? $downloadable->name
            ?? ($type === 'cv' ? 'CV' : 'Motivation Letter');

        return Str::slug($base, '_') . '.' . strtolower($format);
    }

    private function transform(DownloadHistory $download): array
    {
        return [
            'id' => $download->id,
            'fileName' => $download->file_name,
            'type' => $download->type,
            'template' => $download->template,
            'format' => strtoupper($download->format),
            'size' => $this->formatBytes((int) $download->file_size_bytes),
            'sizeBytes' => (int) $download->file_size_bytes,
            'quality' => $download->is_premium_quality ? 'HD' : 'SD',
            'hasWatermark' => $download->has_watermark,
            'downloadedAt' => $download->downloaded_at?->toIso8601String(),
            'timeAgo' => $download->downloaded_at?->diffForHumans(),
            'sourceId' => $download->downloadable_id,
            'sourceType' => $download->type,
        ];
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $power = (int) floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);

        $value = $bytes / (1024 ** $power);

        return number_format($value, $power === 0 ? 0 : 2) . ' ' . $units[$power];
    }
}
