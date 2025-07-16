<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Stage;

class StagePolicy
{
    public function viewAny(User $user): bool
    {
        return true; // Tous peuvent voir la liste des stages
    }

    public function view(User $user, Stage $stage): bool
    {
        return true; // Tous peuvent voir les détails d'un stage
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'rh', 'encadreur']);
    }

    public function update(User $user, Stage $stage): bool
    {
        if (in_array($user->role, ['admin', 'rh'])) {
            return true;
        }
        if ($user->role === 'encadreur') {
            return $user->id === $stage->encadreur_id;
        }
        return false;
    }

    public function delete(User $user, Stage $stage): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }
}