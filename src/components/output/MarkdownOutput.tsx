import React, { useMemo } from 'react';

interface MarkdownOutputProps {
  markdown: string;
  onChange: (markdown: string) => void;
  showLineNumbers?: boolean;
}

// Aligns the textarea caret with the text in the pre behind it.
// = pre's p-4 padding-left (1rem) + line number area (2.5rem width + 1rem padding-right + 0.5rem margin-right)
const LINE_NUMBER_OFFSET = '5rem';

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
          {/* Invisible textarea captures input; the pre behind it renders the styled text */}
          <textarea
            value={markdown}
            onChange={handleChange}
            className="font-mono text-sm p-4 w-full h-full min-h-[300px] bg-transparent resize-none focus:outline-none absolute inset-0 z-10"
            style={{
              tabSize: 2,
              color: 'transparent',
              caretColor: 'currentColor',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              paddingLeft: showLineNumbers ? LINE_NUMBER_OFFSET : undefined,
            }}
          />
          {/* aria-hidden: the pre is purely visual. The textarea above it is the
              interactive element and holds the actual content for assistive tech. */}
          <pre
            className={`font-mono text-sm p-4 whitespace-pre-wrap break-all pointer-events-none min-h-[300px] text-slate-800 dark:text-slate-200 ${showLineNumbers ? 'line-numbers' : ''}`}
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
