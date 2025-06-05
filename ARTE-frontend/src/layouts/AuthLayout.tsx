import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img className="h-8 w-auto" src="/arte-logo.svg" alt="ARTE Logo" />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ARTE</span>
        </Link>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agl-blue"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="flex flex-col flex-grow items-center justify-center px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
      
      <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} ARTE - Camrail. Tous droits réservés.
      </div>
    </div>
  );
};

export default AuthLayout;