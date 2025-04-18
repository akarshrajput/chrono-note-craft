
import React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeMode } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  
  const modes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Laptop className="h-4 w-4" /> },
  ];
  
  // Find the current mode icon to show in the button
  const currentModeIcon = modes.find(mode => mode.value === theme)?.icon || modes[2].icon;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {currentModeIcon}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {modes.map(mode => (
          <DropdownMenuItem
            key={mode.value}
            onClick={() => setTheme(mode.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {mode.icon}
            {mode.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
