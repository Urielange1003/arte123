import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h2 className="text-3xl font-bold">404 - Page non trouvée</h2>
      <p className="mt-2 text-lg">Oops! La page que vous recherchez n'existe pas.</p>
      <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;
