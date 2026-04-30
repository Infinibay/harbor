# NavBar

Sticky top bar with a brand slot, a row of tab-like links with an
animated active pill, and a right-aligned slot for actions. Use for
primary app navigation. Pick `<AppHeader>` when you don't need
tabbed nav, or `<Tabs>` for in-page section switching.

## Import

```tsx
import { NavBar } from "@infinibay/harbor/navigation";
```

## Example

```tsx
<NavBar
  brand={<span className="font-semibold">Harbor</span>}
  value="projects"
  onChange={(id) => navigate(`/${id}`)}
  items={[
    { id: "dashboard", label: "Dashboard" },
    { id: "projects", label: "Projects" },
    { id: "activity", label: "Activity" },
    { id: "settings", label: "Settings" },
  ]}
  right={<UserMenu />}
/>
```

## Props

- **items** — `NavItem[]`. Required. Each is
  `{ id: string; label: ReactNode; icon?: ReactNode; href?: string }`.
- **brand** — `ReactNode`. Optional left-most slot.
- **right** — `ReactNode`. Optional trailing slot (actions, user).
- **value** — `string`. Active item id (controlled). Falls back to
  internal state initialised to the first item.
- **onChange** — `(id: string) => void`.
- **className** — extra classes on the `<header>`.

## Notes

- The active pill uses a shared `layoutId` so it animates between
  tabs with framer-motion's spring.
- Clicking an item without `href` calls `preventDefault` — useful
  when you wire navigation through `onChange` instead of links.
- The bar is sticky by default with `z-index: Z.STICKY` and applies
  the `glass` utility class for the backdrop.
