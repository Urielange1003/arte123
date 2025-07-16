import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Importez Outlet ici
import { useAuth } from '../contexts/AuthContext'; // Ajustez le chemin si nécessaire

interface PrivateRouteProps {
  roles?: string[]; // Rôles autorisés pour cette route (ex: ['admin', 'hr'])
  // La prop 'element' n'est plus nécessaire car PrivateRoute rendra <Outlet />
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { isAuthenticated, user, isLoadingAuth } = useAuth();

  // 1. Gérer l'état de chargement de l'authentification
  if (isLoadingAuth) {
    // Affichez un indicateur de chargement pendant que l'authentification est vérifiée
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-300 rounded-full animate-spin mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold">Vérification de la session...</h2>
      </div>
    );
  }

  // 2. Gérer l'authentification
  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    // Utilisez le chemin complet pour le login sous /auth
    return <Navigate to="/auth/login" replace />;
  }

  // 3. Gérer les rôles si spécifiés
  // L'utilisateur est authentifié ici. Vérifions son rôle si 'roles' est fourni.
  if (roles && user && !roles.includes(user.role)) {
    // Authentifié, mais le rôle de l'utilisateur n'est pas parmi les rôles autorisés.
    console.warn(`Accès refusé. Le rôle ${user.role} n'est pas autorisé pour cette page.`);
    // Redirigez vers une page d'accès refusé spécifique (vous devrez la créer)
    return <Navigate to="/unauthorized" replace />;
  }

  // Si tout est bon (authentifié et rôle autorisé ou pas de rôle spécifié),
  // rendre les routes enfants via <Outlet />.
  return <Outlet />;
};

export default PrivateRoute;