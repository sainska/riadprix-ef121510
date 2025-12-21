import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('riadprix-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    // Add new theme class
    root.classList.add(theme);
    // Persist to localStorage
    localStorage.setItem('riadprix-theme', theme);
    
    // Also update data-theme attribute for better compatibility
    root.setAttribute('data-theme', theme);
    
    // Update favicon based on theme
    const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
    }
    
    // Update apple-touch-icon
    const appleIcon = document.querySelector("link[rel~='apple-touch-icon']") as HTMLLinkElement;
    if (appleIcon) {
      appleIcon.href = theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
    }
  }, [theme]);
  
  // Initialize theme on mount to prevent flash
  useEffect(() => {
    const saved = localStorage.getItem('riadprix-theme');
    const initialTheme = (saved === 'dark' || saved === 'light') 
      ? saved 
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    const root = document.documentElement;
    root.classList.add(initialTheme);
    root.setAttribute('data-theme', initialTheme);
    
    // Set initial favicon
    const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = initialTheme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
    }
    
    const appleIcon = document.querySelector("link[rel~='apple-touch-icon']") as HTMLLinkElement;
    if (appleIcon) {
      appleIcon.href = initialTheme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
