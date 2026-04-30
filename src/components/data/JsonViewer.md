# JsonViewer

Collapsible tree view of a JSON-shaped value with type-tinted
primitives. For comparing two JSON blobs use `<DiffViewer>` on
`JSON.stringify(value, null, 2)` of each side.

## Import

```tsx
import { JsonViewer } from "@infinibay/harbor/data";
```

## Example

```tsx
<JsonViewer
  data={{
    user: { id: 7, name: "Ada", admin: true },
    tags: ["alpha", "beta"],
    deletedAt: null,
  }}
  rootLabel="$"
  defaultExpanded={2}
/>
```

## Props

- **data** — `unknown`. Required. Any JSON-shaped value (object,
  array, string, number, boolean, null).
- **rootLabel** — `string`. Label rendered next to the root node.
  Default `"$"`.
- **defaultExpanded** — `number`. Depth automatically expanded on
  first render. Default `2`.
- **className** — extra classes on the root.

## Notes

- Type colors: strings green, numbers amber, booleans fuchsia,
  null rose, keys sky.
- Collapsed objects/arrays show their element count inline
  (`{ 3 keys }`, `[ 5 items ]`).
- Each collapsible node toggles independently — no global
  expand/collapse control.
- Renders the entire tree up front; not virtualized. For very large
  blobs (>10k nodes) consider trimming or paginating client-side.
