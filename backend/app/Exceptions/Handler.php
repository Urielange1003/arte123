<?php
use Illuminate\Validation\ValidationException;
use Throwable;

public function render($request, Throwable $exception)
{
    if ($request->expectsJson()) {
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $exception->errors(),
            ], 422);
        }
        // Gérer d'autres exceptions si nécessaire, par exemple:
        // if ($exception instanceof \Illuminate\Auth\AuthenticationException) {
        //     return response()->json(['message' => 'Unauthenticated.'], 401);
        // }
        // Pour les autres exceptions non gérées spécifiquement, renvoyer une erreur générique JSON
        return response()->json([
            'message' => $exception->getMessage() ?: 'An unexpected error occurred.',
            'success' => false,
            // 'trace' => env('APP_DEBUG') ? $exception->getTrace() : null, // Pour le debug
        ], method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : 500);
    }

    return parent::render($request, $exception);
}