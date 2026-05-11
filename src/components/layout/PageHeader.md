# PageHeader

Header primitive for application pages: dashboards, admin screens, settings pages, detail views, editor workspaces, and documentation articles.

## Import

```tsx
import { Page, PageHeader } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Page size="xl">
  <PageHeader
    eyebrow="Production"
    title="Deployments"
    description="Monitor releases, incidents, and rollout health."
    actions={<Button>New deployment</Button>}
    meta={<Badge tone="success">Healthy</Badge>}
  />
  <DeploymentTable />
</Page>
```

## Props

- **title** - required page title.
- **eyebrow** - short uppercase context above the title.
- **description** - supporting text that explains what the page controls or shows.
- **actions** - primary and secondary actions for the page.
- **meta** - compact status, breadcrumbs, owner, timestamp, or tags.
- **align** - `"start" | "center"`. Use `"center"` for documentation or empty states, not dense admin screens.
- **className** - extra classes on the header.

## Composition Notes

Put page-level actions in `actions`, not inside random cards below the fold. Users should understand what the page is for and what they can do before scanning the rest of the content.

Use `meta` for state that changes how the user reads the page: environment, health, ownership, sync state, or selected project.

## Accessibility

`PageHeader` renders the title as an `h1`. Use one `PageHeader` per route or primary workspace panel so assistive technology gets a stable page landmark.

## Gotchas

Avoid long action groups. If a page has more than two or three actions, move secondary commands into `Menu`, `CommandPalette`, or a row-specific toolbar.

## Related Components

`Page`, `AppShell`, `ResponsiveGrid`, `Badge`, `Button`, `Menu`, `CommandPalette`.
