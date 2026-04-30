# CodeEditor

A from-scratch monospace editor built on a transparent `<textarea>`
layered over a syntax-highlighted `<pre>`. Because the textarea is
real, IME, paste, undo/redo, spellcheck and OS-level selection all
work without custom logic. Includes auto-indent, bracket matching,
diagnostics squiggles, virtualised line rendering, and a Find /
Replace panel (Ctrl+F, Ctrl+H). Use this when you need real code
editing inline; for a one-line input use `<TextField>`.

## Import

```tsx
import { CodeEditor } from "@infinibay/harbor/inputs";
import { jsLang, jsonLang } from "@infinibay/harbor/lib/code"; // not yet re-exported
```

## Example

```tsx
const [src, setSrc] = useState('{"hello":"world"}');

<CodeEditor
  ariaLabel="Config JSON"
  language={jsonLang()}
  value={src}
  onChange={setSrc}
  height={320}
  diagnostics={[
    { line: 1, column: 8, severity: "warning", message: "Trailing whitespace" },
  ]}
/>
```

## Props

Extends `TextareaHTMLAttributes<HTMLTextAreaElement>` (minus `value`,
`defaultValue`, `onChange`, `readOnly`).

- **value** / **defaultValue** — `string`. Controlled or uncontrolled.
- **onChange** — `(next: string) => void`. Plain string, not an event.
- **language** — `Language<unknown>`. Returned by `jsLang()`,
  `jsonLang()`, etc. Required.
- **ariaLabel** — `string`. Required for screen readers — axe flags
  unlabelled textareas.
- **tabSize** — `number`. Default `2`.
- **insertSpaces** — `boolean`. Default `true`. Tab inserts spaces.
- **autoIndent** — `boolean`. Default `true`. Newline copies leading
  indent and adds one level after `{`, `(`, `[`, `:`, `,`.
- **autoClose** — `boolean`. Default `true`. Auto-pairs brackets and
  quotes; pressing the closer skips over it.
- **readOnly** — `boolean`. Disables editing keybindings.
- **placeholder** — `string`.
- **height** / **minHeight** / **maxHeight** — `number | string`.
  Defaults: `minHeight: 180`.
- **showLineNumbers** — `boolean`. Default `true`.
- **diagnostics** — `readonly Diagnostic[]`. Each entry renders a
  squiggle under the affected range and a sr-only list for ARIA.

## Notes

- Keybindings: Tab / Shift+Tab indent · Ctrl+/ toggle comment · Ctrl+D
  select next match · Ctrl+L select line · Ctrl+Shift+K delete line ·
  Alt+Up/Down move line · Alt+Shift+Up/Down duplicate line · Ctrl+F
  find · Ctrl+H replace.
- Lines outside the viewport are virtualised with an 8-line overscan,
  so 10k-line files stay smooth.
- `latestValueRef` / `latestSelectionRef` exist to compose same-tick
  keystrokes — don't remove them, you'll re-introduce dropped chars.
