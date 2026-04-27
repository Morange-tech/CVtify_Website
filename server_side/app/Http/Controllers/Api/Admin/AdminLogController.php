<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminLogResource;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class AdminLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user');

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('severity') && $request->severity !== 'all') {
            $query->where('severity', $request->severity);
        }

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('actor_role', $request->role);
        }

        if ($request->filled('tab') && $request->tab !== 'all') {
            match ($request->tab) {
                'admin' => $query->where(function ($q) {
                    $q->where('actor_role', 'admin')
                      ->orWhereIn('type', ['admin_action', 'settings_changed', 'template_added']);
                }),
                'logins' => $query->whereIn('type', ['user_login', 'user_logout', 'user_registered']),
                'cv' => $query->where('type', 'like', 'cv_%'),
                'payments' => $query->where(function ($q) {
                    $q->where('type', 'like', 'payment_%')
                      ->orWhere('type', 'premium_upgrade');
                }),
                'errors' => $query->whereIn('severity', ['error', 'warning']),
                default => null,
            };
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('actor', 'like', "%{$search}%")
                  ->orWhere('actor_email', 'like', "%{$search}%")
                  ->orWhere('log_code', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'newest');
        if ($sort === 'oldest') {
            $query->orderBy('created_at');
        } else {
            $query->orderByDesc('created_at');
        }

        $limit = (int) $request->get('limit', 100);
        $logs = $query->paginate($limit);

        return response()->json([
            'logs' => AdminLogResource::collection($logs->items()),
            'pagination' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    public function show($id)
    {
        $log = ActivityLog::with('user')
            ->where('id', $id)
            ->orWhere('log_code', $id)
            ->firstOrFail();

        return response()->json([
            'log' => new AdminLogResource($log),
        ]);
    }

    public function stats()
    {
        $today = now()->startOfDay();

        return response()->json([
            'total' => ActivityLog::count(),
            'today' => ActivityLog::where('created_at', '>=', $today)->count(),
            'admin' => ActivityLog::where(function ($q) {
                $q->where('actor_role', 'admin')
                  ->orWhereIn('type', ['admin_action', 'settings_changed', 'template_added']);
            })->count(),
            'logins' => ActivityLog::whereIn('type', ['user_login', 'user_logout', 'user_registered'])->count(),
            'cv' => ActivityLog::where('type', 'like', 'cv_%')->count(),
            'payments' => ActivityLog::where(function ($q) {
                $q->where('type', 'like', 'payment_%')
                  ->orWhere('type', 'premium_upgrade');
            })->count(),
            'errors' => ActivityLog::whereIn('severity', ['error', 'warning'])->count(),
        ]);
    }

    public function destroy($id)
    {
        $log = ActivityLog::where('id', $id)
            ->orWhere('log_code', $id)
            ->firstOrFail();

        $log->delete();

        return response()->json([
            'message' => 'Log deleted successfully',
        ]);
    }

    public function clear(Request $request)
    {
        $query = ActivityLog::query();

        if ($request->filled('severity') && $request->severity !== 'all') {
            $query->where('severity', $request->severity);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $count = $query->count();
        $query->delete();

        return response()->json([
            'message' => "{$count} logs cleared successfully",
        ]);
    }
}
