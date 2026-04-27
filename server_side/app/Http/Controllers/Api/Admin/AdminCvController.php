<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document; // ⚠️ Add this
use Illuminate\Http\Request;

class AdminCvController extends Controller
{
    public function index()
    {
        $cvs = Document::with(['user', 'template'])
            ->cvs() // use the scope to get only CVs
            ->latest()
            ->get()
            ->map(function ($cv) {
                return [
                    'id' => $cv->id,
                    'title' => $cv->title ?? 'Untitled CV',
                    'status' => $cv->status ?? 'draft',
                    'downloads' => $cv->downloads ?? 0,
                    'pages' => $cv->pages ?? 1,
                    'sections' => is_array($cv->sections)
                        ? $cv->sections
                        : (json_decode($cv->sections ?? '[]', true) ?: []),
                    'templateId' => $cv->template_id ?? $cv->template?->id,
                    'template' => $cv->template?->name ?? 'Unknown Template',
                    'createdAt' => $cv->created_at,
                    'lastEdited' => optional($cv->updated_at)?->diffForHumans(),
                    'user' => [
                        'id' => $cv->user?->id,
                        'name' => $cv->user?->name ?? 'Unknown User',
                        'email' => $cv->user?->email ?? '',
                        'plan' => $cv->user?->plan ?? 'free',
                    ],
                ];
            });

        return response()->json([
            'data' => $cvs,
        ]);
    }

    public function show($id)
    {
        $cv = Document::cvs()->with(['user', 'template'])->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $cv->id,
                'title' => $cv->title ?? 'Untitled CV',
                'status' => $cv->status ?? 'draft',
                'downloads' => $cv->downloads ?? 0,
                'pages' => $cv->pages ?? 1,
                'sections' => is_array($cv->sections)
                    ? $cv->sections
                    : (json_decode($cv->sections ?? '[]', true) ?: []),
                'templateId' => $cv->template_id ?? $cv->template?->id,
                'template' => $cv->template?->name ?? 'Unknown Template',
                'createdAt' => $cv->created_at,
                'lastEdited' => optional($cv->updated_at)?->diffForHumans(),
                'user' => [
                    'id' => $cv->user?->id,
                    'name' => $cv->user?->name ?? 'Unknown User',
                    'email' => $cv->user?->email ?? '',
                    'plan' => $cv->user?->plan ?? 'free',
                ],
            ]
        ]);
    }

    public function destroy($id)
    {
        $cv = Document::cvs()->findOrFail($id);
        $cv->delete();

        return response()->json([
            'message' => 'CV deleted successfully',
        ]);
    }

    public function bulkDelete()
    {
        $ids = request()->input('ids', []);

        Document::cvs()->whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Selected CVs deleted successfully',
        ]);
    }
}
