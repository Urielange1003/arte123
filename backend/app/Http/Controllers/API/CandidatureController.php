<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\Document;
use App\Models\Stage; // Assurez-vous d'importer le modèle Stage
use App\Models\User; // Pour vérifier le rôle de l'encadreur
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB; // Pour les transactions
use Illuminate\Validation\Rule; // Pour les règles de validation

class CandidatureController extends Controller
{
    /**
     * Store a newly created candidature in storage.
     * Soumet une nouvelle candidature par un stagiaire.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'cv_file' => 'required|file|mimes:pdf|max:5120', // 5MB
            'certif_scolarite_file' => 'required|file|mimes:pdf|max:5120',
            'lettre_motivation_text' => 'required|string|max:2000',
            // stagiaire_id est pris de l'utilisateur authentifié
        ]);

        // S'assurer que seul un stagiaire peut soumettre une candidature pour lui-même
        if (auth()->user()->role !== 'stagiaire') {
            return response()->json(['message' => 'Accès non autorisé : Seuls les stagiaires peuvent soumettre une candidature.'], 403);
        }

        // Vérifier si le stagiaire a déjà une candidature en attente, acceptée ou validée (pour éviter les doublons)
        $existingCandidature = Candidature::where('stagiaire_id', auth()->user()->id)
            ->whereIn('statut', ['en_attente', 'acceptée', 'validée'])
            ->first();
        if ($existingCandidature) {
            return response()->json(['message' => 'Vous avez déjà une candidature en cours ou validée.'], 409); // 409 Conflict
        }

        DB::beginTransaction();
        try {
            // Traitement du CV
            $cvPath = $request->file('cv_file')->store('documents/cvs', 'public');
            $cvDocument = Document::create([
                'nom_fichier' => $request->file('cv_file')->getClientOriginalName(),
                'chemin_fichier' => $cvPath,
                'type_document' => 'CV',
                'utilisateur_id' => auth()->user()->id,
                'candidature_id' => null, // Sera mis à jour après la création de la candidature
                'date_upload' => now(),
            ]);

            // Traitement du Certificat de Scolarité
            $certifPath = $request->file('certif_scolarite_file')->store('documents/certificats', 'public');
            $certifDocument = Document::create([
                'nom_fichier' => $request->file('certif_scolarite_file')->getClientOriginalName(),
                'chemin_fichier' => $certifPath,
                'type_document' => 'Certificat de scolarité',
                'utilisateur_id' => auth()->user()->id,
                'candidature_id' => null, // Sera mis à jour après la création de la candidature
                'date_upload' => now(),
            ]);

            // Création de la candidature
            $candidature = Candidature::create([
                'stagiaire_id' => auth()->user()->id,
                'date_candidature' => now(),
                'statut' => 'en_attente',
                'date_statut_change' => now(),
                'commentaires_rh' => $request->lettre_motivation_text, // Utilisation de ce champ pour la lettre de motivation
                'cv_document_id' => $cvDocument->id,
                'certif_scolarite_document_id' => $certifDocument->id,
                'lettre_stage_document_id' => null, // Pas encore générée
                'stage_id' => null, // Pas encore assigné
            ]);

            // Associer les documents à la candidature après sa création
            $cvDocument->update(['candidature_id' => $candidature->id]);
            $certifDocument->update(['candidature_id' => $candidature->id]);

            DB::commit();
            return response()->json([
                'message' => 'Candidature soumise avec succès!',
                'candidature' => $candidature->load('stagiaire.user', 'documents') // Charger les relations pour la réponse
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            // Supprimer les fichiers si la transaction échoue
            if (isset($cvPath)) Storage::disk('public')->delete($cvPath);
            if (isset($certifPath)) Storage::disk('public')->delete($certifPath);
            return response()->json([
                'message' => 'Erreur lors de la soumission de la candidature.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of the candidatures.
     * Affiche la liste des candidatures.
     * Pourrait être filtré par rôle (RH voit tout, Stagiaire voit les siennes).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $candidatures = Candidature::query();

        if ($user->role === 'stagiaire') {
            // Un stagiaire ne voit que ses propres candidatures
            $candidatures->where('stagiaire_id', $user->id);
        } elseif ($user->role === 'rh' || $user->role === 'admin') {
            // RH et Admin voient toutes les candidatures (ou peuvent filtrer)
            // Possibilité d'ajouter des filtres basés sur $request (e.g. statut, stage_id)
            if ($request->has('statut')) {
                $candidatures->where('statut', $request->statut);
            }
        } else {
            return response()->json(['message' => 'Accès non autorisé pour la consultation des candidatures.'], 403);
        }

        $candidatures->with(['stagiaire.user', 'stage', 'cvDocument', 'certifScolariteDocument', 'lettreStageDocument']); // Charger les relations nécessaires

        return response()->json([
            'success' => true,
            'message' => 'Liste des candidatures récupérée avec succès.',
            'data' => $candidatures->get(),
        ], 200);
    }

    /**
     * Display the specified candidature.
     * Affiche les détails d'une candidature spécifique.
     *
     * @param  \App\Models\Candidature  $candidature
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Candidature $candidature)
    {
        $user = auth()->user();

        // Vérifier si le stagiaire essaie de voir sa propre candidature, ou si c'est un RH/Admin
        if ($user->role === 'stagiaire' && $candidature->stagiaire_id !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé : Cette candidature ne vous appartient pas.'], 403);
        } elseif ($user->role !== 'stagiaire' && $user->role !== 'rh' && $user->role !== 'admin' && $user->role !== 'encadreur') {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }
        // Un encadreur pourrait voir une candidature si le stage lui est assigné, etc. (logique à affiner)

        // Charger les relations pour une vue détaillée
        $candidature->load('stagiaire.user', 'stage.encadreur', 'cvDocument', 'certifScolariteDocument', 'lettreStageDocument');

        return response()->json([
            'success' => true,
            'message' => 'Détails de la candidature récupérés avec succès.',
            'data' => $candidature,
        ], 200);
    }

    /**
     * Validate a specific candidature by RH.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Candidature  $candidature
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateCandidature(Request $request, Candidature $candidature)
    {
        // Vérifier les permissions (middleware can:isRh est plus propre)
        if (auth()->user()->role !== 'rh') {
            return response()->json(['message' => 'Accès non autorisé : Seuls les RH peuvent valider les candidatures.'], 403);
        }

        // Assurez-vous que la candidature est en attente avant de la valider
        if ($candidature->statut !== 'en_attente') {
            return response()->json(['message' => 'La candidature doit être en statut "en_attente" pour être validée.'], 409); // 409 Conflict
        }

        $request->validate([
            'titre_stage' => 'required|string|max:255',
            'description_stage' => 'required|string',
            'date_debut_stage' => 'required|date',
            'date_fin_stage' => 'required|date|after_or_equal:date_debut_stage',
            'type_stage' => 'required|in:Ouvrier,Technicien,Ingénieur',
            'departement_id' => 'required|exists:departements,id',
            'encadreur_id' => [
                'required',
                'exists:users,id',
                Rule::exists('users', 'id')->where(function ($query) {
                    return $query->where('role', 'encadreur'); // Vérifie que l'ID appartient à un encadreur
                }),
            ],
            'commentaires_rh' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Créer le stage
            $stage = Stage::create([
                'titre' => $request->titre_stage,
                'description' => $request->description_stage,
                'date_debut' => $request->date_debut_stage,
                'date_fin' => $request->date_fin_stage,
                'type_stage' => $request->type_stage,
                'departement_id' => $request->departement_id,
                'encadreur_id' => $request->encadreur_id,
                'statut_stage' => 'actif',
            ]);

            // Mettre à jour la candidature
            $candidature->update([
                'statut' => 'validée',
                'date_statut_change' => now(),
                'stage_id' => $stage->id,
                'commentaires_rh' => $request->commentaires_rh,
            ]);

            // Générer la lettre de stage (simplifié ici, un vrai PDF nécessiterait une bibliothèque comme Dompdf ou Snappy)
            $letterContent = "Lettre de stage pour " . $candidature->stagiaire->user->name . " (Matricule: " . $candidature->stagiaire->matricule . ") pour le stage \"" . $stage->titre . "\" du " . $stage->date_debut . " au " . $stage->date_fin . ". Encadré par " . $stage->encadreur->name . ".";
            $letterFileName = 'Lettre_Stage_' . $candidature->stagiaire->matricule . '_' . time() . '.pdf';
            $letterPath = 'documents/lettres_stage/' . $letterFileName;
            Storage::disk('public')->put($letterPath, $letterContent);

            $letterDocument = Document::create([
                'nom_fichier' => $letterFileName,
                'chemin_fichier' => $letterPath,
                'type_document' => 'Lettre de stage',
                'utilisateur_id' => auth()->user()->id, // L'utilisateur RH qui génère
                'candidature_id' => $candidature->id,
                'date_upload' => now(),
            ]);
            $candidature->update(['lettre_stage_document_id' => $letterDocument->id]);


            DB::commit();
            return response()->json([
                'message' => 'Candidature validée et stage créé avec succès.',
                'candidature' => $candidature->load('stagiaire.user', 'stage', 'lettreStageDocument'),
                'stage' => $stage->load('departement', 'encadreur')
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            // Supprimer le stage si créé avant l'échec de la transaction (uniquement si le commit n'a pas eu lieu)
            if (isset($stage) && $stage->exists) {
                $stage->delete(); // Supprimer le stage si transaction rollback
            }
            // Supprimer la lettre de stage si elle a été créée avant l'échec
            if (isset($letterPath) && Storage::disk('public')->exists($letterPath)) {
                Storage::disk('public')->delete($letterPath);
            }

            return response()->json([
                'message' => 'Erreur lors de la validation de la candidature.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Reject a specific candidature by RH.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Candidature  $candidature
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectCandidature(Request $request, Candidature $candidature)
    {
        // Vérifier les permissions
        if (auth()->user()->role !== 'rh') {
            return response()->json(['message' => 'Accès non autorisé : Seuls les RH peuvent refuser les candidatures.'], 403);
        }

        // Assurez-vous que la candidature est en attente ou acceptée avant de la refuser
        if (!in_array($candidature->statut, ['en_attente', 'acceptée'])) {
            return response()->json(['message' => 'La candidature ne peut être refusée que si elle est "en attente" ou "acceptée".'], 409); // 409 Conflict
        }

        $request->validate([
            'commentaires_rh' => 'nullable|string', // Optionnel pour la raison du refus
        ]);

        $candidature->update([
            'statut' => 'refusée',
            'date_statut_change' => now(),
            'commentaires_rh' => $request->commentaires_rh,
            'stage_id' => null, // S'il y avait un stage lié, le délier
            'lettre_stage_document_id' => null, // S'il y avait une lettre, la délier
        ]);

        // Optionnel : Supprimer les documents liés si le refus signifie qu'ils ne sont plus pertinents.
        // Soyez prudent avec la suppression physique de fichiers.

        return response()->json([
            'message' => 'Candidature refusée avec succès.',
            'candidature' => $candidature->load('stagiaire.user')
        ], 200);
    }

    /**
     * Update the specified candidature in storage.
     * Cette méthode pourrait être utilisée par un RH/Admin pour modifier des aspects
     * d'une candidature qui ne sont pas liés à sa validation (e.g. corriger une faute).
     * Les statuts de validation devraient passer par `validateCandidature` ou `rejectCandidature`.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Candidature  $candidature
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Candidature $candidature)
    {
        $user = auth()->user();

        // Seuls les RH et Admin peuvent modifier une candidature après sa soumission.
        // Un stagiaire pourrait peut-être modifier certains de ses documents avant validation.
        if ($user->role !== 'rh' && $user->role !== 'admin') {
            // Logique plus fine si un stagiaire peut modifier (e.g., s'il est l'auteur et statut 'en_attente')
            // if ($user->role === 'stagiaire' && $candidature->stagiaire_id === $user->id && $candidature->statut === 'en_attente') {
            //    // Autoriser certaines modifications, ex: re-uploader un document.
            // } else {
                 return response()->json(['message' => 'Accès non autorisé pour la modification de candidature.'], 403);
            // }
        }

        $request->validate([
            'statut' => [
                'sometimes',
                Rule::in(['en_attente', 'acceptée', 'refusée', 'validée', 'annulée'])
            ],
            'commentaires_rh' => 'nullable|string',
            'commentaires_encadreur' => 'nullable|string',
            'stage_id' => 'sometimes|nullable|exists:stages,id',
            // Si vous autorisez la mise à jour des documents existants via cette route:
            // 'cv_file' => 'sometimes|file|mimes:pdf|max:5120',
            // 'certif_scolarite_file' => 'sometimes|file|mimes:pdf|max:5120',
            // 'lettre_stage_document_id' => 'sometimes|nullable|exists:documents,id',
        ]);

        DB::beginTransaction();
        try {
            // Si le statut est modifié via cette route, mettez à jour date_statut_change
            if ($request->has('statut') && $request->statut !== $candidature->statut) {
                $candidature->date_statut_change = now();
            }

            $candidature->fill($request->only([
                'statut',
                'commentaires_rh',
                'commentaires_encadreur',
                'stage_id'
            ]));
            $candidature->save();

            // Logique pour les documents mis à jour (si vous les autorisez ici)
            // if ($request->hasFile('cv_file')) { ... mettre à jour le document CV ... }

            DB::commit();
            return response()->json([
                'message' => 'Candidature mise à jour avec succès.',
                'candidature' => $candidature->load('stagiaire.user', 'stage')
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la candidature.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified candidature from storage.
     * Supprime une candidature. Typiquement, seul un Admin ou un RH devrait pouvoir faire cela.
     *
     * @param  \App\Models\Candidature  $candidature
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Candidature $candidature)
    {
        // Seuls les RH et Admin peuvent supprimer une candidature
        if (auth()->user()->role !== 'rh' && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès non autorisé pour la suppression de candidature.'], 403);
        }

        DB::beginTransaction();
        try {
            // Optionnel : Supprimer les fichiers physiques associés
            if ($candidature->cvDocument && Storage::disk('public')->exists($candidature->cvDocument->chemin_fichier)) {
                Storage::disk('public')->delete($candidature->cvDocument->chemin_fichier);
                $candidature->cvDocument->delete();
            }
            if ($candidature->certifScolariteDocument && Storage::disk('public')->exists($candidature->certifScolariteDocument->chemin_fichier)) {
                Storage::disk('public')->delete($candidature->certifScolariteDocument->chemin_fichier);
                $candidature->certifScolariteDocument->delete();
            }
            if ($candidature->lettreStageDocument && Storage::disk('public')->exists($candidature->lettreStageDocument->chemin_fichier)) {
                Storage::disk('public')->delete($candidature->lettreStageDocument->chemin_fichier);
                $candidature->lettreStageDocument->delete();
            }

            // Supprimer la candidature
            $candidature->delete();

            DB::commit();
            return response()->json([
                'message' => 'Candidature supprimée avec succès.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la suppression de la candidature.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}