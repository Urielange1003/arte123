<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Evaluation;

class EvaluationPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'rh', 'encadreur', 'stagiaire']);
    }

    public function view(User $user, Evaluation $evaluation): bool
    {
        if (in_array($user->role, ['admin', 'rh'])) {
            return true;
        }
        if ($user->id === $evaluation->encadreur_id) {
            return true;
        }
        if ($user->id === $evaluation->stagiaire_id) {
            return true;
        }
        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'encadreur';
    }

    public function update(User $user, Evaluation $evaluation): bool
    {
        return $user->role === 'admin' || $user->id === $evaluation->encadreur_id;
    }

    public function delete(User $user, Evaluation $evaluation): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }
}