```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Stage;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StageController extends Controller
{
    public function index()
    {
        $stages = Stage::with(['user', 'supervisor'])->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $stages,
            'message' => 'Stages retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $stage = Stage::with(['user', 'supervisor', 'presences', 'reports'])->find($id);

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'Stage not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $stage,
            'message' => 'Stage retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'supervisor_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:ongoing,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $stage = Stage::create($request->all());

        // Notify both student and supervisor
        Notification::create([
            'user_id' => $stage->user_id,
            'title' => 'Stage créé',
            'content' => "Votre stage a été créé et débutera le " . 
                        date('d/m/Y', strtotime($stage->start_date)),
            'is_read' => false
        ]);

        Notification::create([
            'user_id' => $stage->supervisor_id,
            'title' => 'Nouveau stagiaire assigné',
            'content' => "Un nouveau stagiaire vous a été assigné : {$stage->user->name}",
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'data' => $stage,
            'message' => 'Stage created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $stage = Stage::find($id);

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'Stage not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'supervisor_id' => 'exists:users,id',
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'status' => 'in:ongoing,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldStatus = $stage->status;
        $stage->update($request->all());

        // If status changed to completed
        if ($oldStatus !== 'completed' && $stage->status === 'completed') {
            Notification::create([
                'user_id' => $stage->user_id,
                'title' => 'Stage terminé',
                'content' => "Votre stage est maintenant terminé. N'oubliez pas de soumettre votre rapport final.",
                'is_read' => false
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $stage,
            'message' => 'Stage updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $stage = Stage::find($id);

        if (!$stage) {
            return response()->json([
                'success' => false,
                'message' => 'Stage not found'
            ], 404);
        }

        // Notify both student and supervisor
        Notification::create([
            'user_id' => $stage->user_id,
            'title' => 'Stage annulé',
            'content' => "Votre stage a été annulé",
            'is_read' => false
        ]);

        Notification::create([
            'user_id' => $stage->supervisor_id,
            'title' => 'Stage annulé',
            'content' => "Le stage de {$stage->user->name} a été annulé",
            'is_read' => false
        ]);

        $stage->delete();

        return response()->json([
            'success' => true,
            'message' => 'Stage deleted successfully'
        ]);
    }
}
```