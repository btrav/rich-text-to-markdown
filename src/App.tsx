import React, { useState, useEffect } from 'react';
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

function App() {
  // Store editor HTML content
  const [editorContent, setEditorContent] = useLocalStorage<string>('editor-content', '');
  
  // Store editor JSON content for conversion
  const [editorJson, setEditorJson] = useState<JSONContent | null>(null);
  
  // Store markdown content
  const [markdown, setMarkdown] = useState<string>('');
  
  // Update markdown when editor content changes
  useEffect(() => {
    if (editorJson) {
      const md = richTextToMarkdown(editorJson);
      setMarkdown(md);
    }
  }, [editorJson]);

  // Handle editor content change
  const handleEditorChange = (html: string, json: JSONContent) => {
    setEditorContent(html);
    setEditorJson(json);
  };

  // Handle markdown content change
  const handleMarkdownChange = (md: string) => {
    setMarkdown(md);
    const { html, json } = markdownToRichText(md);
    setEditorContent(html);
    setEditorJson(json);
  };

  // Clear editor content
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the editor content?')) {
      setEditorContent('');
      setEditorJson(null);
      setMarkdown('');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: Editor */}
            <div className="flex-1 space-y-4">
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
              
              <RichTextEditor 
                value={editorContent} 
                onChange={handleEditorChange} 
              />
            </div>
            
            {/* Right Column: Markdown */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Markdown</h2>
              </div>
              
              <MarkdownOutput 
                markdown={markdown}
                onChange={handleMarkdownChange}
              />
            </div>
          </div>
        </main>
        
        <footer className="border-t border-slate-200 dark:border-slate-700 py-4">
          <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Rich Text to Markdown Converter &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;