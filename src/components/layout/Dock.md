# Dock

macOS-style icon strip with cursor-proximity magnification. Use for app
launchers, persistent action bars, or any short list of icon
destinations where hover discoverability matters. Pair with `<Badge>` on
items via the `badge` slot.

## Import

```tsx
import { Dock } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Dock
  size={48}
  items={[
    { id: "home",   label: "Home",   icon: <HomeIcon />,   active: true },
    { id: "search", label: "Search", icon: <SearchIcon /> },
    { id: "alerts", label: "Alerts", icon: <BellIcon />,
      badge: <Badge tone="danger">3</Badge> },
  ]}
/>
```

## Props

- **items** — `DockItem[]`. Required. Each item:
  - **id** — `string`. Unique key.
  - **label** — `string`. Used for `aria-label` and tooltip.
  - **icon** — `ReactNode`. Required.
  - **active** — `boolean`. Renders accent ring + indicator dot.
  - **badge** — `ReactNode`. Top-right slot.
  - **onClick** — `() => void`.
- **size** — `number`. Base icon size in px. Default `44`.
- **className** — extra classes on the wrapper.

## Notes

- Magnification reads cursor proximity (120px radius) — items grow up to
  1.65× and lift 8px upward.
- Wrapper uses the shared `glass` style; place it on a contrasting
  background.
- The active dot uses `layoutId` for cross-item flight when `active`
  switches.
