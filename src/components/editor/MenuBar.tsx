import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Heading1, Heading2, Heading3, Link, Code, Quote,
  type LucideIcon
} from 'lucide-react';
import Button from '../common/Button';

interface MenuBarProps {
  editor: Editor | null;
}

type MenuItem =
  | { kind: 'button'; icon: LucideIcon; label: string; run: () => void; active: boolean }
  | { kind: 'divider' };

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (!url) return;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'javascript:') return;
    } catch {
      // relative URL — allow it
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const items: MenuItem[] = [
    { kind: 'button', icon: Bold, label: 'Bold', run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { kind: 'button', icon: Italic, label: 'Italic', run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { kind: 'button', icon: Underline, label: 'Underline', run: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { kind: 'button', icon: Strikethrough, label: 'Strikethrough', run: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { kind: 'divider' },
    { kind: 'button', icon: Heading1, label: 'Heading 1', run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { kind: 'button', icon: Heading2, label: 'Heading 2', run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { kind: 'button', icon: Heading3, label: 'Heading 3', run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { kind: 'divider' },
    { kind: 'button', icon: List, label: 'Bullet List', run: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { kind: 'button', icon: ListOrdered, label: 'Ordered List', run: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { kind: 'divider' },
    { kind: 'button', icon: Link, label: 'Link', run: addLink, active: editor.isActive('link') },
    { kind: 'button', icon: Code, label: 'Inline Code', run: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
    { kind: 'button', icon: Quote, label: 'Quote', run: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
  ];

  return (
    <div className="flex flex-nowrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-x-auto lg:flex-wrap lg:overflow-visible">
      {items.map((item, i) => {
        if (item.kind === 'divider') {
          return <div key={`d-${i}`} className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />;
        }
        const Icon = item.icon;
        return (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            onClick={item.run}
            isActive={item.active}
            aria-label={item.label}
          >
            <Icon size={16} />
          </Button>
        );
      })}
    </div>
  );
};

export default MenuBar;
