'use client';

import { useTheme } from '@/app/ThemeProvider';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { theme = 'light', toggleTheme = () => {} } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative p-2 rounded-full transition-all duration-500 ease-in-out
        ${theme === 'light' 
          ? 'bg-gradient-to-br from-white to-sei-light-blue shadow-lg text-sei-blue' 
          : 'bg-gradient-to-br from-sei-dark-blue to-sei-dark-purple shadow-inner text-sei-light-blue shadow-[0_0_10px_rgba(129,207,255,0.3)]'}
        ${isAnimating ? 'scale-110' : 'hover:scale-105'}
        mr-4 h-10 w-10 flex items-center justify-center overflow-hidden`}
      aria-label="Toggle theme"
    >
      <div className={`absolute inset-0 ${isAnimating ? 'animate-pulse' : ''} rounded-full opacity-30 
        ${theme === 'light' ? 'bg-sei-light-blue' : 'bg-sei-dark-blue'}`}></div>
      
      <span className={`${isAnimating ? 'animate-spin' : ''} transition-transform duration-500`}>
        {theme === 'light' ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="w-6 h-6"
          >
            <path 
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" 
            />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="w-6 h-6"
          >
            <path 
              d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" 
            />
          </svg>
        )}
      </span>
      
      <span className={`absolute inset-0 rounded-full ${isAnimating ? 'animate-ripple' : ''} 
        ${theme === 'light' ? 'sei-blue-gradient' : 'sei-purple-gradient'} 
        opacity-0`}>
      </span>
    </button>
  );
} 