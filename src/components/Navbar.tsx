'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/ThemeProvider";

export default function Navbar() {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    // Get current path
    setActiveLink(window.location.pathname);
    
    // Add scroll listener
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${scrolled 
      ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg' 
      : 'bg-white dark:bg-gray-800 shadow'} 
      border-b border-sei-light-gray dark:border-gray-700
      transition-all duration-300 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background sparkle effects for dark mode */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-1/4 left-[15%] w-1 h-1 rounded-full bg-sei-light-red/50 animate-pulse-soft"></div>
            <div className="absolute top-2/3 left-[45%] w-1.5 h-1.5 rounded-full bg-sei-light-red/60 animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-[75%] w-1 h-1 rounded-full bg-sei-light-red/40 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/4 left-[35%] w-0.5 h-0.5 rounded-full bg-sei-light-red/30 animate-pulse-soft" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-3/4 left-[85%] w-0.5 h-0.5 rounded-full bg-sei-light-red/30 animate-pulse-soft" style={{ animationDelay: '0.7s' }}></div>
          </>
        )}
        
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group">
                <span className="text-sei-red font-bold text-2xl dark:text-sei-light-red group-hover:scale-110 transition-transform">Sei</span>
                <span className="text-sei-dark-gray font-bold text-2xl dark:text-white relative overflow-hidden group-hover:scale-110 transition-transform">
                  Forge
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sei-red dark:bg-sei-light-red transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/marketplace"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors relative
                  ${activeLink === '/marketplace' 
                    ? 'text-sei-red dark:text-sei-light-red border-b-2 border-sei-red dark:border-sei-light-red' 
                    : 'text-sei-dark-gray hover:text-sei-red dark:text-gray-300 dark:hover:text-sei-light-red border-transparent border-b-2'}`}
              >
                Marketplace
                {activeLink === '/marketplace' && theme === 'dark' && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-sei-light-red glow-effect"></span>
                )}
              </Link>
              <Link
                href="/create"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors relative
                  ${activeLink === '/create' 
                    ? 'text-sei-red dark:text-sei-light-red border-b-2 border-sei-red dark:border-sei-light-red' 
                    : 'text-sei-dark-gray hover:text-sei-red dark:text-gray-300 dark:hover:text-sei-light-red border-transparent border-b-2'}`}
              >
                Create Agent
                {activeLink === '/create' && theme === 'dark' && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-sei-light-red glow-effect"></span>
                )}
              </Link>
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors relative
                  ${activeLink === '/dashboard' 
                    ? 'text-sei-red dark:text-sei-light-red border-b-2 border-sei-red dark:border-sei-light-red' 
                    : 'text-sei-dark-gray hover:text-sei-red dark:text-gray-300 dark:hover:text-sei-light-red border-transparent border-b-2'}`}
              >
                Dashboard
                {activeLink === '/dashboard' && theme === 'dark' && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-sei-light-red glow-effect"></span>
                )}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
            <div className={`${theme === 'dark' ? 'glow-effect' : ''} rounded-lg`}>
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 