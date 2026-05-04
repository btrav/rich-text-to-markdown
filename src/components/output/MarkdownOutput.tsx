import React, { useMemo } from 'react';

interface MarkdownOutputProps {
  markdown: string;
  onChange: (markdown: string) => void;
  showLineNumbers?: boolean;
}

// On desktop the textarea's lg:pl-20 (5rem) aligns the caret with the visible
// text in the pre overlay (pre p-4 = 1rem + line number area = 4rem).

const MarkdownOutput: React.FC<MarkdownOutputProps> = ({
  markdown,
  onChange,
  showLineNumbers = true,
}) => {
  const lines = useMemo(() => markdown.split('\n'), [markdown]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="relative h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0 border dark:border-slate-700 rounded-md overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <div className="relative min-h-[300px]">
          {/* On mobile (< lg): the textarea renders its own visible text; the pre overlay is hidden.
              On desktop (lg+): the textarea is transparent and the styled pre behind it shows the text + line numbers.
              text-base on mobile prevents iOS auto-zoom on focus (triggers below 16px). */}
          <textarea
            value={markdown}
            onChange={handleChange}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className={`font-mono text-base lg:text-sm leading-5 p-4 w-full h-full min-h-[300px] bg-transparent resize-none focus:outline-none absolute inset-0 z-10 text-slate-800 dark:text-slate-200 lg:text-transparent dark:lg:text-transparent caret-slate-800 dark:caret-slate-200 ${showLineNumbers ? 'lg:pl-20' : ''}`}
            style={{
              tabSize: 2,
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
            }}
          />
          {/* aria-hidden: the pre is purely visual. The textarea above it is the
              interactive element and holds the actual content for assistive tech. */}
          <pre
            className={`hidden lg:block font-mono text-sm leading-5 p-4 whitespace-pre-wrap break-words pointer-events-none min-h-[300px] text-slate-800 dark:text-slate-200 ${showLineNumbers ? 'line-numbers' : ''}`}
            aria-hidden="true"
          >
            {showLineNumbers
              ? lines.map((line, i) => (
                  <span key={i} className="line-item">{line}</span>
                ))
              : <code>{markdown}</code>
            }
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MarkdownOutput;
