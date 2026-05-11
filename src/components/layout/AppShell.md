# AppShell

`AppShell` is the outer frame for authenticated product routes. It arranges persistent
regions - sidebar, header, main content, optional aside, and footer - into a full-height
application surface.

Use it when users live inside the product and move between stable sections: dashboards,
admin panels, project workspaces, support tools, and internal consoles. It should usually sit
just inside `HarborProvider` and route-level auth guards. Put page-specific layout inside the
main region with `Page`, `PageHeader`, `Section`, or feature components.

## Import

```tsx
import { AppShell } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<AppShell
  sidebar={<Sidebar />}
  header={<TopBar />}
  contentPadding="lg"
  gutter="md"
>
  <Page>{/* ... */}</Page>
</AppShell>
```

## Layout Model

The outer wrapper is a flex row. `sidebar` renders before the main panel and `aside` renders
after it. The main panel owns `header`, padded content, and `footer`. This keeps persistent
chrome outside route content while the center region changes.

When `gutter="none"`, the shell uses document scrolling with `min-h-screen`. When a gutter is
enabled, the shell switches to `h-screen`, adds outer padding and gaps, wraps the main panel
in an elevated rounded surface, and makes the content area scroll internally.

## Props

- **sidebar** - `ReactNode`. Rendered to the left of the main panel.
- **aside** - `ReactNode`. Rendered to the right of the main panel.
- **header** - `ReactNode`. Rendered above the content area.
- **footer** - `ReactNode`. Rendered below the content area.
- **children** - `ReactNode`. Main route or workspace content.
- **contentPadding** - `"none" | "sm" | "md" | "lg"`. Horizontal/vertical
  padding around the main content. Default `"lg"`.
- **gutter** - `"none" | "sm" | "md" | "lg"`. When non-`"none"`,
  surrounds sidebar and main with an outer gutter so they appear as
  floating islands; the main panel gets a matching rounded card surface.
  Default `"none"` preserves edge-to-edge behavior.
- **className** / **style** - passed through to the outer wrapper.

## Accessibility

`AppShell` renders the central region as `<main>`, so do not nest another `main` inside the
children. Give persistent navigation a clear label in the `Sidebar` or nav component you pass
in. If the header contains global search or account actions, keep the focus order predictable:
sidebar, header, content, aside is the visual and DOM order.

For internally scrolling shells, make sure skip links or route focus management send users to
the content region after navigation.

## Gotchas

- `AppShell` does not create navigation state. The `Sidebar` or route layer owns the active
  item.
- With `gutter !== "none"`, the content scrolls internally; fixed elements inside children
  behave relative to the viewport, not the scroll container.
- Avoid placing large page max-width wrappers on the shell itself. Put them inside `Page`.
- The shell does not collapse sidebars responsively by itself. Use `Show`, `Hide`, `Drawer`,
  or a route-level responsive pattern for mobile.

## Related

- `Sidebar`, `AppHeader`, `Page`, and `PageHeader` for app chrome.
- `WindowFrame` for framed desktop-style demos.
- `SplitPane` for resizable workspaces inside the shell.
- `StatusBar` for persistent bottom state.
