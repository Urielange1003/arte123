<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     * Admin et RH peuvent voir la liste de tous les utilisateurs.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }

    /**
     * Determine whether the user can view the model.
     * Un utilisateur peut voir son propre profil.
     * Admin et RH peuvent voir tous les profils.
     */
    public function view(User $user, User $model): bool
    {
        return $user->role === 'admin' || $user->role === 'rh' || $user->id === $model->id;
    }

    /**
     * Determine whether the user can create models.
     * Admin et RH peuvent créer des utilisateurs (autres que des stagiaires via l'inscription).
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }

    /**
     * Determine whether the user can update the model.
     * Un utilisateur peut modifier son propre profil.
     * Admin et RH peuvent modifier les profils.
     */
    public function update(User $user, User $model): bool
    {
        return $user->role === 'admin' || $user->role === 'rh' || $user->id === $model->id;
    }

    /**
     * Determine whether the user can delete the model.
     * Seul l'Admin peut supprimer des utilisateurs.
     */
    public function delete(User $user, User $model): bool
    {
        // Empêcher un utilisateur de se supprimer lui-même (sauf si c'est un admin qui supprime un autre admin)
        return $user->role === 'admin' && $user->id !== $model->id;
    }

    /**
     * Determine whether the user can restore the model.
     * (Typiquement pour la suppression logique)
     */
    public function restore(User $user, User $model): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the model.
     * (Typiquement pour la suppression logique)
     */
    public function forceDelete(User $user, User $model): bool
    {
        return $user->role === 'admin';
    }
}