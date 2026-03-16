import { JSONContent } from '@tiptap/react';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

type Mark = NonNullable<JSONContent['marks']>[number];

// Created once at module level — instantiating a unified processor on every
// keystroke was the primary source of memory pressure in this app.
const processor = unified().use(remarkParse);

export const markdownToRichText = (markdown: string): { html: string; json: JSONContent } => {
  try {
    const ast = processor.parse(markdown);
    return {
      html: '',
      json: {
        type: 'doc',
        content: convertBlockNodes((ast as any).children || [])
      }
    };
  } catch (error) {
    console.error('Error converting markdown to rich text:', error);
    return { html: '', json: { type: 'doc', content: [] } };
  }
};

const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'javascript:') return '';
  } catch {
    // relative URL — allow it
  }
  return url;
};

const convertInlineNodes = (nodes: any[], marks: Mark[] = []): JSONContent[] => {
  const result: JSONContent[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case 'text':
        if (node.value) {
          result.push({
            type: 'text',
            text: node.value,
            ...(marks.length ? { marks } : {})
          });
        }
        break;
      case 'strong':
        result.push(...convertInlineNodes(node.children || [], [...marks, { type: 'bold' }]));
        break;
      case 'emphasis':
        result.push(...convertInlineNodes(node.children || [], [...marks, { type: 'italic' }]));
        break;
      case 'inlineCode':
        result.push({
          type: 'text',
          text: node.value || '',
          marks: [...marks, { type: 'code' }]
        });
        break;
      case 'delete':
        result.push(...convertInlineNodes(node.children || [], [...marks, { type: 'strike' }]));
        break;
      case 'link': {
        const href = sanitizeUrl(node.url || '');
        result.push(...convertInlineNodes(node.children || [], [
          ...marks,
          { type: 'link', attrs: { href, target: '_blank', rel: 'noopener noreferrer' } }
        ]));
        break;
      }
    }
  }
  return result;
};

const convertBlockNodes = (nodes: any[]): JSONContent[] =>
  nodes.map(convertBlockNode).filter((n): n is JSONContent => n !== null);

const convertBlockNode = (node: any): JSONContent | null => {
  switch (node.type) {
    case 'paragraph': {
      const content = convertInlineNodes(node.children || []);
      return { type: 'paragraph', ...(content.length ? { content } : {}) };
    }

    case 'heading':
      return {
        type: 'heading',
        attrs: { level: node.depth || 1 },
        content: convertInlineNodes(node.children || [])
      };

    case 'list':
      return {
        type: node.ordered ? 'orderedList' : 'bulletList',
        content: (node.children || []).map(convertListItem)
      };

    case 'code':
      return {
        type: 'codeBlock',
        attrs: { language: node.lang || null },
        content: [{ type: 'text', text: node.value || '' }]
      };

    case 'blockquote':
      return {
        type: 'blockquote',
        content: convertBlockNodes(node.children || [])
      };

    case 'thematicBreak':
      return { type: 'horizontalRule' };

    default:
      return null;
  }
};

const convertListItem = (node: any): JSONContent => {
  const content: JSONContent[] = [];
  for (const child of node.children || []) {
    if (child.type === 'list') {
      const nested = convertBlockNode(child);
      if (nested) content.push(nested);
    } else {
      const block = convertBlockNode(child);
      if (block) content.push(block);
    }
  }
  return { type: 'listItem', content };
};
