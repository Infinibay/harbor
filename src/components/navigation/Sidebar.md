# Sidebar

`Sidebar` is Harbor's persistent vertical navigation for dashboards, admin
panels, SaaS apps, desktop workbenches, and documentation shells. It renders
sections, items, optional icons, badges, header and footer slots, and an animated
active indicator.

Use it for stable app areas. Use `FilterPanel` for faceted filters and
`RailSidebar` for compact icon-first navigation.

## Import

```tsx
import { Sidebar } from "@infinibay/harbor/navigation";
```

## Basic Usage

Use `selected` and `onSelect` for SPA navigation or local demos.

```tsx
<Sidebar
  selected={activeSection}
  onSelect={setActiveSection}
  header={<strong>Harbor Cloud</strong>}
  sections={[
    {
      items: [
        { id: "overview", label: "Overview" },
        { id: "deployments", label: "Deployments" },
        { id: "usage", label: "Usage", badge: "3" },
      ],
    },
  ]}
/>
```

## Links And Routers

Items may include `href`. When `onSelect` is provided, normal left-click
navigation is intercepted so client routing can handle the transition. Modifier
clicks still behave like regular links.

```tsx
<Sidebar
  selected="settings"
  onSelect={(id) => navigate(`/app/${id}`)}
  sections={[{ items: [{ id: "settings", label: "Settings", href: "/app/settings" }] }]}
/>
```

## Slots

Use `header` for workspace identity and `footer` for account state, environment,
sync status, or license information.

```tsx
<Sidebar header={<WorkspaceSwitcher />} footer={<AccountMenu />} sections={sections} />
```

## Props

- `sections`: required navigation sections.
- `selected`: active item id.
- `onSelect`: item selection callback.
- `header`: top slot.
- `footer`: bottom slot.
- `sticky`: makes the sidebar viewport-sticky.
- `className`: wrapper class override.

Items include `id`, `label`, optional `icon`, optional `badge`, and optional
`href`.

## Accessibility

The active item exposes `aria-current="page"`. Use meaningful labels and keep
icons decorative unless they add information not present in text.

For mobile layouts, pair the sidebar with a drawer or responsive navigation
pattern so it does not squeeze the main content.

## Gotchas

`selected` is controlled by the parent. If it does not match an item id, no
active indicator appears.

The sidebar is navigation, not a settings form. Put filters in `FilterPanel` and
record actions in menus or toolbars.

## Related

- `CollapsibleSidebar` for hideable side navigation.
- `RailSidebar` for compact icon rails.
- `AppShell` for full app layout composition.
- `FilterPanel` for filters rather than sections.
