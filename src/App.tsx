import React, { useState, useRef, useEffect } from 'react';
import { JSONContent } from '@tiptap/react';
import { FileText, RotateCcw, Copy, Check } from 'lucide-react';
import Header from './components/Header';
import RichTextEditor from './components/editor/RichTextEditor';
import MarkdownOutput from './components/output/MarkdownOutput';
import Button from './components/common/Button';
import { richTextToMarkdown } from './utils/richTextToMarkdown';
import { markdownToRichText } from './utils/markdownToRichText';
import { copyToClipboard, copyRichTextToClipboard } from './utils/copyToClipboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ThemeProvider } from './context/ThemeContext';
import StatsBar from './components/StatsBar';

type Direction = 'rte-to-md' | 'md-to-rte';
type Panel = 'editor' | 'markdown';

const PANEL_ORDER: Record<Direction, Panel[]> = {
  'rte-to-md': ['editor', 'markdown'],
  'md-to-rte': ['markdown', 'editor'],
};

function App() {
  const [editorContent, setEditorContent] = useLocalStorage<string>('editor-content', '');
  const [editorJson, setEditorJson] = useState<JSONContent | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [direction, setDirection] = useState<Direction>('rte-to-md');
  const [copied, setCopied] = useState(false);
  // Tracks when an editor update was triggered by the markdown panel,
  // so we don't overwrite the user's raw markdown with a round-tripped version.
  const fromMarkdown = useRef(false);
  const syncDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref mirrors editorContent but updates synchronously, so handleCopy always
  // reads the latest HTML even before React re-renders with the new state.
  const editorHtmlRef = useRef(editorContent);

  const handleEditorChange = (html: string, json: JSONContent) => {
    editorHtmlRef.current = html;
    if (fromMarkdown.current) {
      fromMarkdown.current = false;
      setEditorContent(html);
      return;
    }
    setEditorContent(html);
    setMarkdown(richTextToMarkdown(json));
  };

  const handleMarkdownChange = (md: string) => {
    setMarkdown(md);
    // Debounce the expensive remark parse + editor sync so it doesn't run on
    // every keystroke. The markdown textarea updates immediately above.
    if (syncDebounce.current) clearTimeout(syncDebounce.current);
    syncDebounce.current = setTimeout(() => {
      fromMarkdown.current = true;
      const { json } = markdownToRichText(md);
      setEditorJson(json);
    }, 300);
  };

  const handleCopy = async () => {
    const success = direction === 'rte-to-md'
      ? await copyToClipboard(markdown)
      : await copyRichTextToClipboard(editorHtmlRef.current);
    if (success) {
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
      setCopied(true);
      copiedTimeout.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => () => {
    if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the editor content?')) {
      editorHtmlRef.current = '';
      setEditorContent('');
      setEditorJson({ type: 'doc', content: [] });
      setMarkdown('');
    }
  };

  return (
    <ThemeProvider>
      <div className="h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden">
        <Header />
        <StatsBar markdown={markdown} />

        <main className="flex-1 min-h-0 container mx-auto px-4 py-6 flex flex-col gap-4">
          <div className="flex gap-1 p-0.5 lg:p-1 bg-slate-200 dark:bg-slate-700 rounded-lg w-fit">
            {(['rte-to-md', 'md-to-rte'] as Direction[]).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={`px-2 py-0.5 text-[11px] lg:px-4 lg:py-1.5 lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  direction === d
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <span className="lg:hidden">{d === 'rte-to-md' ? 'RTE → MD' : 'MD → RTE'}</span>
                <span className="hidden lg:inline">{d === 'rte-to-md' ? 'Rich Text → Markdown' : 'Markdown → Rich Text'}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {PANEL_ORDER[direction].map((panel, i) => {
              const isInputPanel = i === 0;
              return panel === 'editor' ? (
                <div key="editor" className="flex-1 min-w-0 min-h-0 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Rich Text Editor
                    </h2>
                    {isInputPanel ? (
                      <Button variant="ghost" size="sm" onClick={handleClear} icon={<RotateCcw size={16} />} aria-label="Clear editor">
                        Clear
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={handleCopy} icon={copied ? <Check size={16} /> : <Copy size={16} />} aria-label="Copy to clipboard">
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 min-h-0">
                    <RichTextEditor
                      value={editorContent}
                      jsonValue={editorJson}
                      onChange={handleEditorChange}
                    />
                  </div>
                </div>
              ) : (
                <div key="markdown" className="flex-1 min-w-0 min-h-0 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Markdown</h2>
                    {isInputPanel ? (
                      <Button variant="ghost" size="sm" onClick={handleClear} icon={<RotateCcw size={16} />} aria-label="Clear editor">
                        Clear
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={handleCopy} icon={copied ? <Check size={16} /> : <Copy size={16} />} aria-label="Copy to clipboard">
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 min-h-0">
                    <MarkdownOutput
                      markdown={markdown}
                      onChange={handleMarkdownChange}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <footer className="hidden lg:block border-t border-slate-200 dark:border-slate-700 py-4">
          <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
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
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
