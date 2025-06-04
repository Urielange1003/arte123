```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    public function index()
    {
        $applications = Application::with(['user', 'documents'])->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $applications,
            'message' => 'Applications retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $application = Application::with(['user', 'documents', 'interview'])->find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $application,
            'message' => 'Application retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'internship_type' => 'required|string',
            'status' => 'required|in:pending,accepted,rejected',
            'rejection_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $application = Application::create($request->all());

        // Create notification for HR
        $hrUsers = User::where('role', 'hr')->get();
        foreach ($hrUsers as $hr) {
            Notification::create([
                'user_id' => $hr->id,
                'title' => 'Nouvelle candidature',
                'content' => "Une nouvelle candidature a été soumise par {$application->user->name}",
                'is_read' => false
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $application,
            'message' => 'Application submitted successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $application = Application::find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'internship_type' => 'string',
            'status' => 'in:pending,accepted,rejected',
            'rejection_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldStatus = $application->status;
        $application->update($request->all());

        // If status changed to accepted, notify student
        if ($oldStatus !== 'accepted' && $application->status === 'accepted') {
            Notification::create([
                'user_id' => $application->user_id,
                'title' => 'Candidature acceptée',
                'content' => 'Votre candidature a été acceptée. Un entretien sera bientôt programmé.',
                'is_read' => false
            ]);
        }

        // If status changed to rejected, notify student
        if ($oldStatus !== 'rejected' && $application->status === 'rejected') {
            Notification::create([
                'user_id' => $application->user_id,
                'title' => 'Candidature rejetée',
                'content' => "Votre candidature a été rejetée. Raison : {$application->rejection_reason}",
                'is_read' => false
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $application,
            'message' => 'Application updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $application = Application::find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }

        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Application deleted successfully'
        ]);
    }
}
```