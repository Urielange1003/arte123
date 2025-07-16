<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // AJOUTÉ : Import pour la gestion des fichiers

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

    /**
     * Gère la soumission d'une nouvelle candidature via le formulaire public (non authentifié).
     * C'est la méthode cible pour la route /api/apply.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storePublicApplication(Request $request)
    {
        // 1. Validation des données du formulaire
        // Les noms des champs ici DOIVENT correspondre EXACTEMENT aux noms envoyés depuis le frontend (FormData)
        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:applications,email', // Vérifie que l'email n'a pas déjà soumis une candidature
            'phone' => 'required|string|max:20',
            'field' => 'required|string|max:255',
            'school' => 'required|string|max:255',
            'duration' => 'required|numeric|min:1|max:6', // Exemple de durée en mois
            'startDate' => 'required|date|after_or_equal:today', // Date de début doit être aujourd'hui ou après
            'endDate' => 'required|date|after_or_equal:startDate',
            'motivation' => 'required|string|max:5000', // Lettre de motivation
            'cv' => 'required|file|mimes:pdf|max:5120', // Fichier PDF, max 5MB (5120 KB)
            'certificate' => 'required|file|mimes:pdf|max:5120',
            'cni' => 'required|file|mimes:pdf|max:5120',
        ]);

        if ($validator->fails()) {
            // Retourne les erreurs de validation au frontend (statut 422 Unprocessable Entity)
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Récupère seulement les données validées
        $validatedData = $validator->validated();

        // Initialisation des chemins des fichiers pour gérer les erreurs
        $cvPath = null;
        $certificatePath = null;
        $cniPath = null;

        // 2. Traitement et stockage des fichiers
        try {
            if ($request->hasFile('cv')) {
                $cvPath = $request->file('cv')->store('applications/cvs', 'public');
            }
            if ($request->hasFile('certificate')) {
                $certificatePath = $request->file('certificate')->store('applications/certificates', 'public');
            }
            if ($request->hasFile('cni')) {
                $cniPath = $request->file('cni')->store('applications/cnis', 'public');
            }

        } catch (\Exception $e) {
            // Gérer les erreurs de téléchargement de fichiers
            \Log::error("Erreur lors de l'upload des fichiers de candidature : " . $e->getMessage());
            // Nettoyer les fichiers partiellement téléchargés en cas d'erreur ici
            if ($cvPath) Storage::disk('public')->delete($cvPath);
            if ($certificatePath) Storage::disk('public')->delete($certificatePath);
            if ($cniPath) Storage::disk('public')->delete($cniPath);

            return response()->json(['message' => 'Impossible de télécharger les fichiers. Veuillez réessayer.'], 500);
        }


        // 3. Création de l'entrée dans la base de données
        try {
            $application = Application::create([
                'full_name' => $validatedData['fullName'],
                'email' => $validatedData['email'],
                'phone' => $validatedData['phone'],
                'field' => $validatedData['field'],
                'school' => $validatedData['school'],
                'duration' => $validatedData['duration'],
                'start_date' => $validatedData['startDate'],
                'end_date' => $validatedData['endDate'],
                'motivation_letter' => $validatedData['motivation'],
                'cv_path' => $cvPath,
                'certificate_path' => $certificatePath,
                'cni_path' => $cniPath,
                'status' => 'pending', // Définir un statut par défaut pour les nouvelles candidatures
                // 'user_id' => null, // La candidature n'est pas encore liée à un user_id si non connecté
            ]);

            // 4. Création de notification pour les utilisateurs RH (ou admins)
            $rhUsers = User::where('role', 'rh')->get();
            foreach ($rhUsers as $rh) {
                Notification::create([
                    'user_id' => $rh->id,
                    'title' => 'Nouvelle candidature soumise',
                    'content' => "Une nouvelle candidature a été soumise par {$application->full_name}.",
                    'is_read' => false,
                    'link' => '/admin/applications/' . $application->id,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Votre candidature a été soumise avec succès !',
                'data' => $application
            ], 201); // 201 Created

        } catch (\Exception $e) {
            // En cas d'erreur de base de données ou autre après l'upload des fichiers
            // Il est bon de nettoyer les fichiers uploadés si la BDD échoue
            if ($cvPath) Storage::disk('public')->delete($cvPath);
            if ($certificatePath) Storage::disk('public')->delete($certificatePath);
            if ($cniPath) Storage::disk('public')->delete($cniPath);

            \Log::error("Erreur de BDD ou autre après upload des fichiers : " . $e->getMessage());
            return response()->json(['message' => 'Impossible de soumettre la candidature. Erreur interne du serveur.'], 500);
        }
    }


    // La méthode 'store' existante (pour les utilisateurs connectés)
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
        $rhUsers = User::where('role', 'rh')->get();
        foreach ($rhUsers as $rh) {
            Notification::create([
                'user_id' => $rh->id,
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
        ], 200); // 200 OK pour une suppression réussie
    }
}