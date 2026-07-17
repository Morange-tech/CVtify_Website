<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
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
            'company' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'linkedCv' => ['nullable', 'string', 'max:255'],
            'template_id' => ['nullable', 'integer'],
            'content' => ['nullable'],
            'senderInfo' => ['nullable', 'array'],
            'recipientInfo' => ['nullable', 'array'],
            'signature' => ['nullable', 'array'],
            'status' => ['nullable', Rule::in(['draft', 'complete'])],
        ]);

        $company = $validated['company'] ?? ($validated['recipientInfo']['company'] ?? null);
        $position = $validated['position'] ?? ($validated['senderInfo']['title'] ?? null);

        $letter = $user->motivationLetters()->create([
            'title' => filled($validated['title'] ?? null)
                ? $validated['title']
                : (trim(($company ?? '') . ' - ' . ($position ?? ''), ' -') ?: 'Untitled letter'),
            'company' => $company,
            'position' => $position,
            'linked_cv' => $validated['linkedCv'] ?? null,
            'template_id' => $validated['template_id'] ?? null,
            'content' => $this->encodeContent($validated['content'] ?? null),
            'sender_info' => $validated['senderInfo'] ?? null,
            'recipient_info' => $validated['recipientInfo'] ?? null,
            'signature' => $validated['signature'] ?? null,
            'status' => $validated['status'] ?? 'draft',
        ]);

        ActivityLog::log('letter_created', "{$user->name} created letter \"{$letter->title}\"", $user->id, ['letter_id' => $letter->id]);

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
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'company' => ['sometimes', 'nullable', 'string', 'max:255'],
            'position' => ['sometimes', 'nullable', 'string', 'max:255'],
            'linkedCv' => ['sometimes', 'nullable', 'string', 'max:255'],
            'template_id' => ['sometimes', 'nullable', 'integer'],
            'content' => ['sometimes', 'nullable'],
            'senderInfo' => ['sometimes', 'nullable', 'array'],
            'recipientInfo' => ['sometimes', 'nullable', 'array'],
            'signature' => ['sometimes', 'nullable', 'array'],
            'status' => ['sometimes', Rule::in(['draft', 'complete'])],
        ]);

        $data = [];

        if (array_key_exists('title', $validated)) {
            $data['title'] = $validated['title'];
        }

        if (array_key_exists('company', $validated)) {
            $data['company'] = $validated['company'];
        } elseif (array_key_exists('recipientInfo', $validated)) {
            $data['company'] = $validated['recipientInfo']['company'] ?? null;
        }

        if (array_key_exists('position', $validated)) {
            $data['position'] = $validated['position'];
        } elseif (array_key_exists('senderInfo', $validated)) {
            $data['position'] = $validated['senderInfo']['title'] ?? null;
        }

        if (array_key_exists('linkedCv', $validated)) {
            $data['linked_cv'] = $validated['linkedCv'];
        }

        if (array_key_exists('template_id', $validated)) {
            $data['template_id'] = $validated['template_id'];
        }

        if (array_key_exists('content', $validated)) {
            $data['content'] = $this->encodeContent($validated['content']);
        }

        if (array_key_exists('senderInfo', $validated)) {
            $data['sender_info'] = $validated['senderInfo'];
        }

        if (array_key_exists('recipientInfo', $validated)) {
            $data['recipient_info'] = $validated['recipientInfo'];
        }

        if (array_key_exists('signature', $validated)) {
            $data['signature'] = $validated['signature'];
        }

        if (array_key_exists('status', $validated)) {
            $data['status'] = $validated['status'];
        }

        $letter->update($data);
        $letter->refresh();

        ActivityLog::log('letter_updated', "{$request->user()->name} updated letter \"{$letter->title}\"", $request->user()->id, ['letter_id' => $letter->id]);

        return response()->json([
            'message' => 'Motivation letter updated successfully.',
            'data' => $this->formatLetter($letter, true),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $letter = $request->user()->motivationLetters()->findOrFail($id);

        ActivityLog::log('letter_deleted', "{$request->user()->name} deleted letter \"{$letter->title}\"", $request->user()->id, ['letter_id' => $letter->id]);

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
            'templateId' => $letter->template_id,
            'senderInfo' => $letter->sender_info,
            'recipientInfo' => $letter->recipient_info,
            'signature' => $letter->signature,
            'status' => $letter->status,
            'downloads' => $letter->downloads,
            'shareToken' => $letter->share_token,
            'lastEdited' => $letter->updated_at?->diffForHumans(),
            'createdAt' => $letter->created_at?->toIso8601String(),
            'updatedAt' => $letter->updated_at?->toIso8601String(),
        ];

        if ($includeContent) {
            $data['content'] = $this->decodeContent($letter->content);
        }

        return $data;
    }

    /**
     * The builder sends `content` as a structured object ({ville, date, objet, corps});
     * the older simple flow sends it as a plain string. Store either as-is in the
     * longText column, JSON-encoding structured content so it round-trips cleanly.
     */
    private function encodeContent($content): ?string
    {
        if ($content === null) {
            return null;
        }

        return is_array($content) ? json_encode($content) : $content;
    }

    private function decodeContent(?string $content)
    {
        if ($content === null) {
            return null;
        }

        $decoded = json_decode($content, true);

        return json_last_error() === JSON_ERROR_NONE && is_array($decoded) ? $decoded : $content;
    }

}
