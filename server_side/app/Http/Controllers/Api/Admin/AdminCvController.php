<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cv;

class AdminCvController extends Controller
{
    public function index()
    {
        $cvs = Cv::with('user')
            ->latest()
            ->get()
            ->map(fn ($cv) => $this->formatCv($cv));

        return response()->json([
            'data' => $cvs,
        ]);
    }

    public function show($id)
    {
        $cv = Cv::with('user')->findOrFail($id);

        return response()->json([
            'data' => $this->formatCv($cv),
        ]);
    }

    public function destroy($id)
    {
        $cv = Cv::findOrFail($id);
        $cv->delete();

        return response()->json([
            'message' => 'CV deleted successfully',
        ]);
    }

    public function bulkDelete()
    {
        $ids = request()->input('ids', []);

        Cv::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Selected CVs deleted successfully',
        ]);
    }

    private function formatCv(Cv $cv): array
    {
        $content = $cv->content ?? [];

        return [
            'id' => $cv->id,
            'title' => $cv->title ?: 'Untitled CV',
            'status' => 'complete', // the CV builder has no draft/complete concept
            'downloads' => (int) $cv->downloads,
            'pages' => 1, // page count isn't tracked server-side
            'sections' => $this->filledSections($content),
            'templateId' => $content['template_id'] ?? null,
            'template' => $cv->template_name ?: 'Unknown Template',
            'createdAt' => optional($cv->created_at)?->toISOString(),
            'lastEdited' => optional($cv->updated_at)?->diffForHumans(),
            'user' => [
                'id' => $cv->user?->id,
                'name' => $cv->user?->name ?? 'Unknown User',
                'email' => $cv->user?->email ?? '',
                'plan' => $cv->user?->plan ?? 'free',
            ],
        ];
    }

    private function filledSections(array $content): array
    {
        return array_values(array_filter(
            array_keys($content),
            fn ($key) => $key !== 'template_id' && !empty($content[$key])
        ));
    }
}
