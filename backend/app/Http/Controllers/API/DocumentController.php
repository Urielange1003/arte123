```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::with('application')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $documents,
            'message' => 'Documents retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $document = Document::with('application')->find($id);

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $document,
            'message' => 'Document retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'application_id' => 'required|exists:applications,id',
            'document_type' => 'required|in:cv,motivation_letter,school_certificate',
            'file' => 'required|file|mimes:pdf|max:5120', // 5MB max
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
        $path = $file->store('documents', 'public');

        $document = Document::create([
            'application_id' => $request->application_id,
            'document_type' => $request->document_type,
            'file_path' => $path,
        ]);

        return response()->json([
            'success' => true,
            'data' => $document,
            'message' => 'Document uploaded successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'document_type' => 'in:cv,motivation_letter,school_certificate',
            'file' => 'file|mimes:pdf|max:5120', // 5MB max
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
            Storage::disk('public')->delete($document->file_path);
            
            // Store new file
            $file = $request->file('file');
            $path = $file->store('documents', 'public');
            $document->file_path = $path;
        }

        if ($request->has('document_type')) {
            $document->document_type = $request->document_type;
        }

        $document->save();

        return response()->json([
            'success' => true,
            'data' => $document,
            'message' => 'Document updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        // Delete file from storage
        Storage::disk('public')->delete($document->file_path);

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully'
        ]);
    }
}
```