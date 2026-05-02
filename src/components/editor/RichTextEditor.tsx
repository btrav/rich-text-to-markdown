import React, { useEffect } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import MenuBar from './MenuBar';

interface RichTextEditorProps {
  value: string;
  jsonValue?: JSONContent | null;
  onChange: (html: string, json: JSONContent) => void;
}

// TipTap's default table cells don't store column alignment. Extend them with
// a textAlign attr so GFM alignment survives the round-trip.
const CellWithAlign = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: null,
        parseHTML: el => (el as HTMLElement).style.textAlign || null,
        renderHTML: attrs => (attrs.textAlign ? { style: `text-align: ${attrs.textAlign}` } : {}),
      },
    };
  },
});

const HeaderWithAlign = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: null,
        parseHTML: el => (el as HTMLElement).style.textAlign || null,
        renderHTML: attrs => (attrs.textAlign ? { style: `text-align: ${attrs.textAlign}` } : {}),
      },
    };
  },
});

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
      Table.configure({ resizable: false }),
      TableRow,
      HeaderWithAlign,
      CellWithAlign,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
  });

  // Sync programmatic JSON updates (e.g. from the markdown panel) into the editor.
  // Skip when jsonValue is null/undefined — that's the initial state, and we don't
  // want to overwrite the HTML that useEditor already loaded via `content: value`.
  // setContent doesn't trigger onUpdate in TipTap, so we call onChange explicitly
  // to keep App state/refs in sync with what the editor is actually showing.
  useEffect(() => {
    if (!editor || jsonValue == null) return;
    editor.commands.setContent(jsonValue);
    onChange(editor.getHTML(), editor.getJSON());
  }, [jsonValue, editor]);

  return (
    <div className="border rounded-md overflow-hidden bg-white dark:bg-slate-800 dark:border-slate-700 h-full flex flex-col min-h-0">
      <MenuBar editor={editor} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="prose prose-slate dark:prose-invert max-w-none focus:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-4"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
