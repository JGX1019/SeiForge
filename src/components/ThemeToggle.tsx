'use client';

import { useTheme } from '@/app/ThemeProvider';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { theme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation periodically for visual interest
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 700);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative p-2 rounded-full transition-all duration-500 ease-in-out
        bg-gradient-to-br from-sei-dark-blue to-sei-dark-purple shadow-inner text-sei-light-blue shadow-[0_0_10px_rgba(129,207,255,0.3)]
        ${isAnimating ? 'scale-110' : 'hover:scale-105'}
        mr-4 h-10 w-10 flex items-center justify-center overflow-hidden`}
      aria-label="Dark mode"
    >
      <div className={`absolute inset-0 ${isAnimating ? 'animate-pulse' : ''} rounded-full opacity-30 
        bg-sei-dark-blue`}></div>
      
      <span className={`${isAnimating ? 'animate-spin' : ''} transition-transform duration-500`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="w-6 h-6"
        >
          <path 
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" 
          />
        </svg>
      </span>
      
      <span className={`absolute inset-0 rounded-full ${isAnimating ? 'animate-ripple' : ''} 
        sei-purple-gradient 
        opacity-0`}>
      </span>
    </div>
  );
}