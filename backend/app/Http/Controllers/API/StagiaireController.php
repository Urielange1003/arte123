<?php

namespace App\Http\Controllers\API; 

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\User;
use App\Models\Stagiaire; // Assurez-vous que ce modèle existe bien
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Mail\AcceptanceMail; // Assurez-vous que ce Mailable existe
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log; // Optionnel: Pour la journalisation

class StagiaireController extends Controller
{
    /**
     * Accepte un dossier, crée un compte stagiaire et génère une lettre.
     * Cette méthode est probablement appelée par une route comme POST /api/dossiers/{id}/accepter
     *
     * @param string $id L'ID du dossier à accepter.
     * @return JsonResponse
     */
    public function accepter(string $id): JsonResponse // Ajout du type de retour JsonResponse
    {
        try {
            $dossier = Dossier::findOrFail($id);

            // Vérifier le statut du dossier
            if ($dossier->status !== 'accepte_apres_entretien') {
                return response()->json(['message' => 'Ce dossier n’est pas encore éligible pour l\'acceptation finale.'], 400);
            }

            // Générer un mot de passe aléatoire et créer le compte utilisateur
            $password = Str::random(10); // Augmenté à 10 caractères pour une meilleure sécurité initiale
            $user = User::create([
                'name' => $dossier->nom . ' ' . $dossier->prenom,
                'email' => $dossier->email,
                'password' => Hash::make($password),
                'role' => 'student', // Correction: Utilisation du rôle 'student' pour la cohérence avec le frontend
            ]);

            // Créer un enregistrement stagiaire lié à l'utilisateur et au dossier
            $stagiaire = Stagiaire::create([
                'user_id' => $user->id,
                'dossier_id' => $dossier->id,
                'date_debut' => now(), // Défini la date de début au moment actuel
                'encadreur' => 'À définir', // Ce champ devrait idéalement être un ID d'encadreur lié
                // Ajoutez d'autres champs nécessaires pour Stagiaire ici
            ]);

            // Marquer le dossier comme validé
            $dossier->status = 'stagiaire_valide';
            $dossier->save();

            // Envoyer le mail avec les informations de connexion
            Mail::to($user->email)->send(new AcceptanceMail($user, $password));

            Log::info("Stagiaire accepté et compte créé: User ID {$user->id}, Dossier ID {$dossier->id}");

            return response()->json([
                'message' => 'Stagiaire accepté, compte utilisateur créé et mail envoyé.',
                'user' => [ // Retourne des informations utilisateur minimales pour la sécurité
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'stagiaire' => $stagiaire->only(['id', 'user_id', 'dossier_id']), // Retourne des infos stagiaire minimales
            ], 200); // 200 OK pour une opération réussie de création/mise à jour

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error("Dossier non trouvé lors de l'acceptation: ID {$id}. Erreur: {$e->getMessage()}");
            return response()->json(['message' => 'Dossier non trouvé.'], 404);
        } catch (\Throwable $e) {
            Log::error("Erreur lors de l'acceptation du stagiaire pour le dossier ID {$id}. Erreur: {$e->getMessage()}");
            return response()->json(['message' => 'Une erreur est survenue lors de l\'acceptation du stagiaire.'], 500);
        }
    }

    /**
     * Exemple de méthode pour récupérer le profil d'un stagiaire authentifié.
     * GET /api/stagiaire/my-profile
     * Assurez-vous que l'utilisateur est authentifié et que son rôle est 'student'.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function myProfile(Request $request): JsonResponse
    {
        // Récupérer l'utilisateur authentifié
        $user = $request->user();

        // Vérifier que l'utilisateur est bien un stagiaire (bien que le middleware 'role' devrait déjà le faire)
        if (!$user || $user->role !== 'student') {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        // Récupérer les informations du stagiaire lié à cet utilisateur
        $stagiaire = Stagiaire::where('user_id', $user->id)->first();

        if (!$stagiaire) {
            return response()->json(['message' => 'Profil stagiaire non trouvé pour cet utilisateur.'], 404);
        }

        // Retourner le profil du stagiaire, incluant éventuellement les infos utilisateur
        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'stagiaire' => $stagiaire->toArray(), // Adaptez ce que vous voulez retourner
        ]);
    }

    // Si vous avez d'autres méthodes pour les stagiaires (index, show, store, update, destroy),
    // ajoutez-les ici avec leurs logiques spécifiques. Par exemple:

    /**
     * Affiche la liste de tous les stagiaires (typiquement pour Admin/Encadreur).
     * GET /api/stagiaires (si la route apiResource est utilisée)
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $stagiaires = Stagiaire::with('user')->get(); // Charge les utilisateurs liés si nécessaire
        return response()->json($stagiaires);
    }

    /**
     * Affiche un stagiaire spécifique.
     * GET /api/stagiaires/{id}
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $stagiaire = Stagiaire::with('user')->find($id);

        if (!$stagiaire) {
            return response()->json(['message' => 'Stagiaire non trouvé.'], 404);
        }
        return response()->json($stagiaire);
    }

    /**
     * Met à jour un stagiaire.
     * PUT/PATCH /api/stagiaires/{id}
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $stagiaire = Stagiaire::find($id);
        if (!$stagiaire) {
            return response()->json(['message' => 'Stagiaire non trouvé.'], 404);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $stagiaire->user_id, // Valide l'email de l'utilisateur lié
            'date_debut' => 'sometimes|date',
            // ... autres champs
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Mise à jour du stagiaire
        $stagiaire->update($request->except(['email'])); // Exclure l'email car il est mis à jour via l'utilisateur

        // Mise à jour de l'email de l'utilisateur lié si fourni
        if ($request->has('email') && $stagiaire->user) {
            $stagiaire->user->email = $request->email;
            $stagiaire->user->save();
        }

        return response()->json($stagiaire->load('user')); // Recharger l'utilisateur pour la réponse
    }

    /**
     * Supprime un stagiaire.
     * DELETE /api/stagiaires/{id}
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $stagiaire = Stagiaire::find($id);
        if (!$stagiaire) {
            return response()->json(['message' => 'Stagiaire non trouvé.'], 404);
        }

        // Supprimer l'utilisateur et le stagiaire associé
        if ($stagiaire->user) {
            $stagiaire->user->delete();
        }
        $stagiaire->delete();

        return response()->json(['message' => 'Stagiaire et utilisateur associé supprimés avec succès.'], 204);
    }
}