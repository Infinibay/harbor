# CodeBlock

Static code display with a window-chrome header, copy button, and a
tiny built-in tokenizer (keywords, strings, numbers, capitalized
identifiers, comments). For interactive editing use `<YAMLConfigEditor>`
or wire your own editor.

## Import

```tsx
import { CodeBlock } from "@infinibay/harbor/dev";
```

## Example

```tsx
<CodeBlock
  lang="tsx"
  title="save.tsx"
  showLineNumbers
  highlight={[2]}
  code={`import { Button } from "@infinibay/harbor/buttons";

export function Save() {
  return <Button variant="primary">Save</Button>;
}`}
/>
```

## Props

- **code** — `string`. Required.
- **lang** — `string`. Display tag in the header (`"tsx"`, `"bash"`, …).
  The built-in tokenizer is language-agnostic.
- **title** — `ReactNode`. File name shown next to the traffic-light dots.
- **showLineNumbers** — `boolean`. Default `true`.
- **highlight** — `number[]`. 1-based line numbers to tint with a fuchsia bar.
- **className** — extra classes on the wrapper.

## Notes

- A `<CopyButton>` is always rendered: in the header when `title`/`lang`
  is set, otherwise floating top-right.
- The tokenizer is intentionally small — it won't match every TS edge
  case but stays fast and dependency-free.
