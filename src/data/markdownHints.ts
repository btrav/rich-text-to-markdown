// The hints map to exactly the markdown the converter supports and round-trips,
// so this doubles as the contract of what works. Deliberately omits syntax the
// converter can't handle (footnotes, frontmatter, deeply nested lists).

export interface Hint {
  id: string;        // stable key for React + copied-feedback
  label: string;     // human name
  syntax: string;    // the exact snippet copied to the clipboard
  preview?: string;  // single-line display when syntax is multiline
}

export interface HintGroup {
  title: string;
  hints: Hint[];
}

export const MARKDOWN_HINTS: HintGroup[] = [
  {
    title: 'Inline',
    hints: [
      { id: 'bold', label: 'Bold', syntax: '**bold**' },
      { id: 'italic', label: 'Italic', syntax: '*italic*' },
      { id: 'strike', label: 'Strikethrough', syntax: '~~struck~~' },
      { id: 'code', label: 'Inline code', syntax: '`code`' },
      { id: 'underline', label: 'Underline', syntax: '<u>underline</u>' },
      { id: 'link', label: 'Link', syntax: '[text](https://url.com)' },
      { id: 'image', label: 'Image', syntax: '![alt](https://img.png)' },
      { id: 'break', label: 'Line break', syntax: '<br>' },
    ],
  },
  {
    title: 'Headings',
    hints: [
      { id: 'h1', label: 'Heading 1', syntax: '# Heading' },
      { id: 'h2', label: 'Heading 2', syntax: '## Heading' },
      { id: 'h3', label: 'Heading 3', syntax: '### Heading' },
    ],
  },
  {
    title: 'Lists',
    hints: [
      { id: 'ul', label: 'Bullet list', syntax: '- item' },
      { id: 'ol', label: 'Numbered list', syntax: '1. item' },
      { id: 'task', label: 'Task list', syntax: '- [ ] todo' },
    ],
  },
  {
    title: 'Blocks',
    hints: [
      { id: 'quote', label: 'Blockquote', syntax: '> quote' },
      { id: 'hr', label: 'Divider', syntax: '---' },
      {
        id: 'fence',
        label: 'Code block',
        syntax: '```js\ncode\n```',
        preview: '```js … ```',
      },
      {
        id: 'table',
        label: 'Table',
        syntax: '| Left | Right |\n| :--- | ---: |\n| a | b |',
        preview: '| Left | Right | …',
      },
    ],
  },
];
