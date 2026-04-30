# Timestamp

Renders a date as either relative ("2m ago") or absolute, with a
hover tooltip showing the other form. Auto-ticks on an interval so
"last seen" lines stay accurate without the caller managing it.

## Import

```tsx
import { Timestamp } from "@infinibay/harbor/display";
```

## Example

```tsx
<Timestamp value={new Date(Date.now() - 90 * 60_000)} />
<Timestamp value={lastSeen} relative={false} />
<Timestamp value={null} />            {/* renders "—" */}
```

## Props

- **value** — `Date | string | number | null | undefined`. Required.
  Nullish values render as `"—"` and skip the tooltip.
- **relative** — `boolean`. Default `true`. When `false`, renders the
  absolute form as primary and relative in the tooltip.
- **refreshMs** — `number`. Re-render cadence in ms for live
  relative text. Default `15_000`. Set `0` to disable.
- **noTooltip** — `boolean`. Suppress the hover tooltip with the
  alternate form.
- **relativeOptions** / **absoluteOptions** — formatter options
  passed through to the shared `format` helpers (preset, locale,
  etc.).
- **className** — extra classes; plus all standard `HTMLSpanElement`
  attributes.

## Notes

- The tooltip uses `<Tooltip>` from `@infinibay/harbor/overlays`.
- When `refreshMs > 0`, the component re-renders on its own interval
  — keep many timestamps mounted off-screen at your own peril.
