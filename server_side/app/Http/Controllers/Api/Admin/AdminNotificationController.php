<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use App\Models\AdminNotificationSetting;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = AdminNotification::query();

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('status') && $request->status === 'unread') {
            $query->where('is_read', false);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%")
                  ->orWhere('user_email', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'newest');

        $query->orderByDesc('is_pinned');

        if ($sort === 'oldest') {
            $query->orderBy('created_at');
        } else {
            $query->orderByDesc('created_at');
        }

        $limit = (int) $request->get('limit', 100);

        $notifications = $query->paginate($limit);

        return response()->json([
            'notifications' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    public function show($id)
    {
        $notification = AdminNotification::findOrFail($id);

        return response()->json($notification);
    }

    public function stats()
    {
        $notifications = AdminNotification::query();

        $today = now()->startOfDay();

        return response()->json([
            'total' => $notifications->count(),
            'unread' => AdminNotification::where('is_read', false)->count(),
            'new_user' => AdminNotification::where('type', 'new_user')->count(),
            'premium_request' => AdminNotification::where('type', 'premium_request')->count(),
            'payment' => AdminNotification::where('type', 'payment')->count(),
            'new_message' => AdminNotification::where('type', 'new_message')->count(),
            'today' => AdminNotification::where('created_at', '>=', $today)->count(),
            'unread_by_type' => [
                'new_user' => AdminNotification::where('type', 'new_user')->where('is_read', false)->count(),
                'premium_request' => AdminNotification::where('type', 'premium_request')->where('is_read', false)->count(),
                'payment' => AdminNotification::where('type', 'payment')->where('is_read', false)->count(),
                'new_message' => AdminNotification::where('type', 'new_message')->where('is_read', false)->count(),
            ],
        ]);
    }

    public function markRead(Request $request, $id)
    {
        $request->validate([
            'isRead' => ['required', 'boolean'],
        ]);

        $notification = AdminNotification::findOrFail($id);
        $notification->update([
            'is_read' => $request->boolean('isRead'),
        ]);

        return response()->json([
            'message' => 'Notification updated successfully',
            'notification' => $notification->fresh(),
        ]);
    }

    public function togglePin(Request $request, $id)
    {
        $request->validate([
            'isPinned' => ['required', 'boolean'],
        ]);

        $notification = AdminNotification::findOrFail($id);
        $notification->update([
            'is_pinned' => $request->boolean('isPinned'),
        ]);

        return response()->json([
            'message' => 'Notification pin status updated successfully',
            'notification' => $notification->fresh(),
        ]);
    }

    public function markAllRead()
    {
        AdminNotification::where('is_read', false)->update([
            'is_read' => true,
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    public function clearRead()
    {
        AdminNotification::where('is_read', true)
            ->where('is_pinned', false)
            ->delete();

        return response()->json([
            'message' => 'Read notifications cleared',
        ]);
    }

    public function destroy($id)
    {
        $notification = AdminNotification::findOrFail($id);
        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully',
        ]);
    }

    public function settings(Request $request)
    {
        $user = $request->user();

        $settings = AdminNotificationSetting::firstOrCreate(
            ['admin_user_id' => $user->id],
            [
                'new_user' => true,
                'premium_request' => true,
                'payment' => true,
                'new_message' => true,
                'sound' => true,
                'desktop' => true,
                'email' => false,
            ]
        );

        return response()->json([
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'new_user' => ['required', 'boolean'],
            'premium_request' => ['required', 'boolean'],
            'payment' => ['required', 'boolean'],
            'new_message' => ['required', 'boolean'],
            'sound' => ['required', 'boolean'],
            'desktop' => ['required', 'boolean'],
            'email' => ['required', 'boolean'],
        ]);

        $user = $request->user();

        $settings = AdminNotificationSetting::updateOrCreate(
            ['admin_user_id' => $user->id],
            $data
        );

        return response()->json([
            'message' => 'Notification settings updated successfully',
            'settings' => $settings,
        ]);
    }
}
