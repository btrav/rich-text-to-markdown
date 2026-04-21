import { JSONContent } from '@tiptap/react';

export const richTextToMarkdown = (content: JSONContent): string => {
  if (!content || !content.content) return '';

  return processContent(content.content).trim();
};

const processContent = (content: JSONContent[]): string => {
  if (!content || !content.length) return '';

  return content.map(node => processNode(node)).join('');
};

const isTaskList = (node: JSONContent): boolean =>
  node.type === 'taskList' ||
  (node.type === 'bulletList' && !!node.content?.some(c => c.type === 'taskItem'));

const processNode = (node: JSONContent): string => {
  if (!node) return '';

  switch (node.type) {
    case 'paragraph':
      // Skip the trailing double-newline for empty paragraphs (e.g. TipTap adds
      // an empty paragraph at the end of the doc) to avoid stray blank lines.
      return `${processContent(node.content || [])}${node.content && node.content.length > 0 ? '\n\n' : ''}`;

    case 'heading': {
      const level = node.attrs?.level || 1;
      const headingMarks = '#'.repeat(level);
      return `${headingMarks} ${processContent(node.content || [])}\n\n`;
    }

    case 'bulletList':
      if (isTaskList(node)) return processTaskList(node);
      return `${processContent(node.content || [])}\n`;

    case 'orderedList':
      return processOrderedList(node);

    case 'taskList':
      return processTaskList(node);

    case 'listItem':
      // TipTap wraps list item text in a paragraph, which adds \n\n. Trim it to
      // \n so consecutive list items don't have blank lines between them.
      return `- ${processContent(node.content || []).replace(/\n\n$/, '\n')}`;

    case 'taskItem': {
      const checked = node.attrs?.checked ? 'x' : ' ';
      return `- [${checked}] ${processContent(node.content || []).replace(/\n\n$/, '\n')}`;
    }

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
      // Prefix every line with "> " so multi-line blockquotes render correctly.
      return `> ${blockquoteContent.replace(/\n/g, '\n> ')}\n\n`;
    }

    case 'image': {
      const src = node.attrs?.src || '';
      const alt = node.attrs?.alt || '';
      return `![${alt}](${src})\n\n`;
    }

    case 'horizontalRule':
      return '---\n\n';

    case 'table':
      return processTable(node);

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

const processTaskList = (node: JSONContent): string => {
  if (!node.content) return '';
  return `${node.content.map(item => processNode(item)).join('')}\n`;
};

// GFM cells can't contain literal newlines or unescaped pipes.
const escapeCellText = (text: string): string =>
  text.replace(/\|/g, '\\|').replace(/\n+/g, ' <br> ');

const extractCellText = (cell: JSONContent): string => {
  // Cells wrap content in paragraphs. Serialize the inline contents of each
  // paragraph, joining with <br> since GFM cells are single-line.
  const parts: string[] = [];
  for (const child of cell.content || []) {
    if (child.type === 'paragraph') {
      parts.push(processContent(child.content || []));
    } else {
      parts.push(processContent([child]).replace(/\n+$/g, ''));
    }
  }
  return escapeCellText(parts.join(' <br> ').trim());
};

const alignmentSeparator = (align: string | undefined): string => {
  switch (align) {
    case 'left': return ':---';
    case 'center': return ':---:';
    case 'right': return '---:';
    default: return '---';
  }
};

const processTable = (node: JSONContent): string => {
  const rows = (node.content || []).filter(r => r.type === 'tableRow');
  if (rows.length === 0) return '';

  const headerRow = rows[0];
  const bodyRows = rows.slice(1);
  const headerCells = headerRow.content || [];
  const columnCount = headerCells.length;

  const alignments = headerCells.map(cell => cell.attrs?.textAlign as string | undefined);

  const renderRow = (cells: JSONContent[]): string => {
    const texts: string[] = [];
    for (let i = 0; i < columnCount; i++) {
      const cell = cells[i];
      texts.push(cell ? extractCellText(cell) : '');
    }
    return `| ${texts.join(' | ')} |`;
  };

  const headerLine = renderRow(headerCells);
  const separatorLine = `| ${alignments.map(alignmentSeparator).join(' | ')} |`;
  const bodyLines = bodyRows.map(row => renderRow(row.content || []));

  return `${[headerLine, separatorLine, ...bodyLines].join('\n')}\n\n`;
};

const processTextWithMarks = (node: JSONContent): string => {
  if (!node.text) return '';

  let result = node.text;

  if (node.marks) {
    // Marks are applied in TipTap's stored order, so each wraps the result of
    // the previous one (outermost mark ends up as the outermost syntax).
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
