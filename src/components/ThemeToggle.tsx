import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './common/Button';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="w-9 px-0"
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-slate-700" />
      ) : (
        <Sun size={18} className="text-amber-300" />
      )}
    </Button>
  );
};

export default ThemeToggle;