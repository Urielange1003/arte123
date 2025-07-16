<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Vérifie si l'utilisateur est authentifié
        if (! $request->user()) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        // Vérifie si l'utilisateur a l'un des rôles autorisés
        if (! in_array($request->user()->role, $roles)) {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle.'], 403);
        }

        return $next($request);
    }
}