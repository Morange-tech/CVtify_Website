<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SupportTicketController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['general', 'bug', 'billing', 'feature', 'account', 'template'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'message' => ['required', 'string'],
        ]);

        $user = $request->user();

        $ticket = DB::transaction(function () use ($user, $validated) {
            $ticket = SupportTicket::create([
                'user_id' => $user->id,
                'subject' => $validated['subject'],
                'category' => $validated['category'],
                'priority' => $validated['priority'],
                'status' => 'open',
                'is_read' => false,
                'is_starred' => false,
            ]);

            SupportTicketMessage::create([
                'support_ticket_id' => $ticket->id,
                'sender' => 'user',
                'sender_name' => $user->name,
                'message' => $validated['message'],
            ]);

            return $ticket;
        });

        return response()->json([
            'success' => true,
            'ticketId' => $ticket->id,
        ], 201);
    }
}
