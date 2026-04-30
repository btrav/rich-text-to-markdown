import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, 
  Heading1, Heading2, Heading3, Link, Code, Quote
} from 'lucide-react';
import Button from '../common/Button';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol === 'javascript:') return;
      } catch {
        // relative URL — allow it
      }
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-nowrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-x-auto lg:flex-wrap lg:overflow-visible">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        aria-label="Bold"
      >
        <Bold size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        aria-label="Italic"
      >
        <Italic size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        aria-label="Underline"
      >
        <Underline size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        aria-label="Strikethrough"
      >
        <Strikethrough size={16} />
      </Button>
      
      <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        aria-label="Heading 1"
      >
        <Heading1 size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        aria-label="Heading 2"
      >
        <Heading2 size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        aria-label="Heading 3"
      >
        <Heading3 size={16} />
      </Button>
      
      <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        aria-label="Bullet List"
      >
        <List size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        aria-label="Ordered List"
      >
        <ListOrdered size={16} />
      </Button>
      
      <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={addLink}
        isActive={editor.isActive('link')}
        aria-label="Link"
      >
        <Link size={16} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        aria-label="Inline Code"
      >
        <Code size={16} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        aria-label="Quote"
      >
        <Quote size={16} />
      </Button>
    </div>
  );
};

export default MenuBar;