# NavBar

`NavBar` renders a sticky glass top navigation bar with brand, items, active indicator, and an optional right-side slot. Use it for product portals, docs apps, dashboards with top-level sections, account areas, and compact web apps.

It supports controlled and uncontrolled active state. Navigation can be handled by `href`, `onChange`, or both.

## Import

```tsx
import { NavBar, type NavItem } from "@infinibay/harbor/navigation";
```

## Basic Usage

```tsx
import { useState } from "react";
import { NavBar, type NavItem } from "@infinibay/harbor/navigation";

const items: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "billing", label: "Billing", href: "/billing" },
];

export function PortalNav() {
  const [active, setActive] = useState("projects");

  return (
    <NavBar
      brand="Harbor"
      items={items}
      value={active}
      onChange={setActive}
      right={<button>Account</button>}
    />
  );
}
```

## Props

- **items** - `NavItem[]`. Required navigation entries.
- **brand** - `ReactNode`. Optional brand area on the left.
- **right** - `ReactNode`. Optional right-side controls.
- **value** - `string`. Controlled active item id.
- **onChange** - `(id: string) => void`. Called when an item is clicked.
- **className** - extra classes on the header.

## Item Model

```ts
type NavItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
};
```

If an item has no `href`, click prevents default navigation and only updates state. If `href` is present, normal anchor navigation can proceed while `onChange` still fires.

## Behavior

The active item receives a shared `framer-motion` layout indicator. In uncontrolled mode, the first item starts active. The bar is sticky at the top and uses Harbor's `Z.STICKY` z-index.

## Accessibility

Items are anchors, which is appropriate for page navigation. When using `NavBar` as tab-like in-page navigation without `href`, consider adding `aria-current`, `aria-selected`, or converting to a proper tab pattern in the surrounding app.

## Gotchas

- The component does not integrate with React Router automatically.
- Uncontrolled state starts at `items[0]?.id`.
- Long labels can crowd the right slot.
- Sticky positioning depends on parent overflow.

## Related

- `Tabs` for in-page tab panels.
- `RailSidebar` for icon-only app navigation.
- `AppHeader` for app chrome headers.
