# ComparisonTable

Pricing / feature comparison grid — multiple plans across the columns,
groups + feature rows down. Booleans render as ✓ / —, anything else
as-is.

## Import

```tsx
import { ComparisonTable } from "@infinibay/harbor/display";
```

## Example

```tsx
<ComparisonTable
  plans={[
    { id: "free", name: "Free" },
    { id: "team", name: "Team", highlighted: true },
    { id: "ent",  name: "Enterprise" },
  ]}
  groups={[
    {
      label: "Core",
      rows: [
        { label: "Projects",       values: [3, "Unlimited", "Unlimited"] },
        { label: "Members",        values: [1, 10, "Unlimited"] },
        { label: "API access",     values: [false, true, true] },
        { label: "SSO",            values: [false, false, true], hint: "SAML / OIDC" },
      ],
    },
    {
      label: "Support",
      rows: [
        { label: "Community",      values: [true, true, true] },
        { label: "Priority queue", values: [false, true, true] },
        { label: "Dedicated CSM",  values: [false, false, true] },
      ],
    },
  ]}
/>
```

## ComparisonRow / ComparisonGroup

```ts
ComparisonRow {
  label: ReactNode;
  values: (boolean | string | ReactNode)[];   // length === plans.length
  hint?: string;                              // small subtitle line
}

ComparisonGroup { label: string; rows: ComparisonRow[] }
```

## Props

- **plans** — `{ id, name, highlighted? }[]`. Required. `highlighted`
  tints the column header in fuchsia and shades each cell faintly.
- **groups** — `ComparisonGroup[]`. Required.
- **className** — extra classes on the wrapper.

## Notes

- Cell rendering: `true` → ✓, `false` → —, `string`/`ReactNode` → printed.
- Each row's `values` array length should match `plans.length`; missing
  entries render as empty cells.
- The header is `position: sticky; top: 0` — works inside any scroll
  container without extra props.
