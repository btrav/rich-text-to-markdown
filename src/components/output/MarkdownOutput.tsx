import React, { useRef } from 'react';
import { Copy, Check } from 'lucide-react';
import Button from '../common/Button';
import { copyToClipboard } from '../../utils/copyToClipboard';

interface MarkdownOutputProps {
  markdown: string;
  onChange: (markdown: string) => void;
  showLineNumbers?: boolean;
}

const MarkdownOutput: React.FC<MarkdownOutputProps> = ({ 
  markdown, 
  onChange,
  showLineNumbers = true 
}) => {
  const [copied, setCopied] = React.useState(false);
  const outputRef = useRef<HTMLPreElement>(null);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  // Keyboard shortcut for copy
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        handleCopy();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [markdown]);
  
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleCopy}
          icon={copied ? <Check size={16} /> : <Copy size={16} />}
          aria-label="Copy to clipboard"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      
      <div className="border dark:border-slate-700 rounded-md overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="relative min-h-[300px]">
          <textarea
            value={markdown}
            onChange={handleChange}
            className="font-mono text-sm p-4 w-full h-full min-h-[300px] bg-transparent resize-none focus:outline-none absolute inset-0 z-10"
            style={{ 
              tabSize: 2,
              color: 'transparent',
              caretColor: 'currentColor'
            }}
          />
          <pre 
            ref={outputRef}
            className="font-mono text-sm p-4 whitespace-pre pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            {showLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {markdown.split('\n').map((line, i) => (
                    <tr key={i} className="leading-6">
                      <td className="text-right pr-4 select-none text-slate-500 dark:text-slate-400 w-10 align-top">
                        {i + 1}
                      </td>
                      <td className="whitespace-pre text-slate-800 dark:text-slate-200">
                        {line}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <code className="text-slate-800 dark:text-slate-200">{markdown}</code>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MarkdownOutput;