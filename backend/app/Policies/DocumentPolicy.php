<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Document;

class DocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'rh', 'stagiaire', 'encadreur']);
    }

    public function view(User $user, Document $document): bool
    {
        if (in_array($user->role, ['admin', 'rh'])) {
            return true;
        }
        if ($user->id === $document->utilisateur_id) {
            return true;
        }
        if (
            $user->role === 'encadreur' &&
            $document->candidature &&
            $document->candidature->stage &&
            $document->candidature->stage->encadreur_id === $user->id
        ) {
            return true;
        }
        return false;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['stagiaire', 'rh']);
    }

    public function update(User $user, Document $document): bool
    {
        return $user->role === 'admin' || $user->role === 'rh' || $user->id === $document->utilisateur_id;
    }

    public function delete(User $user, Document $document): bool
    {
        return $user->role === 'admin' || $user->role === 'rh' || $user->id === $document->utilisateur_id;
    }
}