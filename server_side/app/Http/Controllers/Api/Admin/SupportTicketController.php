<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SupportTicketController extends Controller
{
    public function index()
    {
        try {
            $tickets = SupportTicket::with(['user', 'messages'])
                ->orderByDesc('updated_at')
                ->get()
                ->map(function ($ticket) {
                    return [
                        'id' => (string) $ticket->id,
                        'userId' => $ticket->user_id,
                        'userName' => $ticket->user?->name ?? 'Unknown User',
                        'userEmail' => $ticket->user?->email ?? '',
                        'isPremiumUser' => ($ticket->user?->subscription_status === 'active'),
                        'subject' => $ticket->subject,
                        'category' => $ticket->category,
                        'priority' => $ticket->priority,
                        'status' => $ticket->status,
                        'isRead' => (bool) $ticket->is_read,
                        'isStarred' => (bool) $ticket->is_starred,
                        'createdAt' => $ticket->created_at ? $ticket->created_at->toIso8601String() : null,
                        'updatedAt' => $ticket->updated_at ? $ticket->updated_at->toIso8601String() : null,
                        'conversation' => $ticket->messages->map(function ($message) {
                            return [
                                'id' => (string) $message->id,
                                'sender' => $message->sender,
                                'senderName' => $message->sender_name,
                                'message' => $message->message,
                                'timestamp' => $message->created_at ? $message->created_at->toIso8601String() : null,
                                'attachments' => [],
                            ];
                        })->values(),
                    ];
                });

            return response()->json($tickets);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'message' => ['required', 'string'],
        ]);

        DB::transaction(function () use ($ticket, $validated) {
            SupportTicketMessage::create([
                'support_ticket_id' => $ticket->id,
                'sender' => 'admin',
                'sender_name' => 'Support Team',
                'message' => $validated['message'],
            ]);

            if ($ticket->status === 'open') {
                $ticket->status = 'in-progress';
            }

            $ticket->is_read = true;
            $ticket->touch();
            $ticket->save();
        });

        return response()->json(['success' => true]);
    }

    public function updateStatus(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['open', 'in-progress', 'resolved', 'closed'])],
        ]);

        $ticket->status = $validated['status'];
        $ticket->save();

        return response()->json(['success' => true]);
    }

    public function toggleRead(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'isRead' => ['required', 'boolean'],
        ]);

        $ticket->is_read = $validated['isRead'];
        $ticket->save();

        return response()->json(['success' => true]);
    }

    public function toggleStar(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'isStarred' => ['required', 'boolean'],
        ]);

        $ticket->is_starred = $validated['isStarred'];
        $ticket->save();

        return response()->json(['success' => true]);
    }

    public function destroy(SupportTicket $ticket)
    {
        $ticket->delete();

        return response()->json(['success' => true]);
    }

    public function stats()
    {
        $total = SupportTicket::count();
        $open = SupportTicket::where('status', 'open')->count();
        $inProgress = SupportTicket::where('status', 'in-progress')->count();
        $resolved = SupportTicket::where('status', 'resolved')->count();
        $closed = SupportTicket::where('status', 'closed')->count();
        $unread = SupportTicket::where('is_read', false)->count();
        $starred = SupportTicket::where('is_starred', true)->count();
        $urgent = SupportTicket::whereIn('priority', ['urgent', 'high'])->count();

        return response()->json([
            'total' => $total,
            'open' => $open,
            'inProgress' => $inProgress,
            'resolved' => $resolved,
            'closed' => $closed,
            'unread' => $unread,
            'starred' => $starred,
            'urgent' => $urgent,
        ]);
    }
}
