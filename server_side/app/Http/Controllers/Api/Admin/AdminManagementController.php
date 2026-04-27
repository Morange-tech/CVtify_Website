<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminUserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->whereIn('role', ['super_admin', 'manager', 'support']);

        if ($request->filled('tab') && $request->tab !== 'all') {
            if ($request->tab === 'inactive') {
                $query->where(function ($q) {
                    $q->where('is_active', false)->orWhere('is_suspended', true);
                });
            } else {
                $query->where('role', $request->tab);
            }
        }

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'newest');

        match ($sort) {
            'oldest' => $query->orderBy('created_at'),
            'name' => $query->orderBy('name'),
            default => $query->orderByDesc('created_at'),
        };

        $admins = $query->get();

        if ($sort === 'activity') {
            $admins = $admins->sortByDesc(function ($admin) {
                return \App\Models\ActivityLog::where('user_id', $admin->id)->count();
            })->values();
        }

        return response()->json([
            'admins' => AdminUserResource::collection($admins),
        ]);
    }

    public function show($id)
    {
        $id = $this->extractUserId($id);

        $admin = User::whereIn('role', ['super_admin', 'manager', 'support'])->findOrFail($id);

        return response()->json([
            'admin' => new AdminUserResource($admin),
        ]);
    }

    public function stats()
    {
        $query = User::whereIn('role', ['super_admin', 'manager', 'support']);

        return response()->json([
            'total' => (clone $query)->count(),
            'superAdmins' => (clone $query)->where('role', 'super_admin')->count(),
            'managers' => (clone $query)->where('role', 'manager')->count(),
            'supportStaff' => (clone $query)->where('role', 'support')->count(),
            'active' => (clone $query)->where('is_active', true)->where('is_suspended', false)->count(),
            'inactive' => (clone $query)->where(function ($q) {
                $q->where('is_active', false)->orWhere('is_suspended', true);
            })->count(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:255'],
            'role' => ['required', Rule::in(['super_admin', 'manager', 'support'])],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
            'twoFactorEnabled' => ['required', 'boolean'],
        ]);

        $admin = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'is_active' => $data['status'] !== 'inactive',
            'is_suspended' => $data['status'] === 'suspended',
            'two_factor_enabled' => $data['twoFactorEnabled'],
            'password' => Hash::make('password123'),
        ]);

        return response()->json([
            'message' => 'Admin created successfully',
            'admin' => new AdminUserResource($admin),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $id = $this->extractUserId($id);

        $admin = User::whereIn('role', ['super_admin', 'manager', 'support'])->findOrFail($id);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($admin->id)],
            'phone' => ['nullable', 'string', 'max:255'],
            'role' => ['required', Rule::in(['super_admin', 'manager', 'support'])],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
            'twoFactorEnabled' => ['required', 'boolean'],
        ]);

        $admin->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'is_active' => $data['status'] !== 'inactive',
            'is_suspended' => $data['status'] === 'suspended',
            'two_factor_enabled' => $data['twoFactorEnabled'],
        ]);

        return response()->json([
            'message' => 'Admin updated successfully',
            'admin' => new AdminUserResource($admin->fresh()),
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $id = $this->extractUserId($id);

        $admin = User::whereIn('role', ['super_admin', 'manager', 'support'])->findOrFail($id);

        $data = $request->validate([
            'role' => ['required', Rule::in(['super_admin', 'manager', 'support'])],
        ]);

        $admin->update([
            'role' => $data['role'],
        ]);

        return response()->json([
            'message' => 'Admin role updated successfully',
            'admin' => new AdminUserResource($admin->fresh()),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $id = $this->extractUserId($id);

        $admin = User::whereIn('role', ['super_admin', 'manager', 'support'])->findOrFail($id);

        $data = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $admin->update([
            'is_active' => $data['status'] !== 'inactive',
            'is_suspended' => $data['status'] === 'suspended',
        ]);

        return response()->json([
            'message' => 'Admin status updated successfully',
            'admin' => new AdminUserResource($admin->fresh()),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $id = $this->extractUserId($id);

        if ($request->user()->id == $id) {
            return response()->json([
                'message' => 'You cannot delete your own admin account.',
            ], 422);
        }

        $admin = User::whereIn('role', ['super_admin', 'manager', 'support'])->findOrFail($id);
        $admin->delete();

        return response()->json([
            'message' => 'Admin removed successfully',
        ]);
    }

    protected function extractUserId($id): int
    {
        if (str_starts_with($id, 'ADM-')) {
            return (int) ltrim(substr($id, 4), '0');
        }

        return (int) $id;
    }
}
