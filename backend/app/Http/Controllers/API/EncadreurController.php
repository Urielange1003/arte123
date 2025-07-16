<?php

namespace App\Http\Controllers\API; // Correction: Le namespace doit correspondre au dossier /API

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; // Ajout: Manquait pour Request $request
use App\Models\User; // Ajout: Manquait pour les requêtes sur le modèle User
use App\Models\StageDocument; // Ajout: Manquait pour les requêtes sur le modèle StageDocument
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse; // Ajout: Pour les types de retour JsonResponse
use Illuminate\Support\Facades\Validator; // Ajout: Pour une validation plus fine
use Illuminate\Support\Facades\Log; // Ajout: Pour le logging des erreurs

class EncadreurController extends Controller
{
    // Important: Assurez-vous que votre modèle User a une relation ou un champ 'encadreur_id'
    // si vous utilisez User::where('encadreur_id', ...) pour trouver les stagiaires.
    // Idéalement, les informations spécifiques au stagiaire (y compris l'encadreur_id)
    // devraient être dans un modèle Stagiaire séparé, lié au modèle User.

    /**
     * Récupère la liste des stagiaires encadrés par l'utilisateur authentifié.
     * GET /api/encadreur/my-interns (ou /api/encadreurs/stagiaires si vous préférez)
     * Assurez-vous que le rôle 'encadreur' est défini dans votre application.
     *
     * @return JsonResponse
     */
    public function myInterns(): JsonResponse // Renommé de getStagiaires pour être cohérent avec routes/api.php
    {
        $encadreurUser = auth()->user();

        // Vérification du rôle de l'utilisateur authentifié
        // Le middleware 'role:encadreur' devrait déjà gérer ceci sur la route
        if (!$encadreurUser || $encadreurUser->role !== 'encadreur') {
            Log::warning("Accès non autorisé à myInterns par un utilisateur sans rôle 'encadreur'. User ID: " . ($encadreurUser ? $encadreurUser->id : 'N/A'));
            return response()->json(['message' => 'Accès non autorisé. Seuls les encadreurs peuvent accéder à cette ressource.'], 403);
        }

        // Récupère les utilisateurs qui ont l'ID de cet encadreur dans leur champ 'encadreur_id'
        // C'est une hypothèse basée sur votre code. Si 'stagiaires' sont des enregistrements
        // dans une table 'stagiaires' distincte liée à l'utilisateur, ajustez la requête.
        $stagiaires = User::where('encadreur_id', $encadreurUser->id)
                          ->select('id', 'name', 'email')
                          ->get();

        return response()->json($stagiaires);
    }

    /**
     * Valide les documents spécifiques d'un stagiaire par un encadreur.
     * POST /api/encadreurs/{stagiaireId}/valider-documents
     *
     * @param Request $request
     * @param string $stagiaireId L'ID de l'utilisateur stagiaire.
     * @return JsonResponse
     */
    public function validerDocuments(Request $request, string $stagiaireId): JsonResponse
    {
        $encadreurUser = auth()->user();

        if (!$encadreurUser) {
            Log::warning("Tentative de validation de documents par un utilisateur non authentifié.");
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }
        // Le middleware 'role:encadreur' devrait déjà être sur la route pour cette méthode.
        if ($encadreurUser->role !== 'encadreur') {
            Log::warning("Accès non autorisé à validerDocuments par un utilisateur sans rôle 'encadreur'. User ID: {$encadreurUser->id}");
            return response()->json(['message' => 'Accès non autorisé. Seuls les encadreurs peuvent valider les documents.'], 403);
        }

        // Trouver le stagiaire et vérifier qu'il est bien lié à cet encadreur
        // Encore une fois, suppose que 'encadreur_id' est sur le modèle User.
        $stagiaireUser = User::where('id', $stagiaireId)
                             ->where('encadreur_id', $encadreurUser->id)
                             ->first();

        if (!$stagiaireUser) {
            return response()->json(['message' => 'Stagiaire non trouvé ou non lié à cet encadreur.'], 404);
        }

        // Validation des données de la requête
        $validator = Validator::make($request->all(), [
            'badge_remis' => 'boolean',
            'presence_complete' => 'boolean',
            'lettre_fin_stage_signee' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Utilise l'ID de l'utilisateur stagiaire pour le stage_document
            $doc = StageDocument::updateOrCreate(
                ['stagiaire_user_id' => $stagiaireUser->id], // Correction: Utilisez 'stagiaire_user_id' si StageDocument référence l'ID de l'utilisateur stagiaire
                [
                    'badge_remis' => $request->boolean('badge_remis'), // Utilise boolean() pour s'assurer du type
                    'presence_complete' => $request->boolean('presence_complete'),
                    'lettre_fin_stage_signee' => $request->boolean('lettre_fin_stage_signee'),
                    'valide_par_encadreur' => true, // Marque comme validé par l'encadreur
                    'encadreur_user_id' => $encadreurUser->id, // Stocke l'ID de l'encadreur qui a validé
                ]
            );

            Log::info("Documents validés pour stagiaire ID {$stagiaireUser->id} par encadreur ID {$encadreurUser->id}.");
            return response()->json(['message' => 'Documents validés avec succès', 'data' => $doc], 200);

        } catch (\Exception $e) {
            Log::error("Erreur lors de la validation des documents pour stagiaire ID {$stagiaireUser->id}: {$e->getMessage()}", ['exception' => $e]);
            return response()->json(['message' => 'Erreur lors de la validation des documents.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Génère une attestation de fin de stage pour un stagiaire.
     * GET /api/encadreurs/{stagiaireId}/generer-attestation
     *
     * @param string $stagiaireId L'ID de l'utilisateur stagiaire.
     * @return JsonResponse
     */
    public function genererAttestation(string $stagiaireId): JsonResponse
    {
        try {
            // Trouver le document de stage validé pour le stagiaire
            $document = StageDocument::where('stagiaire_user_id', $stagiaireId) // Correction: Utiliser stagiaire_user_id
                                     ->where('valide_par_encadreur', true)
                                     ->firstOrFail();

            // Trouver l'utilisateur stagiaire
            $stagiaireUser = User::findOrFail($stagiaireId);

            // Charger la vue PDF avec les données
            $pdf = Pdf::loadView('attestations.fin_stage', [
                'stagiaire' => $stagiaireUser, // Passe l'objet User du stagiaire
                'date' => now()->format('d/m/Y')
            ]);

            // Nom du fichier PDF
            $fileName = "attestation_fin_stage_stagiaire_{$stagiaireUser->id}.pdf";
            $filePath = "attestations/{$fileName}";

            // Stocker le PDF généré dans le disque 'public' (storage/app/public)
            Storage::disk('public')->put($filePath, $pdf->output());

            // Retourner la réponse avec l'URL accessible publiquement
            Log::info("Attestation générée et stockée pour stagiaire ID {$stagiaireUser->id}. Chemin: {$filePath}");
            return response()->json([
                'message' => 'Attestation générée avec succès.',
                'file_url' => asset("storage/{$filePath}") // Utilise asset() pour générer l'URL publique
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error("Document de stage non trouvé ou non validé pour stagiaire ID {$stagiaireId}. Erreur: {$e->getMessage()}");
            return response()->json(['message' => 'Document de stage non trouvé ou non validé par un encadreur pour ce stagiaire.'], 404);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la génération de l'attestation pour stagiaire ID {$stagiaireId}: {$e->getMessage()}", ['exception' => $e]);
            return response()->json(['message' => 'Une erreur est survenue lors de la génération de l\'attestation.'], 500);
        }
    }
}