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
    public function generateInternshipLetter($internshipId)
    {
        // Récupérer les données nécessaires (stagiaire, détails du stage, encadreur, etc.)
        // Assurez-vous d'implémenter votre logique de récupération de données ici
        $stagiaire = User::where('role', 'stagiaire')->find($internshipId); // Exemple
        if (!$stagiaire) {
            return response()->json(['message' => 'Stagiaire non trouvé.'], 404);
        }

        $data = [
            'stagiaireName' => $stagiaire->name,
            'stagiaireEmail' => $stagiaire->email,
            'startDate' => '01/07/2025', // Remplacer par des données réelles
            'endDate' => '30/09/2025',   // Remplacer par des données réelles
            'companyName' => 'Camrail',
            'rhName' => 'Nom du RH',
            'rhTitle' => 'Responsable RH',
            'currentDate' => now()->format('d/m/Y'),
            'contactEmail' => 'rh@camrail.cm',
        ];

        // Charger la vue Blade qui contient le modèle de la lettre
        $pdf = PDF::loadView('documents.internship_letter', $data);

        // Retourner le PDF pour le téléchargement
        return $pdf->download("Lettre_de_stage_{$stagiaire->name}.pdf");
        // Ou pour l'afficher dans le navigateur: return $pdf->stream("Lettre_de_stage_{$stagiaire->name}.pdf");
    }

    public function generateCertificate($internshipId)
    {
        // Similaire à la fonction ci-dessus, mais pour l'attestation
        $stagiaire = User::where('role', 'stagiaire')->find($internshipId);
        if (!$stagiaire) {
            return response()->json(['message' => 'Stagiaire non trouvé.'], 404);
        }

        $data = [
            'stagiaireName' => $stagiaire->name,
            'startDate' => '01/07/2025',
            'endDate' => '30/09/2025',
            'companyName' => 'Camrail',
            'rhName' => 'Nom du RH',
            'currentDate' => now()->format('d/m/Y'),
            // ... d'autres données nécessaires pour l'attestation
        ];

        $pdf = PDF::loadView('documents.certificate_of_completion', $data);
        return $pdf->download("Attestation_fin_de_stage_{$stagiaire->name}.pdf");
    }
}