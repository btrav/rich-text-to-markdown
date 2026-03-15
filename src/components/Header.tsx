import React from 'react';
import { Hash } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Hash className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          <div className="flex flex-col leading-tight">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">RT2M</h1>
            <span className="text-xs text-slate-500 dark:text-slate-400">Rich Text to Markdown</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;