<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\MotivationLetter;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MotivationLetterController extends Controller
{
        public function index(Request $request)
    {
        $query = $request->user()->motivationLetters();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%");
            });
        }

        $status = $request->query('status');
        if (in_array($status, ['draft', 'complete'], true)) {
            $query->where('status', $status);
        }

        switch ($request->query('sortBy', 'lastEdited')) {
            case 'name':
                $query->orderBy('title', 'asc');
                break;
            case 'company':
                $query->orderBy('company', 'asc');
                break;
            case 'created':
                $query->orderByDesc('created_at');
                break;
            case 'lastEdited':
            default:
                $query->orderByDesc('updated_at');
                break;
        }

        $letters = $query->get()->map(fn ($letter) => $this->formatLetter($letter));

        return response()->json([
            'data' => $letters,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (($user->plan ?? 'free') !== 'premium' && $user->motivationLetters()->count() >= 3) {
            return response()->json([
                'message' => 'You have reached the free plan limit of 3 letters.',
            ], 422);
        }

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'linkedCv' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(['draft', 'complete'])],
        ]);

        $letter = $user->motivationLetters()->create([
            'title' => filled($validated['title'] ?? null)
                ? $validated['title']
                : $validated['company'] . ' - ' . $validated['position'],
            'company' => $validated['company'],
            'position' => $validated['position'],
            'linked_cv' => $validated['linkedCv'] ?? null,
            'content' => $validated['content'] ?? null,
            'status' => $validated['status'] ?? 'draft',
        ]);

        return response()->json([
            'message' => 'Motivation letter created successfully.',
            'data' => $this->formatLetter($letter),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $letter = $request->user()->motivationLetters()->findOrFail($id);

        return response()->json([
            'data' => $this->formatLetter($letter, true),
        ]);
    }

    public function update(Request $request, $id)
    {
        $letter = $request->user()->motivationLetters()->findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'company' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'required', 'string', 'max:255'],
            'linkedCv' => ['sometimes', 'nullable', 'string', 'max:255'],
            'content' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', Rule::in(['draft', 'complete'])],
        ]);

        $data = [];

        if (array_key_exists('title', $validated)) {
            $data['title'] = $validated['title'];
        }

        if (array_key_exists('company', $validated)) {
            $data['company'] = $validated['company'];
        }

        if (array_key_exists('position', $validated)) {
            $data['position'] = $validated['position'];
        }

        if (array_key_exists('linkedCv', $validated)) {
            $data['linked_cv'] = $validated['linkedCv'];
        }

        if (array_key_exists('content', $validated)) {
            $data['content'] = $validated['content'];
        }

        if (array_key_exists('status', $validated)) {
            $data['status'] = $validated['status'];
        }

        $letter->update($data);
        $letter->refresh();

        return response()->json([
            'message' => 'Motivation letter updated successfully.',
            'data' => $this->formatLetter($letter, true),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $letter = $request->user()->motivationLetters()->findOrFail($id);

        $letter->delete();

        return response()->json([
            'message' => 'Motivation letter deleted successfully.',
        ]);
    }

    public function duplicate(Request $request, $id)
    {
        $user = $request->user();
        $letter = $user->motivationLetters()->findOrFail($id);

        if (($user->plan ?? 'free') !== 'premium' && $user->motivationLetters()->count() >= 3) {
            return response()->json([
                'message' => 'You have reached the free plan limit of 3 letters.',
            ], 422);
        }

        $copy = $letter->replicate();
        $copy->user_id = $user->id;
        $copy->title = $letter->title . ' (Copy)';
        $copy->downloads = 0;
        $copy->status = 'draft';
        $copy->share_token = null;
        $copy->save();

        return response()->json([
            'message' => 'Motivation letter duplicated successfully.',
            'data' => $this->formatLetter($copy),
        ], 201);
    }

    public function share(Request $request, $id)
    {
        $letter = $request->user()->motivationLetters()->findOrFail($id);

        if (!$letter->share_token) {
            $letter->share_token = (string) Str::uuid();
            $letter->save();
        }

        return response()->json([
            'data' => [
                'shareToken' => $letter->share_token,
                'url' => rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/') . '/letter/' . $letter->share_token . '/view',
            ],
        ]);
    }

    public function publicShow($token)
    {
        $letter = MotivationLetter::where('share_token', $token)->firstOrFail();

        return response()->json([
            'data' => [
                'id' => $letter->id,
                'title' => $letter->title,
                'company' => $letter->company,
                'position' => $letter->position,
                'linkedCv' => $letter->linked_cv,
                'content' => $letter->content,
                'status' => $letter->status,
                'downloads' => $letter->downloads,
                'createdAt' => $letter->created_at?->toIso8601String(),
                'updatedAt' => $letter->updated_at?->toIso8601String(),
            ],
        ]);
    }

    public function incrementDownload(Request $request, $id)
    {
        $letter = $request->user()->motivationLetters()->findOrFail($id);

        $letter->increment('downloads');
        $letter->refresh();

        return response()->json([
            'message' => 'Download counter updated.',
            'data' => [
                'id' => $letter->id,
                'downloads' => $letter->downloads,
            ],
        ]);
    }

    private function formatLetter(MotivationLetter $letter, bool $includeContent = false): array
    {
        $data = [
            'id' => $letter->id,
            'title' => $letter->title,
            'company' => $letter->company,
            'position' => $letter->position,
            'linkedCv' => $letter->linked_cv,
            'status' => $letter->status,
            'downloads' => $letter->downloads,
            'shareToken' => $letter->share_token,
            'lastEdited' => $letter->updated_at?->diffForHumans(),
            'createdAt' => $letter->created_at?->toIso8601String(),
            'updatedAt' => $letter->updated_at?->toIso8601String(),
        ];

        if ($includeContent) {
            $data['content'] = $letter->content;
        }

        return $data;
    }

}
