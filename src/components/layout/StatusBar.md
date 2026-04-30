# StatusBar

Thin monospace strip for ambient state — branch, sync state, line/col,
queue depth. Compose with `<StatusItem>` and `<StatusSeparator>`. Use at
the bottom of editors, canvases, or app shells. For page-level alerts
use `<Banner>` instead.

## Import

```tsx
import { StatusBar, StatusItem, StatusSeparator } from "@infinibay/harbor/layout";
```

## Example

```tsx
<StatusBar>
  <StatusItem tone="success" icon={<DotIcon />}>main</StatusItem>
  <StatusSeparator />
  <StatusItem onClick={openLog}>3 changes</StatusItem>
  <StatusSeparator />
  <StatusItem tone="warning">Ln 42, Col 18</StatusItem>
</StatusBar>
```

## Props (`<StatusBar>`)

- **children** — `ReactNode`. Required.
- **className** — extra classes on the wrapper.

## Props (`<StatusItem>`)

- **children** — `ReactNode`. Required label.
- **icon** — `ReactNode`. Optional leading icon.
- **tone** — `"success" | "warning" | "danger" | "info"`. Tints the text.
- **onClick** — `() => void`. When provided, the item becomes a button
  with hover background; otherwise it renders as a static label.
- **className** — extra classes.

## Notes

- The bar sets `role="status"` so assistive tech announces updates.
- `<StatusItem>` always renders a `<button>` — without `onClick` it's
  `disabled` so it doesn't appear interactive.
- Default text size is `11px` monospace — keep glyphs short.
