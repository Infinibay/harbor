# PropertyList

AWS / GCP-style "key: value" details pane. Two-column or card layout,
sticky section headers, copyable values, optional inline editing per
row. Pair with `<Card>` as the surrounding shell.

## Import

```tsx
import { PropertyList } from "@infinibay/harbor/display";
```

## Example

```tsx
<PropertyList
  items={[
    { key: "id", label: "ID", value: "vm_84a23bf1c0e8", copyable: true },
    { key: "region", label: "Region", value: "us-east-1" },
    { key: "type", label: "Type", value: "c6g.xlarge · 4 vCPU · 8 GB" },
    {
      key: "name",
      label: "Name",
      value: "frontend-1",
      editable: true,
      onChange: (next) => save(next),
      section: "Identity",
    },
  ]}
  variant="two-col"
/>
```

## Props

- **items** — `readonly PropertyItem[]`. Required.
- **variant** — `"two-col" | "cards"`. Default `"two-col"`.
  - `two-col` — `<dl>` with a 10rem label column.
  - `cards` — single column with each row in its own bordered card.
- **className** — extra classes on the wrapper.

## `PropertyItem`

- **key** — `string`. Required. React key.
- **label** — `ReactNode`. Required.
- **value** — `ReactNode`. Required. Strings get tabular-nums + mono.
- **editable** — `boolean`. Renders the value via `<InlineEdit>`. Only
  effective when `value` is a string and `onChange` is provided.
- **onChange** — `(next: string) => void`. Called with the new value
  on commit.
- **copyable** — `boolean`. Adds a "copy" button. String values only.
- **section** — `string`. Groups consecutive items under a sticky
  uppercase header.

## Notes

- Items with the same `section` are grouped in document order; items
  with no `section` form an unlabelled group.
- The copy button uses `navigator.clipboard` and falls back silently
  when unavailable.
