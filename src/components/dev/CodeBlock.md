# CodeBlock

`CodeBlock` renders copyable, styled code snippets for documentation, developer tools, setup guides, generated examples, and onboarding flows. It gives snippets a Harbor surface, optional title bar, language label, copy button, line numbers, and line highlighting.

The syntax coloring is intentionally lightweight. Harbor tokenizes common JavaScript-like syntax itself; it does not run Prism, Shiki, or a language server.

## Import

```tsx
import { CodeBlock } from "@infinibay/harbor/dev";
```

## Basic Usage

```tsx
<CodeBlock
  title="App.tsx"
  lang="tsx"
  code={`import { Button } from "@infinibay/harbor/buttons";

export function App() {
  return <Button>Deploy</Button>;
}`}
/>
```

Highlight important lines with 1-indexed line numbers:

```tsx
<CodeBlock
  lang="tsx"
  highlight={[3, 4]}
  code={example}
/>
```

## Props

- **code** - required string. The source text to render and copy.
- **lang** - optional string shown in the header.
- **title** - optional `ReactNode` shown in the header.
- **showLineNumbers** - optional boolean. Defaults to `true`.
- **highlight** - optional number array. Values are 1-indexed line numbers.
- **className** - optional string merged onto the root.

## Display Model

When `title` or `lang` is provided, Harbor renders a header with window dots, title, language label, and `CopyButton`. Without a header, the copy button floats in the top-right corner.

The code is split by newline and rendered line by line. Highlighting adds a tinted background and left border to the selected rows.

## Content Guidance

Keep examples complete enough to run, but short enough to scan. For install guides, include the command and the expected file. For component examples, include the Harbor imports so customers see the library surface clearly.

Use `title` for filenames and `lang` for the language or shell type.

## Accessibility

The copy control is a real button from `CopyButton`. Code itself is rendered inside `<pre><code>`, preserving spacing. Do not put critical explanation only in highlighted color; explain important lines in the surrounding prose.

## Gotchas

- Syntax highlighting is simple and best suited for TypeScript, JavaScript, JSON-ish snippets, CSS, shell commands, and short examples.
- `highlight` is 1-indexed, not zero-indexed.
- Very long lines scroll horizontally.
- The component does not execute, validate, or format code.

## Related

- `CopyButton` for standalone copy actions.
- `Terminal` for command output or shell-like experiences.
- `MarkdownRenderer` for prose that contains code.
- `VMConsole` for live console previews.
