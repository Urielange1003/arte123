<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RHMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
     public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'rh') {
            return $next($request);
        }

        return response()->json(['message' => 'Accès non autorisé. Vous devez être administrateur.'], 403);
    }
}
