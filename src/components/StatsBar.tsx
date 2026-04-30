import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface StatsBarProps {
  markdown: string;
}

interface Stat {
  label: string;
  value: string | number;
}

const computeStats = (markdown: string): Stat[] => {
  const trimmed = markdown.trim();

  if (!trimmed) {
    return [
      { label: 'Words', value: 0 },
      { label: 'Characters', value: 0 },
      { label: 'Read time', value: '0 min' },
      { label: 'Lines', value: 0 },
      { label: 'Paragraphs', value: 0 },
      { label: 'Links', value: 0 },
    ];
  }

  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const characters = trimmed.replace(/\n/g, '').length; // exclude newlines — mirrors how most editors count
  const readingMins = Math.max(1, Math.round(words / 200)); // ~200 wpm average silent reading speed
  const lines = trimmed.split('\n').length;
  const paragraphs = trimmed.split(/\n\n+/).filter(Boolean).length;
  const links = (trimmed.match(/\[.*?\]\(.*?\)/g) || []).length;

  return [
    { label: 'Words', value: words.toLocaleString() },
    { label: 'Characters', value: characters.toLocaleString() },
    { label: 'Read time', value: `${readingMins} min` },
    { label: 'Lines', value: lines.toLocaleString() },
    { label: 'Paragraphs', value: paragraphs.toLocaleString() },
    { label: 'Links', value: links.toLocaleString() },
  ];
};

const StatPill: React.FC<Stat> = ({ label, value }) => (
  <span>
    <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
      {value}
    </span>
    {' '}{label}
  </span>
);

const StatsBar: React.FC<StatsBarProps> = ({ markdown }) => {
  const [expanded, setExpanded] = useState(false);
  const stats = computeStats(markdown);
  const compact = stats.filter(s => s.label === 'Words' || s.label === 'Read time');
  const rest = stats.filter(s => s.label !== 'Words' && s.label !== 'Read time');

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4 py-1.5 lg:py-2 text-xs text-slate-500 dark:text-slate-400">
        {/* Mobile: compact summary + foldout (rest of stats + footer info) */}
        <div className="lg:hidden">
          <button
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide details' : 'Show details'}
            className="w-full flex items-center justify-between gap-3 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <div className="flex gap-x-3">
              {compact.map(s => <StatPill key={s.label} {...s} />)}
            </div>
            <ChevronDown
              size={14}
              className={`shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
          {expanded && (
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {rest.map(s => <StatPill key={s.label} {...s} />)}
              </div>
              <div>
                made by{' '}
                <a
                  href="https://github.com/btrav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-200 underline underline-offset-2"
                >
                  btrav
                </a>
                {' · '}
                <a
                  href="https://daringfireball.net/projects/markdown/syntax"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-200 underline underline-offset-2"
                >
                  markdown syntax
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: all stats inline */}
        <div className="hidden lg:flex flex-wrap gap-x-6 gap-y-1">
          {stats.map(s => <StatPill key={s.label} {...s} />)}
        </div>
      </div>
    </div>
  );
};

export default React.memo(StatsBar);
