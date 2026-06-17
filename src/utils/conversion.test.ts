import { describe, it, expect } from 'vitest';
import { markdownToRichText } from './markdownToRichText';
import { richTextToMarkdown } from './richTextToMarkdown';

// The whole value of a converter is fidelity. These tests lock in round-trip
// stability (md -> rich text JSON -> md) for every construct Claude commonly
// emits, so the formatting fixes from past sessions can't silently regress.
const roundTrip = (md: string): string => richTextToMarkdown(markdownToRichText(md));

describe('markdown round-trip', () => {
  const stable: Array<[string, string]> = [
    ['heading 1', '# Heading'],
    ['heading 2', '## Heading'],
    ['heading 3', '### Heading'],
    ['bold', '**bold**'],
    ['italic', '*italic*'],
    ['inline code', '`code`'],
    ['strikethrough', '~~struck~~'],
    ['link', '[label](https://example.com)'],
    ['bullet list', '- one\n- two'],
    ['ordered list', '1. one\n2. two'],
    ['task list', '- [ ] todo\n- [x] done'],
    ['horizontal rule', '---'],
    ['fenced code with language', '```js\nconst x = 1;\n```'],
    ['fenced code without language', '```\nplain\n```'],
    ['blockquote', '> quoted'],
    ['table', '| A | B |\n| --- | --- |\n| 1 | 2 |'],
    ['table with alignment', '| A | B | C |\n| :--- | :---: | ---: |\n| 1 | 2 | 3 |'],
    ['underline (html)', '<u>under</u>'],
  ];

  for (const [name, md] of stable) {
    it(`preserves ${name}`, () => {
      expect(roundTrip(md).trim()).toBe(md);
    });
  }
});

describe('no silent data loss on raw HTML', () => {
  it('keeps inline HTML rather than dropping it', () => {
    // <sub> has no markdown equivalent; it must survive as literal text, not vanish.
    const md = 'H<sub>2</sub>O';
    expect(roundTrip(md)).toContain('<sub>');
    expect(roundTrip(md)).toContain('2');
  });

  it('converts <br> to a hard break', () => {
    const json = markdownToRichText('line<br>break');
    const para = json.content?.[0];
    const types = para?.content?.map((n) => n.type);
    expect(types).toContain('hardBreak');
  });

  it('keeps block-level HTML rather than dropping it', () => {
    const md = '<details>\n<summary>more</summary>\n</details>';
    const out = roundTrip(md);
    expect(out).toContain('<details>');
    expect(out).toContain('<summary>more</summary>');
  });
});

describe('formatting marks', () => {
  it('round-trips bold inside a list item', () => {
    expect(roundTrip('- **bold** item').trim()).toBe('- **bold** item');
  });

  it('round-trips a link inside a heading', () => {
    expect(roundTrip('## See [docs](https://x.com)').trim()).toBe('## See [docs](https://x.com)');
  });
});
