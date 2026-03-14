import React, { useEffect } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import MenuBar from './MenuBar';

interface RichTextEditorProps {
  value: string;
  jsonValue?: JSONContent | null;
  onChange: (html: string, json: JSONContent) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, jsonValue, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline',
        },
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
  });

  // Sync programmatic JSON updates (e.g. from the markdown panel) into the editor.
  useEffect(() => {
    if (!editor || jsonValue === undefined) return;
    editor.commands.setContent(jsonValue ?? '');
  }, [jsonValue, editor]);

  return (
    <div className="border rounded-md overflow-hidden bg-white dark:bg-slate-800 dark:border-slate-700 h-full flex flex-col min-h-0">
      <MenuBar editor={editor} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="prose prose-slate dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
