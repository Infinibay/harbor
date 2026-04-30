# LoadingOverlay

Centered spinner with an optional label and determinate progress bar. Drop
in as the sole child of a region during a long operation so the underlying
content doesn't re-render mid-flight.

## Import

```tsx
import { LoadingOverlay } from "@infinibay/harbor/feedback";
```

## Example

```tsx
<LoadingOverlay
  fill
  label="Applying profile…"
  progress={{ done: 3, total: 12 }}
/>
```

## Props

- **label** — `ReactNode`. Caption under the spinner.
- **progress** — `{ done: number; total: number }`. Renders `done / total` and a proportional bar. Clamped to 0–100%.
- **fill** — stretch to fill the parent (`min-h-[200px] w-full`). Default: `false`.
- **size** — `number`. Spinner pixel size. Default: `24`.
- **className** — extra classes on the root.

## Notes

- The root has `role="status"` and `aria-live="polite"` — screen readers
  announce label changes without interrupting.
- Progress bar uses a fuchsia → sky gradient (`#a855f7 → #38bdf8`) regardless
  of theme.
