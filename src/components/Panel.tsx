import React from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import Button from './common/Button';

interface PanelProps {
  title: string;
  icon?: React.ReactNode;
  isInput: boolean;
  copied: boolean;
  onClear: () => void;
  onCopy: () => void;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, icon, isInput, copied, onClear, onCopy, children }) => (
  <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold flex items-center">
        {icon}
        {title}
      </h2>
      {isInput ? (
        <Button variant="ghost" size="sm" onClick={onClear} icon={<RotateCcw size={16} />} aria-label="Clear editor">
          Clear
        </Button>
      ) : (
        <Button variant="secondary" size="sm" onClick={onCopy} icon={copied ? <Check size={16} /> : <Copy size={16} />} aria-label="Copy to clipboard">
          {copied ? 'Copied' : 'Copy'}
        </Button>
      )}
    </div>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);

export default Panel;
