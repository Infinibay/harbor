# Sidebar

Standard left navigation column with sections, labels, icons, and
badges. Renders items as `<a>` so links are real (right-click, copy,
ctrl-click to new tab all work) while still firing `onSelect` for SPA
routing. Use this as the primary app nav; for icon-only rails see
`<RailSidebar>`, and for a collapsible variant see
`<CollapsibleSidebar>`.

## Import

```tsx
import { Sidebar } from "@infinibay/harbor/navigation";
```

## Example

```tsx
const sections = [
  {
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", href: "/", icon: <HomeIcon /> },
      { id: "projects", label: "Projects", href: "/projects",
        icon: <FolderIcon />, badge: <Badge tone="info">12</Badge> },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "settings", label: "Settings", href: "/settings",
        icon: <CogIcon /> },
    ],
  },
];

<Sidebar
  sections={sections}
  selected={current}
  onSelect={(id) => router.push(hrefFor(id))}
  header={<Logo />}
  footer={<UserMenu />}
  sticky
/>
```

## Props

- **sections** — `SidebarSection[]`. Required. Each section is
  `{ label?, items }`. Items are `{ id, label, icon?, badge?, href? }`.
- **selected** — `string`. Currently selected item id.
- **onSelect** — `(id: string) => void`. Fired on plain left-clicks;
  modifier-clicks (ctrl/cmd/shift/middle) are left to the browser so
  "open in new tab" still works.
- **header** — `ReactNode`. Top slot (logo, workspace switcher).
- **footer** — `ReactNode`. Bottom slot below a divider.
- **sticky** — `boolean`. Default `false`. When true the rail becomes
  `sticky top-0 h-screen`.
- **className** — extra classes on the `<aside>`.

## Notes

- Width is fixed at `w-60`. Place in a flex row alongside the page
  content.
- Active item gets an animated background pill via `framer-motion`
  `layoutId`, so changes glide between rows.
- When `onSelect` is provided, plain left-clicks call
  `preventDefault()` so SPA routers don't trigger a full-page nav on
  top of the route change.
