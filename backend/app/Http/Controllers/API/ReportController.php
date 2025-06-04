```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['stage', 'validator'])->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reports,
            'message' => 'Reports retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $report = Report::with(['stage', 'validator'])->find($id);

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Report not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $report,
            'message' => 'Report retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'stage_id' => 'required|exists:stages,id',
            'file' => 'required|file|mimes:pdf|max:10240', // 10MB max
            'validated_by' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Store file
        $file = $request->file('file');
        $path = $file->store('reports', 'public');

        $report = Report::create([
            'stage_id' => $request->stage_id,
            'file_path' => $path,
            'validated_by' => $request->validated_by,
        ]);

        // Notify supervisor
        Notification::create([
            'user_id' => $report->stage->supervisor_id,
            'title' => 'Nouveau rapport',
            'content' => "Un nouveau rapport a été soumis par {$report->stage->user->name}",
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'data' => $report,
            'message' => 'Report uploaded successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $report = Report::find($id);

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Report not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'file' => 'file|mimes:pdf|max:10240', // 10MB max
            'validated_by' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->hasFile('file')) {
            // Delete old file
            Storage::disk('public')->delete($report->file_path);
            
            // Store new file
            $file = $request->file('file');
            $path = $file->store('reports', 'public');
            $report->file_path = $path;
        }

        if ($request->has('validated_by')) {
            $report->validated_by = $request->validated_by;
            
            // Notify student
            Notification::create([
                'user_id' => $report->stage->user_id,
                'title' => 'Rapport validé',
                'content' => "Votre rapport a été validé",
                'is_read' => false
            ]);
        }

        $report->save();

        return response()->json([
            'success' => true,
            'data' => $report,
            'message' => 'Report updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $report = Report::find($id);

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Report not found'
            ], 404);
        }

        // Delete file from storage
        Storage::disk('public')->delete($report->file_path);

        $report->delete();

        return response()->json([
            'success' => true,
            'message' => 'Report deleted successfully'
        ]);
    }
}
```