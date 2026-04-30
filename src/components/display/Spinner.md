# Spinner

A small, currentColor-tinted ring spinner for inline loading states.
The companion `<Dots>` is a three-dot bounce variant — use it for
prose-y "thinking…" placeholders where a ring feels too mechanical.

## Import

```tsx
import { Spinner, Dots } from "@infinibay/harbor/display";
```

## Example

```tsx
<Spinner size={24} />
<Dots className="text-white/60" />
```

## Props (`<Spinner>`)

- **size** — `number`. Width/height in pixels. Default `18`.
- **className** — extra classes on the wrapper.

## Props (`<Dots>`)

- **className** — extra classes on the wrapper.

## Notes

- Both inherit color from `currentColor` — set `text-*` on a parent
  to retint.
- `<Dots>` injects its keyframes inline, so it's safe to use in
  isolation without registering animations globally.
