# MarkdownRenderer

Tiny defensive Markdown renderer — no HTML pass-through, everything is
escaped through React. For richer Markdown (tables, GFM, footnotes) use
a real parser; this one keeps the bundle dep-free.

## Import

```tsx
import { MarkdownRenderer } from "@infinibay/harbor/dev";
```

## Example

```tsx
<MarkdownRenderer
  source={`# Hello

This is **bold**, *italic*, and \`inline code\`.

- One bullet
- Another with a [link](https://infinibay.com)

\`\`\`tsx
const x = 1;
\`\`\`

> Block quote — for important asides.
`}
/>
```

## Supported syntax

- `# … ######` headings
- `**bold**`, `*italic*`, `` `inline code` ``
- ` ``` ` fenced code blocks (with optional language tag)
- `> ` blockquotes
- `- ` / `* ` unordered lists
- `1. ` ordered lists
- `[text](url)` links — open in new tab
- `---` horizontal rule
- Paragraphs (anything that isn't one of the above)

## Props

- **source** — `string`. Required. Raw Markdown.
- **className** — extra classes on the wrapper.

## Notes

- HTML inside `source` is **not** rendered as HTML — React escapes it.
- Nested lists, tables, images, task lists, footnotes, and HTML are
  intentionally not supported.
