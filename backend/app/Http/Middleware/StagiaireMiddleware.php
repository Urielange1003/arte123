<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StagiaireMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
     public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'stagiaire') {
            return $next($request);
        }

        return response()->json(['message' => 'Accès non autorisé. Vous devez avoir un accord de administrateur.'], 403);
    }
}
