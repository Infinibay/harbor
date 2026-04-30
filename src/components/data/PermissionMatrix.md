# PermissionMatrix

Tri-state grid of principals (rows) × resources (columns). Click a
cell to cycle `inherit → allow → deny → inherit`. Click a header to
bulk-toggle the whole row or column.

## Import

```tsx
import { PermissionMatrix, type PermissionCell } from "@infinibay/harbor/data";
```

## Example

```tsx
const principals = [
  { id: "u1", label: "Ada", kind: "admin", avatar: "AD" },
  { id: "u2", label: "Lin", kind: "user" },
];
const resources = [
  { id: "vm.create", label: "create", group: "vm" },
  { id: "vm.delete", label: "delete", group: "vm" },
  { id: "billing.view", label: "view", group: "billing" },
];
const [value, setValue] = useState<Record<string, PermissionCell>>({
  "u1:vm.create": "allow",
  "u1:vm.delete": "deny",
});

<PermissionMatrix
  principals={principals}
  resources={resources}
  value={value}
  onChange={(p, r, next) =>
    setValue((cur) => ({ ...cur, [`${p}:${r}`]: next }))
  }
  onBulkChange={(changes) =>
    setValue((cur) => {
      const next = { ...cur };
      for (const c of changes) next[`${c.principalId}:${c.resourceId}`] = c.value;
      return next;
    })
  }
/>
```

## Props

- **principals** — `readonly PermissionPrincipal[]`. Required.
  `{ id, label, kind?, avatar? }`. `avatar` is text (initials);
  defaults to `label.slice(0, 2)`.
- **resources** — `readonly PermissionResource[]`. Required.
  `{ id, label, group? }`. Resources sharing a `group` get a merged
  group header above their column headers.
- **value** — `Record<string, PermissionCell>`. Keys are
  `` `${principalId}:${resourceId}` ``. Missing keys default to
  `"inherit"`. `PermissionCell = "allow" | "deny" | "inherit"`.
- **onChange** — `(principalId, resourceId, next: PermissionCell) => void`.
  Required. Fires on cell click.
- **onBulkChange** — `(changes: { principalId, resourceId, value }[]) => void`.
  Fires when a row or column header is clicked. Apply all changes
  atomically.
- **density** — `"compact" | "expanded"`. Compact = 22px rows,
  expanded = 32px. Default `"expanded"`.
- **className** — extra classes on the root.

## Notes

- Bulk toggle cycles the whole row/column: all-allow → all-deny →
  all-inherit → all-allow. Missing cells count as `inherit`.
- Row and column headers stick when the matrix overflows in either
  axis.
- Cells use color + symbol (`✓ / ✗ / ·`) so the state is legible
  without color alone.
