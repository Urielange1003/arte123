<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Candidature;
use App\Models\Stage;
use App\Models\Document;
use App\Models\Presence;
use App\Models\Evaluation;

use App\Policies\UserPolicy;
use App\Policies\CandidaturePolicy;
use App\Policies\StagePolicy;
use App\Policies\DocumentPolicy;
use App\Policies\PresencePolicy;
use App\Policies\EvaluationPolicy;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate; 

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Mappage des modèles aux politiques correspondantes
        User::class => UserPolicy::class,
        Candidature::class => CandidaturePolicy::class,
        Stage::class => StagePolicy::class,
        Document::class => DocumentPolicy::class,
        Presence::class => PresencePolicy::class,
        Evaluation::class => EvaluationPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Enregistrez vos politiques (Laravel le fait automatiquement via la propriété $policies)
        // Vous n'avez pas besoin de le faire explicitement ici à moins d'une configuration avancée.

        // Votre Gate::before existant
        Gate::before(function ($user, $ability) {
            // Assurez-vous que votre modèle User a bien une méthode `hasRole`.
            // Si votre rôle 'super-admin' est stocké dans la colonne 'role',
            // vous pourriez simplement faire :
            // return $user->role === 'admin' ? true : null;
            // Si vous utilisez un package comme Spatie/Laravel-Permission, `hasRole` est correct.
            if ($user->role === 'admin') { 
                return true; // L'administrateur a toutes les permissions
            }
            // Si l'utilisateur n'est pas 'admin', la vérification passe aux policies.
            return null;
        });
    }
}