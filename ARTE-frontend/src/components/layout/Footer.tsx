import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <img className="h-8 w-auto" src="/arte-logo.svg" alt="ARTE Logo" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ARTE</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md">
              Application de Recherche et de Traitement des Étudiants en stage chez Camrail, 
              facilitant tout le processus depuis la candidature jusqu'à l'attestation de fin de stage.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-agl-blue transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-agl-blue transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-agl-blue transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-agl-blue transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-agl-blue dark:hover:text-agl-blue transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/postuler" className="text-gray-600 dark:text-gray-300 hover:text-agl-blue dark:hover:text-agl-blue transition-colors">
                  Postuler
                </Link>
              </li>
              <li>
                <Link to="/auth/login" className="text-gray-600 dark:text-gray-300 hover:text-agl-blue dark:hover:text-agl-blue transition-colors">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600 dark:text-gray-300">
                Douala, Cameroun
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                BP 300 Douala
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                info@camrail.net
              </li>
              <li className="text-gray-600 dark:text-gray-300">
                +237 233 42 51 11
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            &copy; {currentYear} ARTE - Camrail. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;