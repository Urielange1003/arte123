<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration CORS pour permettre les requêtes du frontend
    |
    /*
     * Les chemins pour lesquels CORS doit être activé.
     * 'api/*' couvre toutes les routes API.
     * 'sanctum/csrf-cookie' est essentiel pour l'authentification Laravel Sanctum.
     * J'ai ajouté 'login', 'register', 'apply' ici car ce sont des routes publiques importantes
     * qui nécessitent CORS.
     */
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'apply'],

    /*
     * Un tableau d'origines (domaines) à partir desquelles les requêtes sont autorisées.
     *
     * Pour le DÉVELOPPEMENT :
     * - 'http://localhost:5173' est l'origine par défaut pour les projets Vite/React en local.
     * - 'http://127.0.0.1:5173' est aussi une possibilité si votre frontend se résout en 127.0.0.1.
     *
     * Pour la PRODUCTION :
     * - NE JAMAIS utiliser ['*'] en production. Spécifiez toujours vos domaines frontend exacts.
     * - Exemple en production : ['https://votre-domaine-frontend.com']
     */
    'allowed_origins' => [
        'http://localhost:5173', // Adresse par défaut de Vite/React pour le développement
        'http://127.0.0.1:5173', // Autre adresse locale possible pour le développement
        'http://arte:5173', // Si 'arte' est un hôte défini dans votre fichier hosts ou un réseau spécifique
    ],
    // IMPORTANT : Ne décommentez PAS la ligne ci-dessous en même temps que allowed_origins ci-dessus,
    // cela causerait une erreur de syntaxe PHP. Utilisez l'une OU l'autre.
    // 'allowed_origins' => ['*'], // Décommentez ceci UNIQUEMENT pour un développement très rapide et temporaire.

    /*
     * Les méthodes HTTP autorisées (GET, POST, PUT, DELETE, etc.).
     * '*' autorise toutes les méthodes (recommandé pour le développement).
     */
    'allowed_methods' => ['*'], // Laissez '*' pour le développement

    /*
     * Les en-têtes HTTP autorisés.
     * '*' autorise tous les en-têtes (recommandé pour le développement).
     * Si vous aviez des problèmes d'en-têtes spécifiques, vous pourriez les lister ici.
     */
    'allowed_headers' => ['*'],

    /*
     * Les en-têtes que le navigateur est autorisé à exposer au frontend.
     * Généralement laissé vide ou contient des en-têtes personnalisés spécifiques.
     */
    'exposed_headers' => [],

    /*
     * La durée maximale en secondes pendant laquelle les résultats des requêtes preflight
     * (requêtes OPTIONS automatiques du navigateur) peuvent être mis en cache.
     * 0 signifie pas de cache. 3600 (1 heure) est une valeur courante en production.
     */
    'max_age' => 3600, // Recommandé de mettre une valeur plus élevée en développement pour moins de preflight

    /*
     * Indique si la requête réelle peut être faite en utilisant des identifiants (cookies, en-têtes d'autorisation HTTP, certificats TLS client).
     * Ceci est CRUCIAL pour que Laravel Sanctum puisse envoyer et recevoir les cookies CSRF et d'authentification.
     */
    'supports_credentials' => true, // DOIT ÊTRE true pour Sanctum
];