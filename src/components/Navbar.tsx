'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/ThemeProvider";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { theme = 'light' } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? theme === 'light'
            ? 'bg-white/95 shadow-md backdrop-blur-sm'
            : 'bg-gray-900/95 shadow-lg backdrop-blur-sm border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className={`text-xl font-bold ${
                theme === 'light' 
                  ? 'text-sei-blue' 
                  : 'text-sei-light-blue'
              }`}>
                SeiForge
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${
                  isLinkActive('/')
                    ? theme === 'light'
                      ? 'bg-sei-light-blue/20 text-sei-blue'
                      : 'bg-sei-light-blue/10 text-sei-light-blue'
                    : theme === 'light'
                    ? 'text-gray-700 hover:text-sei-blue hover:bg-sei-light-blue/10'
                    : 'text-gray-300 hover:text-sei-light-blue hover:bg-sei-light-blue/5'
                }`}
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${
                  isLinkActive('/marketplace')
                    ? theme === 'light'
                      ? 'bg-sei-light-blue/20 text-sei-blue'
                      : 'bg-sei-light-blue/10 text-sei-light-blue'
                    : theme === 'light'
                    ? 'text-gray-700 hover:text-sei-blue hover:bg-sei-light-blue/10'
                    : 'text-gray-300 hover:text-sei-light-blue hover:bg-sei-light-blue/5'
                }`}
              >
                Marketplace
              </Link>
              <Link
                href="/create"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${
                  isLinkActive('/create')
                    ? theme === 'light'
                      ? 'bg-sei-light-blue/20 text-sei-blue'
                      : 'bg-sei-light-blue/10 text-sei-light-blue'
                    : theme === 'light'
                    ? 'text-gray-700 hover:text-sei-blue hover:bg-sei-light-blue/10'
                    : 'text-gray-300 hover:text-sei-light-blue hover:bg-sei-light-blue/5'
                }`}
              >
                Create Agent
              </Link>
              <Link
                href="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${
                  isLinkActive('/profile')
                    ? theme === 'light'
                      ? 'bg-sei-light-blue/20 text-sei-blue'
                      : 'bg-sei-light-blue/10 text-sei-light-blue'
                    : theme === 'light'
                    ? 'text-gray-700 hover:text-sei-blue hover:bg-sei-light-blue/10'
                    : 'text-gray-300 hover:text-sei-light-blue hover:bg-sei-light-blue/5'
                }`}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <ConnectButton />
          </div>
          <div className="md:hidden flex items-center">
            {/* Add a mobile menu button here if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
} 