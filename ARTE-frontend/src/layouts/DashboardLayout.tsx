import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LogOut, Moon, Sun, User, FileText, MessageSquare, 
  Clock, Users, BarChart2, LayoutDashboard, Briefcase
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardLayoutProps {
  role: 'student' | 'admin' | 'hr' | 'supervisor';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const closeSidebar = () => setSidebarOpen(false);
  
  // Define navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/etudiant' },
          { name: 'Profil', icon: <User size={20} />, path: '/etudiant/profil' },
          { name: 'Documents', icon: <FileText size={20} />, path: '/etudiant/documents' },
          { name: 'Présence', icon: <Clock size={20} />, path: '/etudiant/presence' },
          { name: 'Messages', icon: <MessageSquare size={20} />, path: '/etudiant/messages' },
        ];
      case 'admin':
        return [
          { name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/admin' },
          { name: 'Candidatures', icon: <Briefcase size={20} />, path: '/admin/candidatures' },
          { name: 'Stagiaires', icon: <Users size={20} />, path: '/admin/stagiaires' },
          { name: 'Encadreurs', icon: <User size={20} />, path: '/admin/encadreurs' },
          { name: 'Statistiques', icon: <BarChart2 size={20} />, path: '/admin/statistiques' },
        ];
      case 'hr':
        return [
          { name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/rh' },
          { name: 'Documents', icon: <FileText size={20} />, path: '/rh/documents' },
          { name: 'Candidatures', icon: <Briefcase size={20} />, path: '/rh/candidatures' },
        ];
      case 'supervisor':
        return [
          { name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/encadreur' },
          { name: 'Stagiaires', icon: <Users size={20} />, path: '/encadreur/stagiaires' },
          { name: 'Présence', icon: <Clock size={20} />, path: '/encadreur/presence' },
          { name: 'Messages', icon: <MessageSquare size={20} />, path: '/encadreur/messages' },
        ];
      default:
        return [];
    }
  };
  
  const navItems = getNavItems();
  
  // Get role display name
  const getRoleDisplayName = () => {
    switch (role) {
      case 'student': return 'Stagiaire';
      case 'admin': return 'Administrateur';
      case 'hr': return 'Ressources Humaines';
      case 'supervisor': return 'Encadreur';
      default: return '';
    }
  };
  
  const handleLogout = () => {
    // For demo purposes, just redirect to home
    navigate('/');
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} 
        onClick={closeSidebar}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        
        <div className="fixed inset-y-0 left-0 flex max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={closeSidebar}
            >
              <span className="sr-only">Fermer la navigation</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img className="h-8 w-auto" src="/arte-logo.svg" alt="ARTE Logo" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ARTE</span>
            </div>
            
            <div className="mt-5 flex-1 flex flex-col">
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {getRoleDisplayName()}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Jean Dupont
                </div>
              </div>
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-agl-blue text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={closeSidebar}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <LogOut size={20} />
                <span className="ml-3">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
              <img className="h-8 w-auto" src="/arte-logo.svg" alt="ARTE Logo" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ARTE</span>
            </div>
            
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {getRoleDisplayName()}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Jean Dupont
                </div>
              </div>
              
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-agl-blue text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <LogOut size={20} />
                <span className="ml-3">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-agl-blue"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Ouvrir la navigation</span>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
              {navItems.find(item => item.path === location.pathname)?.name || 'Tableau de bord'}
            </h1>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agl-blue"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="hidden md:flex md:items-center md:justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6 md:px-8">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {navItems.find(item => item.path === location.pathname)?.name || 'Tableau de bord'}
            </h1>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agl-blue"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          <div className="py-6 px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;