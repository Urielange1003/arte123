<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Departement;

class DepartementPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }

    public function view(User $user, Departement $departement): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }

    public function update(User $user, Departement $departement): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }

    public function delete(User $user, Departement $departement): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }

    public function restore(User $user, Departement $departement): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }

    public function forceDelete(User $user, Departement $departement): bool
    {
        return in_array($user->role, ['admin', 'rh']);
    }
}