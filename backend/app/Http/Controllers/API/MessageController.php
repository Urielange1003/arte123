```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $messages,
            'message' => 'Messages retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $message = Message::with(['sender', 'receiver'])->find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $message,
            'message' => 'Message retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'attachment' => 'nullable|file|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $messageData = $request->only(['sender_id', 'receiver_id', 'content']);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('messages/attachments', 'public');
            $messageData['attachment_path'] = $path;
        }

        $message = Message::create($messageData);

        // Notify receiver
        Notification::create([
            'user_id' => $message->receiver_id,
            'title' => 'Nouveau message',
            'content' => "Vous avez reçu un nouveau message de {$message->sender->name}",
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'data' => $message,
            'message' => 'Message sent successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'string',
            'attachment' => 'file|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('content')) {
            $message->content = $request->content;
        }

        if ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($message->attachment_path) {
                Storage::disk('public')->delete($message->attachment_path);
            }
            
            // Store new attachment
            $file = $request->file('attachment');
            $path = $file->store('messages/attachments', 'public');
            $message->attachment_path = $path;
        }

        $message->save();

        return response()->json([
            'success' => true,
            'data' => $message,
            'message' => 'Message updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found'
            ], 404);
        }

        // Delete attachment if exists
        if ($message->attachment_path) {
            Storage::disk('public')->delete($message->attachment_path);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully'
        ]);
    }

    public function getConversation(Request $request, $userId)
    {
        $messages = Message::where(function($query) use ($request, $userId) {
                $query->where('sender_id', $request->user()->id)
                      ->where('receiver_id', $userId);
            })
            ->orWhere(function($query) use ($request, $userId) {
                $query->where('sender_id', $userId)
                      ->where('receiver_id', $request->user()->id);
            })
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $messages,
            'message' => 'Conversation retrieved successfully'
        ]);
    }
}
```