<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'user')
            ->orderBy('name')
            ->get()
            ->map(fn ($user) => $this->formatUser($user));

        return response()->json([
            'data' => $users,
        ]);
    }

    public function show($id)
    {
        $user = User::where('role', 'user')->findOrFail($id);

        return response()->json([
            'data' => $this->formatUser($user, withDetail: true),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('role', 'user')->findOrFail($id);

        $validated = $request->validate([
            'plan' => ['nullable', Rule::in(['free', 'premium'])],
            'status' => ['nullable', Rule::in(['active', 'suspended', 'banned'])],
        ]);

        $changes = [];

        if (array_key_exists('status', $validated) && $validated['status']) {
            $changes = array_merge($changes, match ($validated['status']) {
                'banned' => ['is_active' => false, 'is_suspended' => false],
                'suspended' => ['is_active' => true, 'is_suspended' => true],
                'active' => ['is_active' => true, 'is_suspended' => false],
            });
        }

        if (array_key_exists('plan', $validated) && $validated['plan']) {
            $changes = array_merge($changes, $validated['plan'] === 'premium'
                ? ['plan' => 'premium', 'subscription_status' => 'active']
                : ['plan' => 'free', 'subscription_status' => 'inactive', 'subscription_expires_at' => null]);
        }

        if ($changes) {
            $user->update($changes);
        }

        ActivityLog::log(
            'admin_user_updated',
            "{$request->user()->name} updated user \"{$user->name}\"",
            $request->user()->id,
            ['user_id' => $user->id, 'changes' => $changes]
        );

        return response()->json([
            'data' => $this->formatUser($user->fresh(), withDetail: true),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::where('role', 'user')->findOrFail($id);
        $name = $user->name;

        $user->delete();

        ActivityLog::log(
            'admin_user_deleted',
            "{$request->user()->name} deleted user \"{$name}\"",
            $request->user()->id
        );

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    private function formatUser(User $user, bool $withDetail = false): array
    {
        $status = !$user->is_active
            ? 'banned'
            : ($user->is_suspended ? 'suspended' : 'active');

        $data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'plan' => $user->plan ?? 'free',
            'status' => $status,
            'joinedDate' => optional($user->created_at)->toISOString(),
            'createdAt' => optional($user->created_at)->toISOString(),
            'lastActive' => optional($user->last_login_at)->toISOString(),
            'cvsCreated' => $user->cvs()->count(),
            'downloads' => (int) $user->cvs()->sum('downloads') + (int) $user->motivationLetters()->sum('downloads'),
        ];

        if ($withDetail) {
            $data['lettersCreated'] = $user->motivationLetters()->count();
            $data['templatesUsed'] = $user->cvs()->whereNotNull('template_name')->distinct('template_name')->count('template_name');
            $data['totalSpent'] = (float) $user->premiumRequests()->where('status', 'approved')->sum('amount');
        }

        return $data;
    }
}
