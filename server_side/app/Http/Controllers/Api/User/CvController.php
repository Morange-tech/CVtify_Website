<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Cv;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class CvController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Cv::where('user_id', $user->id);

        $search = $request->input('search');
        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        $sort = $request->input('sort', 'lastEdited');

        match ($sort) {
            'name' => $query->orderBy('title'),
            'created' => $query->orderByDesc('created_at'),
            default => $query->orderByDesc('updated_at'),
        };

        $cvs = $query->get();

        return response()->json([
            'success' => true,
            'cvs' => $cvs->map(fn ($cv) => $this->formatCv($cv)),
            'meta' => [
                'total' => $cvs->count(),
            ],
        ]);
    }

    public function show(Request $request, Cv $cv): JsonResponse
    {
        $this->authorizeCv($request, $cv);

        return response()->json([
            'success' => true,
            'cv' => $this->formatCv($cv, true),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'template_name' => 'nullable|string|max:255',
            'content' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $isPremium = $this->isPremium($user);
        $cvCount = Cv::where('user_id', $user->id)->count();

        if (!$isPremium && $cvCount >= 3) {
            return response()->json([
                'success' => false,
                'message' => 'Free plan limit reached. Upgrade to create more CVs.',
            ], 403);
        }

        $cv = Cv::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'template_name' => $request->template_name,
            'content' => $request->content ?? [],
            'is_public' => false,
            'public_token' => Str::random(32),
            'downloads' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'CV created successfully.',
            'cv' => $this->formatCv($cv, true),
        ], 201);
    }

    public function update(Request $request, Cv $cv): JsonResponse
    {
        $this->authorizeCv($request, $cv);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'template_name' => 'nullable|string|max:255',
            'content' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $cv->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'CV updated successfully.',
            'cv' => $this->formatCv($cv->fresh(), true),
        ]);
    }

    public function rename(Request $request, Cv $cv): JsonResponse
    {
        $this->authorizeCv($request, $cv);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $cv->update([
            'title' => $request->title,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'CV renamed successfully.',
            'cv' => $this->formatCv($cv->fresh(), true),
        ]);
    }

    public function duplicate(Request $request, Cv $cv): JsonResponse
    {
        $user = $request->user();
        $this->authorizeCv($request, $cv);

        $isPremium = $this->isPremium($user);
        $cvCount = Cv::where('user_id', $user->id)->count();

        if (!$isPremium && $cvCount >= 3) {
            return response()->json([
                'success' => false,
                'message' => 'Free plan limit reached. Upgrade to duplicate more CVs.',
            ], 403);
        }

        $newCv = Cv::create([
            'user_id' => $user->id,
            'title' => $cv->title . ' (Copy)',
            'template_name' => $cv->template_name,
            'content' => $cv->content,
            'is_public' => false,
            'public_token' => Str::random(32),
            'downloads' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'CV duplicated successfully.',
            'cv' => $this->formatCv($newCv, true),
        ], 201);
    }

    public function destroy(Request $request, Cv $cv): JsonResponse
    {
        $this->authorizeCv($request, $cv);

        $cv->delete();

        return response()->json([
            'success' => true,
            'message' => 'CV deleted successfully.',
        ]);
    }

    public function share(Request $request, Cv $cv): JsonResponse
    {
        $this->authorizeCv($request, $cv);

        if (!$cv->public_token) {
            $cv->public_token = Str::random(32);
        }

        $cv->is_public = true;
        $cv->save();

        return response()->json([
            'success' => true,
            'message' => 'Share link generated successfully.',
            'shareUrl' => url('/shared/cv/' . $cv->public_token),
            'cv' => $this->formatCv($cv->fresh(), true),
        ]);
    }

    public function download(Request $request, Cv $cv): JsonResponse
    {
        $this->authorizeCv($request, $cv);

        $cv->increment('downloads');

        return response()->json([
            'success' => true,
            'message' => 'Download started.',
            'downloadUrl' => url('/api/user/cvs/' . $cv->id . '/download-file'),
            'cv' => $this->formatCv($cv->fresh(), true),
        ]);
    }

    private function authorizeCv(Request $request, Cv $cv): void
    {
        abort_unless($cv->user_id === $request->user()->id, 404);
    }

    private function isPremium($user): bool
    {
        return ($user->plan ?? null) === 'premium'
            || ($user->subscription_plan ?? null) === 'premium'
            || (bool) ($user->is_premium ?? false);
    }

    private function formatCv(Cv $cv, bool $withContent = false): array
    {
        $data = [
            'id' => $cv->id,
            'title' => $cv->title,
            'template' => $cv->template_name ?: 'Default',
            'downloads' => (int) $cv->downloads,
            'isPublic' => (bool) $cv->is_public,
            'shareUrl' => $cv->is_public && $cv->public_token ? url('/shared/cv/' . $cv->public_token) : null,
            'createdAt' => optional($cv->created_at)->toISOString(),
            'updatedAt' => optional($cv->updated_at)->toISOString(),
            'lastEdited' => optional($cv->updated_at)?->diffForHumans(),
        ];

        if ($withContent) {
            $data['content'] = $cv->content ?? [];
        }

        return $data;
    }
}
