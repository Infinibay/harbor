# CollapsibleSidebar

`CollapsibleSidebar` is a persistent app sidebar that can shrink to an icon rail.
It is useful for SaaS dashboards, desktop workbenches, admin consoles, editors,
and operational tools where navigation must stay available without permanently
consuming horizontal space.

Use it when labels are helpful but users also need more workspace. Use `Sidebar`
when the navigation should always stay expanded.

## Import

```tsx
import { CollapsibleSidebar } from "@infinibay/harbor/navigation";
```

## Basic Usage

Control the active item with `value` and `onChange`.

```tsx
<CollapsibleSidebar
  value={section}
  onChange={setSection}
  header={<strong>Harbor Studio</strong>}
  sections={[
    {
      label: "Workspace",
      items: [
        { id: "files", label: "Files", icon: <FilesIcon /> },
        { id: "search", label: "Search", icon: <SearchIcon /> },
      ],
    },
  ]}
/>
```

## Collapsed Mode

Use `defaultCollapsed` for dense desktop apps. Labels are hidden, icons remain,
and tooltips preserve discoverability.

```tsx
<CollapsibleSidebar defaultCollapsed sections={sections} footer={<SyncState />} />
```

## Props

- `sections`: required sidebar sections.
- `value`: active item id.
- `onChange`: selection callback.
- `defaultCollapsed`: initial collapsed state.
- `header`: expanded header slot.
- `footer`: bottom slot.
- `className`: wrapper class override.

Items include `id`, `label`, required `icon`, and optional `badge`.

## Accessibility

The collapse toggle exposes expanded state. Active items use `aria-current`.
Collapsed items keep labels through tooltips, but icons should still be familiar
and repeated across the app.

## Gotchas

Collapsed mode hides section labels. Do not rely on section names to distinguish
similar icons.

The component stores collapsed state internally. If your app needs global
persistence, wrap it and store that preference in parent state.

## Related

- `Sidebar` for always-expanded navigation.
- `RailSidebar` for icon-first navigation.
- `AppShell` for composing sidebars with headers and content.
- `Tooltip` for collapsed labels.
