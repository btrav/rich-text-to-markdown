import React, { useState, useRef } from 'react';
import { JSONContent } from '@tiptap/react';
import { FileText, RotateCcw } from 'lucide-react';
import Header from './components/Header';
import RichTextEditor from './components/editor/RichTextEditor';
import MarkdownOutput from './components/output/MarkdownOutput';
import Button from './components/common/Button';
import { richTextToMarkdown } from './utils/richTextToMarkdown';
import { markdownToRichText } from './utils/markdownToRichText';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ThemeProvider } from './context/ThemeContext';
import StatsBar from './components/StatsBar';

function App() {
  const [editorContent, setEditorContent] = useLocalStorage<string>('editor-content', '');
  const [editorJson, setEditorJson] = useState<JSONContent | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  // Tracks when an editor update was triggered by the markdown panel,
  // so we don't overwrite the user's raw markdown with a round-tripped version.
  const fromMarkdown = useRef(false);

  const handleEditorChange = (html: string, json: JSONContent) => {
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
    fromMarkdown.current = true;
    const { json } = markdownToRichText(md);
    setEditorJson(json);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the editor content?')) {
      setEditorContent('');
      setEditorJson({ type: 'doc', content: [] });
      setMarkdown('');
    }
  };

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden">
        <Header />
        <StatsBar markdown={markdown} />

        <main className="flex-1 min-h-0 container mx-auto px-4 py-6 flex flex-col">
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* Left Column: Editor */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Rich Text Editor
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  icon={<RotateCcw size={16} />}
                  aria-label="Clear editor"
                >
                  Clear
                </Button>
              </div>

              <div className="flex-1 min-h-0">
                <RichTextEditor
                  value={editorContent}
                  jsonValue={editorJson}
                  onChange={handleEditorChange}
                />
              </div>
            </div>

            {/* Right Column: Markdown */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Markdown</h2>
              </div>

              <div className="flex-1 min-h-0">
                <MarkdownOutput
                  markdown={markdown}
                  onChange={handleMarkdownChange}
                />
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-700 py-4">
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
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
