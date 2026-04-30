import React from 'react';
import { Hash } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Hash className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-500 shrink-0" />
          {/* Mobile: title + subtitle inline. Desktop: subtitle stacked below title. */}
          <div className="flex items-center gap-2 min-w-0 lg:flex-col lg:items-start lg:gap-0 lg:leading-tight">
            <h1 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-white">RT2M</h1>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">Rich Text to Markdown</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
