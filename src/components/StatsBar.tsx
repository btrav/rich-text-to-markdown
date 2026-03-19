import React from 'react';

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

const StatsBar: React.FC<StatsBarProps> = ({ markdown }) => {
  const stats = computeStats(markdown);

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4 py-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
      {stats.map(({ label, value }) => (
        <span key={label}>
          <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
            {value}
          </span>
          {' '}{label}
        </span>
      ))}
      </div>
    </div>
  );
};

export default React.memo(StatsBar);
