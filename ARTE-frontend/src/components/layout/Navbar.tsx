import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Determine if we're on a public page
  const isPublic = !location.pathname.includes('/admin') && 
                  !location.pathname.includes('/etudiant') && 
                  !location.pathname.includes('/rh') && 
                  !location.pathname.includes('/encadreur');

  const toggleMenu = () => setIsOpen(!isOpen);

  const baseClasses = "fixed top-0 w-full z-50 transition-all duration-300";
  const bgClasses = transparent 
    ? "bg-transparent" 
    : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800";

  return (
    <nav className={`${baseClasses} ${bgClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/arte-logo.svg" alt="ARTE Logo" />
              <span className={`ml-2 text-xl font-bold ${transparent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                ARTE
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            {isPublic && (
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/" className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  location.pathname === '/' 
                    ? 'border-camrail-red text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}>
                  Accueil
                </Link>
                <Link to="/postuler" className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  location.pathname === '/postuler' 
                    ? 'border-camrail-red text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                }`}>
                  Postuler
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agl-blue"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isPublic && (
              <Link to="/auth/login" className="ml-4">
                <Button variant="primary" size="sm">
                  Connexion
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agl-blue"
                aria-expanded={isOpen}
              >
                <span className="sr-only">{isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900 shadow-lg">
          {isPublic ? (
            <>
              <Link to="/\" className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/' 
                  ? 'border-camrail-red text-camrail-red bg-red-50 dark:bg-red-900/10' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}>
                Accueil
              </Link>
              <Link to="/postuler" className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/postuler' 
                  ? 'border-camrail-red text-camrail-red bg-red-50 dark:bg-red-900/10' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}>
                Postuler
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;