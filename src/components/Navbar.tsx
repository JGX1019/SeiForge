'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/ThemeProvider";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { theme } = useTheme();
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
          ? 'backdrop-blur-sm bg-transparent border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-sei-light-blue">
                SeiForge
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              <Link
                href="/marketplace"
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 group
                ${
                  isLinkActive('/marketplace')
                    ? 'text-sei-light-blue'
                    : 'text-gray-200 hover:text-sei-light-blue'
                }`}
              >
                Marketplace
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r transition-transform duration-300 ease-out transform 
                  ${isLinkActive('/marketplace') 
                    ? 'from-sei-light-blue via-sei-blue to-sei-purple scale-x-100' 
                    : 'from-sei-light-blue via-sei-blue to-sei-purple scale-x-0'} 
                  group-hover:scale-x-100 origin-left`}>
                </span>
              </Link>
              <Link
                href="/create"
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 group
                ${
                  isLinkActive('/create')
                    ? 'text-sei-light-blue'
                    : 'text-gray-200 hover:text-sei-light-blue'
                }`}
              >
                Create Agent
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r transition-transform duration-300 ease-out transform 
                  ${isLinkActive('/create') 
                    ? 'from-sei-light-blue via-sei-blue to-sei-purple scale-x-100' 
                    : 'from-sei-light-blue via-sei-blue to-sei-purple scale-x-0'} 
                  group-hover:scale-x-100 origin-left`}>
                </span>
              </Link>
              <Link
                href="/profile"
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 group
                ${
                  isLinkActive('/profile')
                    ? 'text-sei-light-blue'
                    : 'text-gray-200 hover:text-sei-light-blue'
                }`}
              >
                Profile
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r transition-transform duration-300 ease-out transform 
                  ${isLinkActive('/profile') 
                    ? 'from-sei-light-blue via-sei-blue to-sei-purple scale-x-100' 
                    : 'from-sei-light-blue via-sei-blue to-sei-purple scale-x-0'} 
                  group-hover:scale-x-100 origin-left`}>
                </span>
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