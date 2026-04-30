# CopyButton

One-click "copy to clipboard" control with a built-in success swap. Use it
next to code snippets, tokens, IDs, or share links — anywhere the user's
next move is "copy this string."

## Import

```tsx
import { CopyButton } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<CopyButton value="npm install @infinibay/harbor" />

<CopyButton value={token} size="sm">
  Copy token
</CopyButton>
```

## Props

- **value** — `string`. The text written to the clipboard on click. Required.
- **children** — `ReactNode`. Custom label; falls back to `"Copy"`.
- **size** — `"sm" | "md"`. Default: `"md"`.
- **className** — extra classes for the button.

## Notes

- Uses `navigator.clipboard.writeText`; clipboard failures are swallowed
  silently (no toast, no throw).
- After a successful copy the label flips to a green "Copied" check for
  ~1500ms, then reverts.
- The label crossfade is animated with framer-motion (`AnimatePresence`).
