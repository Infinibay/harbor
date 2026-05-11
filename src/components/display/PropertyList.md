# PropertyList

`PropertyList` renders key/value details in the style of cloud consoles and admin detail panes. It supports a two-column definition-list layout, a card layout, section headers, copyable string values, and inline editing for string values.

Use it for resource metadata, billing details, deployment facts, audit records, account settings, and read-heavy admin panels.

## Import

```tsx
import { PropertyList, type PropertyItem } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { PropertyList } from "@infinibay/harbor/display";

export function HostProperties({ host, renameHost }) {
  return (
    <PropertyList
      items={[
        { key: "id", label: "ID", value: host.id, copyable: true, section: "Identity" },
        {
          key: "name",
          label: "Name",
          value: host.name,
          editable: true,
          onChange: renameHost,
          section: "Identity",
        },
        { key: "region", label: "Region", value: "us-east-1", section: "Placement" },
        { key: "type", label: "Type", value: "c6g.xlarge · 4 vCPU · 8 GB", section: "Placement" },
      ]}
    />
  );
}
```

## Card Variant

```tsx
<PropertyList
  variant="cards"
  items={[
    { key: "plan", label: "Plan", value: "Team" },
    { key: "renewal", label: "Renewal", value: "June 12, 2026" },
  ]}
/>
```

## Props

- **items**: `readonly PropertyItem[]`. Required rows.
- **variant**: `"two-col" | "cards"`. Defaults to `"two-col"`.
- **className**: custom class on the wrapper.

`PropertyItem` is `{ key, label, value, editable?, onChange?, copyable?, section? }`.

## Editing And Copying

`editable` uses `InlineEdit`, but only when `value` is a string and `onChange` exists. `copyable` uses `navigator.clipboard` and only renders for string values.

Rows are grouped by their `section` value. Empty section values render as an unlabelled group.

## Accessibility

The two-column variant uses a semantic `dl` with `dt` and `dd`. Copy controls are real buttons with labels. Keep editable values short and obvious; if editing needs validation, confirmations, or multiline input, use a form or drawer instead.

## Gotchas

- Section grouping is by section name, not by consecutive array runs. Items with the same section are collected together.
- Non-string values cannot be copied or inline-edited by this component.
- Copy failure is swallowed silently because clipboard availability varies by browser and security context.
- Sticky section headers assume the surrounding surface background matches `bg-surface-2`.

## Related

- [`InlineEdit`](../inputs/InlineEdit.md) for the editable value behavior.
- [`Card`](./Card.md) for a surrounding details surface.
- [`KeyValueEditor`](../inputs/KeyValueEditor.md) for editable key/value collections.
