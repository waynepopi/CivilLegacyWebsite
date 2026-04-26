import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/** Returns the theme to use on first load (localStorage → system → light). */
function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme') as Theme | null;
  if (saved === 'dark' || saved === 'light') return saved;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  /**
   * Tracks whether the user has manually clicked the toggle.
   * When true, system-preference changes are ignored.
   * Using a ref so changes don't trigger re-renders.
   */
  const isManualOverride = useRef<boolean>(
    // If a value was already saved, we treat it as a prior manual override.
    localStorage.getItem('theme') !== null
  );

  // 1. Apply theme class to <html> and persist manual overrides to localStorage.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    // Only persist when the user has manually chosen a theme.
    if (isManualOverride.current) {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // 2. Listen for OS-level theme changes and auto-update unless overridden.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Skip if the user has set a manual preference.
      if (isManualOverride.current) return;
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Use addEventListener where supported, fall back to addListener.
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    isManualOverride.current = true;
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
