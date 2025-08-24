import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './home/Navbar';
import Footer from './home/Footer';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Component to handle scroll restoration
const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when path changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

const Layout = ({ children }) => {
  const isMobile = useMediaQuery('md');
  const location = useLocation();
  
  // Add viewport meta tag for mobile devices
  useEffect(() => {
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover';
    document.head.appendChild(viewportMeta);
    
    // Smooth scroll to top on route change for mobile
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
    
    return () => {
      document.head.removeChild(viewportMeta);
    };
  }, [location.pathname, isMobile]);

  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Skip to main content link for better accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        {t('a11y.skipToContent')}
      </a>
      
      {/* Header with Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar />
      </header>
      
      <ScrollToTop>
        <main 
          id="main-content"
          className={`flex-grow w-full mx-auto pt-20 pb-8 px-3 sm:px-4 md:px-6 lg:px-8 ${
            isMobile ? 'max-w-full' : 'max-w-7xl'
          }`}
        >
          <div className="w-full mx-auto">
            {children}
          </div>
        </main>
      </ScrollToTop>
      
      <Footer />
      
      {/* Mobile navigation spacer to prevent content from being hidden behind fixed elements */}
      {isMobile && <div className="h-16"></div>}
      
      {/* Add mobile-specific styles */}
      <style jsx="true" global="true">{`
        /* Improve tap targets for mobile */
        @media (max-width: 768px) {
          button, 
          a[role="button"], 
          .btn {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Prevent zoom on input focus */
          input[type="text"],
          input[type="email"],
          input[type="tel"],
          input[type="number"],
          textarea {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
