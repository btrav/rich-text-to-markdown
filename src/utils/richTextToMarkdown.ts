import { JSONContent } from '@tiptap/react';

// Convert TipTap JSON content to Markdown
export const richTextToMarkdown = (content: JSONContent): string => {
  if (!content || !content.content) return '';

  return processContent(content.content).trim();
};

const processContent = (content: JSONContent[]): string => {
  if (!content || !content.length) return '';

  return content.map(node => processNode(node)).join('');
};

const processNode = (node: JSONContent): string => {
  if (!node) return '';

  switch (node.type) {
    case 'paragraph':
      return `${processContent(node.content || [])}${node.content && node.content.length > 0 ? '\n\n' : ''}`;

    case 'heading': {
      const level = node.attrs?.level || 1;
      const headingMarks = '#'.repeat(level);
      return `${headingMarks} ${processContent(node.content || [])}\n\n`;
    }

    case 'bulletList':
      return `${processContent(node.content || [])}\n`;

    case 'orderedList':
      return processOrderedList(node);

    case 'listItem':
      return `- ${processContent(node.content || []).replace(/\n\n$/, '\n')}`;

    case 'text':
      return processTextWithMarks(node);

    case 'hardBreak':
      return '\n';

    case 'codeBlock': {
      const language = node.attrs?.language || '';
      return `\`\`\`${language}\n${processContent(node.content || [])}\`\`\`\n\n`;
    }

    case 'blockquote': {
      const blockquoteContent = processContent(node.content || []);
      return `> ${blockquoteContent.replace(/\n/g, '\n> ')}\n\n`;
    }

    case 'image': {
      const src = node.attrs?.src || '';
      const alt = node.attrs?.alt || '';
      return `![${alt}](${src})\n\n`;
    }

    case 'horizontalRule':
      return '---\n\n';

    default:
      return processContent(node.content || []);
  }
};

const processOrderedList = (node: JSONContent): string => {
  if (!node.content) return '';

  let result = '';
  let counter = 1;

  node.content.forEach(item => {
    if (item.type === 'listItem') {
      const content = processContent(item.content || []).replace(/\n\n$/, '\n');
      result += `${counter}. ${content}`;
      counter++;
    }
  });

  return `${result}\n`;
};

const processTextWithMarks = (node: JSONContent): string => {
  if (!node.text) return '';

  let result = node.text;

  if (node.marks) {
    node.marks.forEach(mark => {
      switch (mark.type) {
        case 'bold':
          result = `**${result}**`;
          break;

        case 'italic':
          result = `*${result}*`;
          break;

        case 'code':
          result = `\`${result}\``;
          break;

        case 'strike':
          result = `~~${result}~~`;
          break;

        case 'link': {
          const href = mark.attrs?.href || '';
          result = `[${result}](${href})`;
          break;
        }

        case 'underline':
          // Markdown doesn't have underline, but we could use HTML
          result = `<u>${result}</u>`;
          break;
      }
    });
  }

  return result;
};
