
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeMode } from '@/types';
import { applyTheme } from '@/utils/theme-utils';
import { toast } from 'sonner';

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  
  useEffect(() => {
    // Load theme from localStorage on mount
    try {
      const storedTheme = localStorage.getItem('noteapp-theme') as ThemeMode | null;
      if (storedTheme) {
        setThemeState(storedTheme);
        applyTheme(storedTheme);
      }
    } catch (error) {
      console.error('Error loading theme from localStorage', error);
    }
  }, []);
  
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('noteapp-theme', newTheme);
    applyTheme(newTheme);
    
    toast.info(`Theme changed to ${newTheme === 'system' ? 'system default' : newTheme} mode`);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
