import { JSONContent } from '@tiptap/react';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';

type Mark = NonNullable<JSONContent['marks']>[number];

// Created once at module level — instantiating a unified processor on every
// keystroke was the primary source of memory pressure in this app.
const processor = unified().use(remarkParse).use(remarkGfm);

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

// Recursively converts remark inline AST nodes to TipTap inline JSON.
// `marks` accumulates as we descend into nested formatting nodes (e.g. bold
// inside a link), so leaf text nodes end up with all ancestor marks applied.
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
      case 'break':
        result.push({ type: 'hardBreak' });
        break;
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

    case 'list': {
      // A GFM task list is an unordered list whose items carry `checked`.
      const items = node.children || [];
      const hasTaskItem = !node.ordered && items.some((i: any) => typeof i.checked === 'boolean');
      if (hasTaskItem) {
        return {
          type: 'taskList',
          content: items.map(convertTaskItem)
        };
      }
      return {
        type: node.ordered ? 'orderedList' : 'bulletList',
        content: items.map(convertListItem)
      };
    }

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

    case 'table':
      return convertTable(node);

    default:
      return null;
  }
};

const convertListItem = (node: any): JSONContent => {
  const content: JSONContent[] = [];
  for (const child of node.children || []) {
    // Both nested lists and other block children (paragraphs) go through
    // convertBlockNode, but the list branch is kept explicit so it's clear
    // that nested lists are handled rather than silently skipped.
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

const convertTaskItem = (node: any): JSONContent => {
  const content: JSONContent[] = [];
  for (const child of node.children || []) {
    const block = convertBlockNode(child);
    if (block) content.push(block);
  }
  return {
    type: 'taskItem',
    attrs: { checked: node.checked === true },
    content
  };
};

const convertTable = (node: any): JSONContent => {
  // remark-gfm stores alignment once per column at the table level.
  const align: Array<string | null> = node.align || [];
  const rows = node.children || [];
  const columnCount = rows[0]?.children?.length || 0;

  const buildRow = (row: any, isHeader: boolean): JSONContent => {
    const cellType = isHeader ? 'tableHeader' : 'tableCell';
    const cells: JSONContent[] = [];
    for (let i = 0; i < columnCount; i++) {
      const cell = row.children?.[i];
      const inline = cell ? convertInlineNodes(cell.children || []) : [];
      const textAlign = align[i] || null;
      cells.push({
        type: cellType,
        attrs: {
          colspan: 1,
          rowspan: 1,
          colwidth: null,
          ...(textAlign ? { textAlign } : {})
        },
        // TipTap table cells require block-level content.
        content: [{ type: 'paragraph', ...(inline.length ? { content: inline } : {}) }]
      });
    }
    return { type: 'tableRow', content: cells };
  };

  return {
    type: 'table',
    content: rows.map((row: any, idx: number) => buildRow(row, idx === 0))
  };
};
