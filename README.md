```
  ┌──────────────────────┬──┬──────────────────────┐
  │  B  I  H1 H2  ≡  "  │⇄ │                      │
  ├──────────────────────┤  ├──────────────────────┤
  │                      │  │ ## Hello world       │
  │  Hello world         │  │                      │
  │                      │  │ Edit **either**      │
  │  Edit either side.   │  │ side. The other      │
  │  The other updates   │  │ updates live.        │
  │  live.               │  │                      │
  │                      │  │ - item one           │
  │  • item one          │  │ - item two           │
  │  • item two          │  │                      │
  └──────────────────────┴──┴──────────────────────┘
```

# RT2M

**Rich text ↔ Markdown. Both directions. As you type.**

Paste rich text, get clean Markdown. Paste Markdown, get formatted rich text.
No convert button, no roundtrip lag. Just type in either panel.

**[→ Try it live](https://btrav.github.io/rich-text-to-markdown/)**

---

## What it does

RT2M is a browser-based writing tool with a TipTap rich text editor on one side
and an editable Markdown panel on the other. Edit either side and the other
updates in real time. Useful when you're moving content between platforms that
speak different formats: pulling from Notion into a codebase, writing for Ghost
or Substack in Markdown, cleaning up pasted content that arrived with broken
formatting.

Everything runs client-side. Nothing is sent anywhere.

---

## The flip

Most converters go one direction. RT2M has a tab at the top that flips which
panel leads:

- **Rich Text → Markdown** — write or paste in the editor, copy clean Markdown out
- **Markdown → Rich Text** — paste raw Markdown, get a formatted document back

Switching tabs doesn't reset your content. The sync is already bidirectional;
the tab is just a UI preference.

---

## What's included

- Bidirectional live sync between rich text and Markdown, as you type
- Full formatting: headings (H1–H3), bold, italic, underline, strikethrough,
  inline code, code blocks, blockquotes, ordered and unordered lists, links,
  images, horizontal rules
- Stats bar: words, characters, read time, lines, paragraphs, links — live
- Copy to clipboard
- Line numbers in the Markdown panel
- Dark mode
- Persists to localStorage

---

## Stack

- [React](https://react.dev) — UI
- [TipTap](https://tiptap.dev) — rich text editor
- [remark / unified](https://unifiedjs.com) — Markdown parsing
- [Tailwind CSS](https://tailwindcss.com) — styling

---

## Why

I kept copying content out of Notion into GitHub, Obsidian, and static site
generators and always losing something. A heading level, a list structure, a
stray `<br>`. Most converters I found were one-shot tools with no live feedback.
I wanted something that felt like a live translation, not a convert button.

---

## Run it locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/rich-text-to-markdown/`

---

made by [btrav](https://github.com/btrav)
