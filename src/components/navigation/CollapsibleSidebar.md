# CollapsibleSidebar

Vertical sidebar with a built-in expand/collapse toggle. Width
animates between 56px (icons + tooltips) and 240px (icons + labels +
badges). Use when the user benefits from reclaiming horizontal
space; pick `<Sidebar>` for a fixed-width version or `<RailSidebar>`
for an icons-only rail.

## Import

```tsx
import { CollapsibleSidebar } from "@infinibay/harbor/navigation";
```

## Example

```tsx
const [value, setValue] = useState("projects");

<CollapsibleSidebar
  value={value}
  onChange={setValue}
  defaultCollapsed={false}
  sections={[
    {
      label: "Workspace",
      items: [
        { id: "overview", label: "Overview", icon: <DiamondIcon /> },
        { id: "projects", label: "Projects", icon: <GridIcon /> },
        { id: "activity", label: "Activity", icon: <ListIcon /> },
      ],
    },
    {
      label: "Settings",
      items: [
        { id: "billing", label: "Billing", icon: <DollarIcon /> },
        { id: "team", label: "Team", icon: <UsersIcon /> },
      ],
    },
  ]}
/>
```

## Props

- **sections** — `CollapsibleSidebarSection[]`. Required. Each
  section is `{ label?: string; items: CollapsibleSidebarItem[] }`.
- **value** — `string`. The active item's `id` (controlled).
- **onChange** — `(id: string) => void`. Fired when an item is
  clicked.
- **defaultCollapsed** — `boolean`. Default `false`. Initial
  collapsed state. Toggle is internal; not controllable from the
  outside.
- **header** — `ReactNode`. Rendered at the top, hidden when
  collapsed.
- **footer** — `ReactNode`. Rendered at the bottom, centered when
  collapsed.
- **className** — extra classes on the `<aside>`.

### `CollapsibleSidebarItem`

- **id** — `string`. Required.
- **label** — `string`. Required.
- **icon** — `ReactNode`. Required (always visible).
- **badge** — `ReactNode`. Optional, hidden when collapsed.

## Notes

- The collapse state is internal — there is no controlled `collapsed`
  prop. Use `defaultCollapsed` to set the initial value.
- Collapsed items render with a `<Tooltip side="right">` showing the
  label.
- Active items get a `bg-fuchsia-500/15` fill plus a 3px accent bar
  on the left edge (only when expanded).
