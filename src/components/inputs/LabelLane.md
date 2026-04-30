# LabelLane

Two-column form layout where every nested `FormField` shares the same
auto-sized label column — every control starts at the same X without
the caller having to guess a fixed label width. Below `md` the layout
collapses to stacked label-above-control. Reach for this when you have
a form whose labels vary in length (e.g. "Name" alongside "Backup
retention period") and you want them to align cleanly.

## Import

```tsx
import { LabelLane, useLabelLane } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<LabelLane labelMax="14rem" gapX={6} gapY={4}>
  <FormField label="Name">
    <TextField />
  </FormField>
  <FormField label="Email address">
    <TextField type="email" />
  </FormField>
  <FormField label="Backup retention">
    <NumberField unit="days" />
  </FormField>
</LabelLane>
```

## Props

- **children** — `ReactNode`. The form fields.
- **labelMin** — `string`. Minimum label column width (any CSS
  length). Default `"0"` so short labels can collapse.
- **labelMax** — `string`. Maximum label column width. Default
  `"auto"` — sizes to the widest label. Pass e.g. `"14rem"` to cap.
- **gapX** — `3 | 4 | 5 | 6 | 8 | 10 | 12`. Tailwind spacing units
  between columns. Default `6` (24px). Only applied at `md` and above.
- **gapY** — `2 | 3 | 4 | 5 | 6`. Spacing between rows. Default `4`.
- **className** — extra classes on the grid.

## Notes

- The lane exposes a context via `useLabelLane()`; `FormField` reads
  it to switch its inline layout into `col-subgrid` mode. Custom
  fields can opt into the same alignment by reading the context.
- Works with any input: `FormField` passes its children through
  unchanged.
