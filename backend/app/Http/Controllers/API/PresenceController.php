<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Presence;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PresenceController extends Controller
{
    public function index()
    {
        $presences = Presence::with('stage')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $presences,
            'message' => 'Presences retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $presence = Presence::with('stage')->find($id);

        if (!$presence) {
            return response()->json([
                'success' => false,
                'message' => 'Presence not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $presence,
            'message' => 'Presence retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'stage_id' => 'required|exists:stages,id',
            'date' => 'required|date',
            'is_present' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $presence = Presence::create($request->all());

        // If absent, notify supervisor
        if (!$presence->is_present) {
            Notification::create([
                'user_id' => $presence->stage->supervisor_id,
                'title' => 'Absence signalée',
                'content' => "L'étudiant {$presence->stage->user->name} est absent aujourd'hui",
                'is_read' => false
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $presence,
            'message' => 'Presence recorded successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $presence = Presence::find($id);

        if (!$presence) {
            return response()->json([
                'success' => false,
                'message' => 'Presence not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'date',
            'is_present' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $presence->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $presence,
            'message' => 'Presence updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $presence = Presence::find($id);

        if (!$presence) {
            return response()->json([
                'success' => false,
                'message' => 'Presence not found'
            ], 404);
        }

        $presence->delete();

        return response()->json([
            'success' => true,
            'message' => 'Presence deleted successfully'
        ]);
    }
}