import React, { useEffect } from 'react';
import { Undo2, X } from 'lucide-react';

interface ToastUndoProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

const ToastUndo: React.FC<ToastUndoProps> = ({ message, onUndo, onDismiss, durationMs = 5000 }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="status"
      className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-lg bg-slate-900 dark:bg-slate-800 text-white text-sm border border-slate-700"
    >
      <span>{message}</span>
      <button
        onClick={onUndo}
        className="flex items-center gap-1 font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2"
      >
        <Undo2 size={14} />
        Undo
      </button>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-slate-400 hover:text-slate-200"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ToastUndo;
