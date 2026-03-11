import { JSONContent } from '@tiptap/react';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export const markdownToRichText = (markdown: string): { html: string; json: JSONContent } => {
  try {
    const processor = unified().use(remarkParse);
    const ast = processor.parse(markdown);
    const json = convertAstToJson(ast);
    
    return {
      html: '', // The editor will render from JSON
      json: {
        type: 'doc',
        content: json.content || []
      }
    };
  } catch (error) {
    console.error('Error converting markdown to rich text:', error);
    return { html: '', json: { type: 'doc', content: [] } };
  }
};

const convertAstToJson = (ast: any): JSONContent => {
  if (!ast) return { type: 'text', text: '' };

  switch (ast.type) {
    case 'root':
      return {
        type: 'doc',
        content: ast.children?.map(convertAstToJson).filter(Boolean) || []
      };

    case 'paragraph':
      return {
        type: 'paragraph',
        content: ast.children?.map(convertAstToJson).filter(Boolean) || []
      };

    case 'heading':
      return {
        type: 'heading',
        attrs: { level: ast.depth || 1 },
        content: ast.children?.map(convertAstToJson).filter(Boolean) || []
      };

    case 'list':
      return {
        type: ast.ordered ? 'orderedList' : 'bulletList',
        content: ast.children?.map(convertAstToJson).filter(Boolean) || []
      };

    case 'listItem':
      return {
        type: 'listItem',
        content: ast.children?.map(convertAstToJson).filter(Boolean) || []
      };

    case 'text':
      let node: JSONContent = { type: 'text', text: ast.value || '' };
      
      if (ast.bold) {
        node = wrapWithMark(node, 'bold');
      }
      if (ast.italic) {
        node = wrapWithMark(node, 'italic');
      }
      if (ast.code) {
        node = wrapWithMark(node, 'code');
      }
      
      return node;

    case 'link':
      return {
        type: 'text',
        marks: [{
          type: 'link',
          attrs: { href: ast.url || '' }
        }],
        content: ast.children?.map(convertAstToJson).filter(Boolean) || []
      };

    case 'code':
      return {
        type: 'codeBlock',
        attrs: { language: ast.lang || '' },
        content: [{ type: 'text', text: ast.value || '' }]
      };

    case 'blockquote':
      return {
        type: 'blockquote',
        content: ast.children?.map(convertAstToJson).filter(Boolean) || []
      };

    default:
      return { type: 'text', text: '' };
  }
};

const wrapWithMark = (node: JSONContent, markType: string): JSONContent => {
  return {
    ...node,
    marks: [...(node.marks || []), { type: markType }]
  };
};