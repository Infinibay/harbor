# Dock

`Dock` renders a compact icon dock with cursor-proximity magnification. It is
suited for desktop-style apps, launchers, canvas tools, and playful navigation
where icons are recognizable and space is constrained.

Use it for app-level destinations or primary tool groups. For dense enterprise
navigation, prefer `Sidebar` or `NavBar`.

## Import

```tsx
import { Dock } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Dock
  items={[
    { id: "home", label: "Home", icon: <HomeIcon />, active: true },
    { id: "search", label: "Search", icon: <SearchIcon />, onClick: openSearch },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  ]}
/>;
```

## Props

- **items** - `DockItem[]`. Required dock entries.
- **size** - `number`. Base icon button size in pixels. Default `44`.
- **className** - extra classes on the dock wrapper.

## DockItem

- **id** - `string`. Stable item id.
- **label** - `string`. Accessible label and browser title.
- **icon** - `ReactNode`. Visible icon.
- **active** - `boolean`. Shows the active ring and indicator dot.
- **badge** - `ReactNode`. Optional top-right badge.
- **onClick** - `() => void`. Optional click handler.

## Behavior

Each icon scales and lifts based on cursor proximity. Active items render a small
indicator below the icon. The component does not manage routing or active state.

## Accessibility

Each item is a button with `aria-label` and `title` from `label`. Icons should
still be understandable, and critical navigation should not depend on hover
magnification.

## Gotchas

- Dock magnification is pointer-focused; it is less useful on touch devices.
- Large badges can overlap neighboring icons.
- Keep item count small. A dock with too many icons becomes hard to scan.

## Related

- `Sidebar` for labeled navigation.
- `NavBar` for top navigation.
- `FAB` for one primary floating action.
- `Tooltip` for icon clarification.
