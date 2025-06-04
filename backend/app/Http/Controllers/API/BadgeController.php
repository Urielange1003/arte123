```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BadgeController extends Controller
{
    public function index()
    {
        $badges = Badge::with('user')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $badges,
            'message' => 'Badges retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $badge = Badge::with('user')->find($id);

        if (!$badge) {
            return response()->json([
                'success' => false,
                'message' => 'Badge not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $badge,
            'message' => 'Badge retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'badge_number' => 'required|string|unique:badges',
            'issue_date' => 'required|date',
            'return_date' => 'nullable|date|after:issue_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $badge = Badge::create($request->all());

        // Notify student
        Notification::create([
            'user_id' => $badge->user_id,
            'title' => 'Badge attribué',
            'content' => "Votre badge temporaire n°{$badge->badge_number} est disponible",
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'data' => $badge,
            'message' => 'Badge created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $badge = Badge::find($id);

        if (!$badge) {
            return response()->json([
                'success' => false,
                'message' => 'Badge not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'badge_number' => 'string|unique:badges,badge_number,' . $badge->id,
            'issue_date' => 'date',
            'return_date' => 'nullable|date|after:issue_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $badge->update($request->all());

        // If return date is set, notify student
        if ($request->has('return_date') && !$badge->getOriginal('return_date')) {
            Notification::create([
                'user_id' => $badge->user_id,
                'title' => 'Retour de badge',
                'content' => "Votre badge doit être retourné avant le " . 
                            date('d/m/Y', strtotime($badge->return_date)),
                'is_read' => false
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $badge,
            'message' => 'Badge updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $badge = Badge::find($id);

        if (!$badge) {
            return response()->json([
                'success' => false,
                'message' => 'Badge not found'
            ], 404);
        }

        $badge->delete();

        return response()->json([
            'success' => true,
            'message' => 'Badge deleted successfully'
        ]);
    }
}
```