# LabelLane

`LabelLane` aligns a group of form labels to one shared column. It solves the common settings-panel problem where short labels and long labels make every input start at a different x-position.

Use it for account settings, admin forms, infrastructure configuration, and any form where labels vary in length but the controls should scan as one clean column.

## Import

```tsx
import { LabelLane, useLabelLane } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { FormField, LabelLane, NumberField, TextField } from "@infinibay/harbor/inputs";

export function BackupSettings() {
  return (
    <LabelLane labelMax="14rem" gapX={6} gapY={4}>
      <FormField label="Workspace name">
        <TextField />
      </FormField>
      <FormField label="Notification email">
        <TextField type="email" />
      </FormField>
      <FormField label="Backup retention period">
        <NumberField unit="days" />
      </FormField>
    </LabelLane>
  );
}
```

## How It Works

`LabelLane` provides context through `useLabelLane()`. Harbor `FormField` reads that context and switches its inline layout into a shared grid-column mode. The parent grid defines two columns:

```css
minmax(labelMin, labelMax) minmax(0, 1fr)
```

Below `md`, the layout collapses to stacked label-above-control rows.

## Props

- **children**: `ReactNode`. Usually `FormField` children.
- **labelMin**: `string`. Minimum label column width. Defaults to `"0"`.
- **labelMax**: `string`. Maximum label column width. Defaults to `"auto"`.
- **gapX**: `3 | 4 | 5 | 6 | 8 | 10 | 12`. Column gap at `md` and above. Defaults to `6`.
- **gapY**: `2 | 3 | 4 | 5 | 6`. Row gap. Defaults to `4`.
- **className**: custom class on the grid.

## Accessibility

`LabelLane` is layout only. Labels, descriptions, errors, and required state still come from `FormField` and the inputs inside it. Keep label text concise; alignment improves scanning but cannot rescue unclear labels.

## Gotchas

- Custom field wrappers must read `useLabelLane()` if they want to participate in the shared column behavior.
- `labelMax="auto"` can become very wide if one label is long. Cap it with a value like `"14rem"` for production settings pages.
- The horizontal layout starts at `md`, so verify both stacked and aligned layouts.

## Related

- [`FormField`](./FormField.md) for labels, descriptions, and errors.
- [`FieldRow`](./FieldRow.md) for side-by-side controls.
- [`ActionRow`](./ActionRow.md) for form footers.
