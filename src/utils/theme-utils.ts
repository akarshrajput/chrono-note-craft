
import { ThemeMode } from '@/types';

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // Default to light for SSR
};

export const applyTheme = (theme: ThemeMode): void => {
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    const actualTheme = theme === 'system' ? getSystemTheme() : theme;
    
    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
};
