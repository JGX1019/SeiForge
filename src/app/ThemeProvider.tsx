'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  theme: 'dark';
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Apply dark theme immediately before React hydration
  useEffect(() => {
    // Apply dark theme to document
    document.documentElement.classList.add('dark');
    
    setMounted(true);
  }, []);
  
  // Fixed theme value for context
  const contextValue = {
    theme: 'dark' as const
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}