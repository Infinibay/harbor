# MarkdownRenderer

`MarkdownRenderer` is a small, defensive renderer for trusted product markdown
strings. It supports common block and inline formatting while relying on React
escaping instead of passing raw HTML through.

Use it for release notes, changelog entries, short help text, preview panels, and
internal documentation snippets. For full documentation sites with tables,
plugins, MDX, or syntax highlighting, use a full markdown pipeline instead.

## Import

```tsx
import { MarkdownRenderer } from "@infinibay/harbor/dev";
```

## Basic Usage

```tsx
<MarkdownRenderer
  source={`# Release notes

This build fixes **billing sync** and adds \`harbor release\`.

- Faster checkout webhooks
- Better audit messages

\`\`\`bash
npm run release:pack-commercial
\`\`\`
`}
/>;
```

## Props

- **source** - `string`. Required markdown source.
- **className** - extra classes on the rendered wrapper.

## Supported Markdown

The renderer supports:

- `#` through `######` headings.
- paragraphs and horizontal rules.
- fenced code blocks with an optional language label.
- block quotes.
- unordered and ordered lists.
- inline code, bold, italic, and links.

HTML is not parsed or injected. Text is rendered through React nodes, so raw HTML
appears as text rather than executable markup.

## Rendering Model

The source is parsed into blocks with a small local parser, memoized by `source`.
Inline formatting is parsed after block detection. Links are rendered with
`target="_blank"` and `rel="noopener noreferrer"`.

This renderer is intentionally conservative. It favors predictable product UI
over broad Markdown compatibility.

## Accessibility

Headings render as real heading elements and lists render as real list elements.
Keep the markdown source semantically ordered, especially when it is displayed in
drawers or documentation panels.

Links should use descriptive text. Avoid source like `[click here](...)` when the
reader needs to understand the destination.

## Gotchas

- Nested lists are not fully parsed as nested structures.
- Tables, images, task lists, footnotes, and MDX are not supported.
- Code blocks show the language label but do not syntax-highlight.
- Use a sanitizer and mature markdown library if you need user-generated rich
  content with broader syntax support.

## Related

- `CodeBlock` for richer code presentation.
- `Prose` for long-form typography.
- `ChangelogFeed` for release-note timelines.
- `CopyCommand` for copyable command snippets.
