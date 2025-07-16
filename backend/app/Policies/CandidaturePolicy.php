<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Candidature;

class CandidaturePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'rh', 'stagiaire', 'encadreur']);
    }

    public function view(User $user, Candidature $candidature): bool
    {
        if (in_array($user->role, ['admin', 'rh'])) {
            return true;
        }
        if ($user->role === 'stagiaire') {
            return $user->id === $candidature->stagiaire_id;
        }
        if ($user->role === 'encadreur' && $candidature->stage) {
            return $user->id === $candidature->stage->encadreur_id;
        }
        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'stagiaire';
    }

    public function update(User $user, Candidature $candidature): bool
    {
        return $user->role === 'admin'
            || ($user->role === 'stagiaire' && $user->id === $candidature->stagiaire_id);
    }

    public function delete(User $user, Candidature $candidature): bool
    {
        return $user->role === 'admin'
            || ($user->role === 'stagiaire' && $user->id === $candidature->stagiaire_id);
    }
}