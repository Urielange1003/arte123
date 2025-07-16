<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RH; // Assurez-vous que votre modèle RH existe et est correctement nommé
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RHController extends Controller
{
    /**
     * Display a listing of the resource.
     * GET /api/rh
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $rhs = RH::all(); // Récupère toutes les ressources RH
        return response()->json($rhs);
    }

    /**
     * Store a newly created resource in storage.
     * POST /api/rh
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Exemple de validation, adaptez les règles à vos besoins
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:r_h_s,email', // Adaptez le nom de la table
            // Ajoutez d'autres champs RH ici
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rh = RH::create($request->all()); // Crée une nouvelle ressource RH

        return response()->json($rh, 201); // 201 Created
    }

    /**
     * Display the specified resource.
     * GET /api/rh/{id}
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        $rh = RH::find($id); // Trouve la ressource RH par ID

        if (!$rh) {
            return response()->json(['message' => 'Ressource RH non trouvée'], 404);
        }

        return response()->json($rh);
    }

    /**
     * Update the specified resource in storage.
     * PUT/PATCH /api/rh/{id}
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        $rh = RH::find($id);

        if (!$rh) {
            return response()->json(['message' => 'Ressource RH non trouvée'], 404);
        }

        // Exemple de validation pour la mise à jour
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:r_h_s,email,' . $id,
            // Ajoutez d'autres champs RH ici
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rh->update($request->all()); // Met à jour la ressource RH

        return response()->json($rh);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /api/rh/{id}
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        $rh = RH::find($id);

        if (!$rh) {
            return response()->json(['message' => 'Ressource RH non trouvée'], 404);
        }

        $rh->delete(); // Supprime la ressource RH

        return response()->json(['message' => 'Ressource RH supprimée avec succès'], 204); // 204 No Content
    }
}