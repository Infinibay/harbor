# RailSidebar

Narrow icon-only navigation rail (think VS Code activity bar or Discord
server list). Use it as a fixed-width column for top-level navigation
sections; hover surfaces the label via Tooltip. Pair with `<Sidebar>`
for a two-column nav, or use it solo for icon-only apps. For a
collapsible text+icon sidebar, see `<CollapsibleSidebar>`.

## Import

```tsx
import { RailSidebar } from "@infinibay/harbor/navigation";
```

## Example

```tsx
const items = [
  { id: "files", label: "Files", icon: <FilesIcon /> },
  { id: "search", label: "Search", icon: <SearchIcon /> },
  { id: "git", label: "Git", icon: <GitIcon />, badge: <Badge tone="info">3</Badge> },
];

<RailSidebar items={items} value={tab} onChange={setTab} />
```

## Props

- **items** — `RailItem[]`. Required. Each item is
  `{ id, label, icon, badge? }`. `label` is shown as a tooltip on hover.
- **value** — `string`. Controlled selected id.
- **onChange** — `(id: string) => void`. Fires when an item is clicked.
- **header** — `ReactNode`. Slot rendered above the items (e.g. logo).
- **footer** — `ReactNode`. Slot rendered below (e.g. avatar, settings).
- **className** — extra classes on the `<aside>`.

## Notes

- Fixed width (`w-14`) and full height — wrap in a flex parent.
- Active item is marked with a fuchsia left-edge accent stripe.
- Badges are positioned at the top-right corner of the icon button.
