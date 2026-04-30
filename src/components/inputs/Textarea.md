# Textarea

Multi-line text input with an optional floating label and character
counter. The counter renders a thin progress bar that flips to red
once the user crosses 90% of `maxChars`. Use `Textarea` for
descriptions, comments, and prose; for one-line inputs use
`<TextField>`, and for code reach for `<CodeEditor>`.

## Import

```tsx
import { Textarea } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<Textarea
  label="Description"
  placeholder="Tell us what this is about…"
  maxChars={280}
  rows={4}
/>
```

## Props

- **label** — `string`. Optional label rendered inside the box,
  above the textarea.
- **maxChars** — `number`. When set, renders the gradient progress
  bar + count readout. Does not enforce the limit — wire `maxLength`
  if you want hard truncation.
- **value** / **defaultValue** / **onChange** — controlled or
  uncontrolled `<textarea>` state.
- Plus all standard `HTMLTextAreaElement` attributes (`rows`,
  `placeholder`, `disabled`, `maxLength`, etc.).

## Notes

- Forwards `ref` to the underlying `<textarea>`.
- The bar is purely visual — counting is done internally; the bar is
  hidden when `maxChars` is omitted.
