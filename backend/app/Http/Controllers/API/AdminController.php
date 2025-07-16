<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    // Récupérer tous les utilisateurs
    public function index()
    {
        $users = User::all(['id', 'name', 'email', 'role', 'created_at']); // Sélectionnez les colonnes nécessaires
        return response()->json([
            'success' => true,
            'data' => $users,
            'message' => 'Utilisateurs récupérés avec succès.'
        ]);
    }

    // Créer un nouvel utilisateur par l'administrateur
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8', // Pas besoin de 'confirmed' si l'admin le crée
            'role' => 'required|string|in:student,supervisor,hr,admin',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Utilisateur créé avec succès par l\'administrateur.'
        ], 201);
    }

    // Mettre à jour un utilisateur (y compris le rôle ou le statut)
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8', // Mot de passe optionnel pour la mise à jour
            'role' => 'sometimes|required|string|in:stagiaire,encadreur,rh,admin',
        ]);

        $user->name = $request->input('name', $user->name);
        $user->email = $request->input('email', $user->email);
        $user->role = $request->input('role', $user->role);

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Utilisateur mis à jour avec succès.'
        ]);
    }

    // Supprimer un utilisateur
    public function destroy(User $user)
    {
        // Empêcher un admin de supprimer le dernier admin ou lui-même (logique à renforcer)
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json(['message' => 'Impossible de supprimer le dernier compte administrateur.'], 403);
        }

        // Empêcher un admin de se supprimer lui-même (plus complexe avec Sanctum, car le token serait invalidé)
        // if (auth()->id() === $user->id) {
        //     return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 403);
        // }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès.'
        ]);
    }
}