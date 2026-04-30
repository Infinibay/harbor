# FAB

Floating Action Button — a circular, viewport-anchored trigger for the
single most important action on a screen (compose, create, upload). Prefer
`<Button>` for inline calls-to-action and `<SpeedDial>` when you need to
fan out multiple related actions from one spot.

## Import

```tsx
import { FAB } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<FAB
  icon={<PlusIcon />}
  label="New item"
  onClick={() => createItem()}
/>
```

## Props

- **icon** — `ReactNode`. Glyph rendered inside the circle. Required.
- **label** — `string`. Used as `aria-label`. Required.
- **onClick** — `() => void`.
- **position** — `"bottom-right" | "bottom-left" | "top-right" | "top-left" | "none"`.
  Anchors the button to a viewport corner; `"none"` keeps it inline.
  Default: `"bottom-right"`.
- **size** — `"md" | "lg"`. Default: `"md"`.
- **variant** — `"primary" | "secondary"`. `primary` is a fuchsia→sky
  gradient; `secondary` a bordered dark chip. Default: `"primary"`.
- **className** — extra classes for the button.

## Notes

- Reacts to cursor proximity via `useCursorProximity` (140px radius), with
  a small magnetic translate and tap-scale.
- Anchored variants render with `position: fixed` and `z-50`; pass
  `position="none"` when embedding inside another positioned container
  (e.g. `<SpeedDial>` does this internally).
- `<SpeedDial>` composes `<FAB>` as its trigger.
