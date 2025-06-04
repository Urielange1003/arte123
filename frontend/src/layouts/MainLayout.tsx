import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout: React.FC = () => {
  const [transparentNav, setTransparentNav] = useState(true);
  const location = useLocation();

  // Check if we're on the homepage to use transparent navbar
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) {
      setTransparentNav(false);
      return;
    }
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setTransparentNav(scrollPosition < 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar transparent={isHomePage && transparentNav} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;