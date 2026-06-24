import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronUp, ChevronDown, Copy, Check } from 'lucide-react';
import { MARKDOWN_HINTS, Hint } from '../data/markdownHints';
import { copyToClipboard } from '../utils/copyToClipboard';

interface HintsTrayProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const HintRow: React.FC<{ hint: Hint; copied: boolean; onCopy: (h: Hint) => void }> = ({
  hint,
  copied,
  onCopy,
}) => (
  <button
    type="button"
    onClick={() => onCopy(hint)}
    aria-label={`Copy ${hint.label} syntax`}
    className="group w-full flex items-center justify-between gap-3 text-left px-2 h-11 lg:h-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
  >
    <span className="text-sm text-slate-600 dark:text-slate-300 shrink-0">{hint.label}</span>
    <span className="flex items-center gap-1.5 min-w-0">
      <code className="font-mono text-xs text-slate-500 dark:text-slate-400 truncate">
        {hint.preview ?? hint.syntax}
      </code>
      {copied ? (
        <Check size={13} className="text-green-600 dark:text-green-400 shrink-0" />
      ) : (
        <Copy
          size={13}
          className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        />
      )}
    </span>
  </button>
);

const HintsTray: React.FC<HintsTrayProps> = ({ open, onToggle, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

  const handleCopy = async (hint: Hint) => {
    const ok = await copyToClipboard(hint.syntax);
    if (!ok) return;
    if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
    setCopiedId(hint.id);
    copiedTimeout.current = setTimeout(() => setCopiedId(null), 1500);
  };

  // Escape closes the tray and returns focus to the handle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        handleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(
    () => () => {
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
    },
    []
  );

  return (
    <>
      {/* In-flow handle: a static-height strip above the footer, always visible.
          Sits in the flex column like StatsBar, so it never touches the min-h-0
          chain. Opens the overlay below. */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <button
          ref={handleRef}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="hints-panel"
          className="container mx-auto px-4 w-full flex items-center justify-between h-9 lg:h-8 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <BookOpen size={14} />
            Markdown hints
          </span>
          <ChevronUp size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Fixed overlay: slides up over the panels when open. Outside the flex
          chain entirely (like ToastUndo). z-40 keeps it under the Undo toast.
          invisible/visible (not display:none) keeps the rows out of the tab
          order when closed while still allowing the slide transition. */}
      <div
        id="hints-panel"
        role="region"
        aria-label="Markdown formatting hints"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] dark:shadow-none transition-[transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
          open ? 'visible translate-y-0' : 'invisible translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-between h-9 lg:h-8 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen size={14} />
              Markdown hints
            </span>
            <ChevronDown size={14} />
          </button>

          <div className="overflow-y-auto overscroll-contain max-h-[min(60vh,320px)] pb-4">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">
              Click any row to copy. These cover everything RT2M converts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1">
              {MARKDOWN_HINTS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mt-2 mb-1 px-2">
                    {group.title}
                  </h3>
                  <div className="flex flex-col">
                    {group.hints.map((hint) => (
                      <HintRow
                        key={hint.id}
                        hint={hint}
                        copied={copiedId === hint.id}
                        onCopy={handleCopy}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HintsTray;
