<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Presence;

class PresencePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'rh', 'encadreur', 'stagiaire']);
    }

    public function view(User $user, Presence $presence): bool
    {
        if (in_array($user->role, ['admin', 'rh'])) {
            return true;
        }
        if ($user->role === 'stagiaire') {
            return $user->id === $presence->stagiaire_id;
        }
        if (
            $user->role === 'encadreur' &&
            $presence->stagiaire &&
            $presence->stagiaire->candidatures()->whereHas('stage', function ($query) use ($user) {
                $query->where('encadreur_id', $user->id);
            })->exists()
        ) {
            return true;
        }
        return false;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['stagiaire', 'encadreur', 'rh']);
    }

    public function update(User $user, Presence $presence): bool
    {
        return in_array($user->role, ['admin', 'rh', 'encadreur']) || $user->id === $presence->stagiaire_id;
    }

    public function delete(User $user, Presence $presence): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }
}