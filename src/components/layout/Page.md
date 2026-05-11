# Page

`Page` is the default route-level layout for a Harbor screen. It combines a
centered `Container` with a vertical `ResponsiveStack`, so product pages get a
consistent width, top/bottom rhythm, and section spacing without rebuilding that
chrome in every route.

Use it inside app shells, dashboards, settings pages, documentation pages, and
admin flows where the route content should read as a sequence of sections. Reach
for `Container` directly when the page needs a custom grid, split pane, or canvas
layout instead of a single vertical flow.

## Import

```tsx
import { Page, PageHeader, ResponsiveGrid } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
export function DashboardPage() {
  return (
    <Page size="xl" gap="lg">
      <PageHeader
        title="Production"
        description="Health, deploys, and current incidents."
      />

      <ResponsiveGrid columns={3} gap={3}>
        <MetricCard label="Requests" value="24.8k" delta={12} />
        <MetricCard label="Errors" value="18" delta={-8} />
        <MetricCard label="Latency" value="84" unit="ms" delta={4} />
      </ResponsiveGrid>

      <ActivityFeed items={events} />
    </Page>
  );
}
```

The important detail is that each direct child becomes a page section. `Page`
does not create headings, cards, or navigation for you; it gives those blocks a
stable frame.

## Props

- **children** - `ReactNode`. Required. Direct children are stacked in order.
- **size** - `"sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "full"`. Forwarded
  to `Container`. Default `"xl"`.
- **gap** - `"none" | "sm" | "md" | "lg" | "xl"`. Vertical gap between direct
  children. Default `"lg"`.
- **padded** - `boolean`. Forwarded to `Container`; set it to `false` when an
  outer shell already provides horizontal padding. Default `true`.
- **className** - extra classes on the outer `Container`.

## Layout Model

`Page` renders:

```tsx
<Container size={size} padded={padded} className="py-6 md:py-8">
  <ResponsiveStack direction="col" gap={mappedGap}>
    {children}
  </ResponsiveStack>
</Container>
```

That means it is intentionally boring. It is not an app shell, not a sidebar,
and not a card. Pair it with `AppShell` when the route has persistent navigation,
with `PageHeader` for route titles and actions, and with `ResponsiveGrid` when a
section needs columns.

## Accessibility

`Page` does not inject landmarks. Put the route inside a semantic `<main>` when
the surrounding application shell does not already provide one. Keep headings in
document order: a `PageHeader` title should usually be the route-level `h1`, and
sections below it should use lower-level headings.

Spacing is visual only, so it does not affect keyboard navigation or screen
reader order. Interactive children keep their own focus behavior.

## Gotchas

- `size="full"` removes the width constraint but still keeps the vertical stack.
  For editor canvases, data workbenches, or desktop-style panes, use `AppShell`,
  `SplitPane`, or dedicated layout components instead.
- `padded={false}` only removes horizontal container padding. The built-in
  `py-6 md:py-8` remains unless you override it with `className`.
- `gap="none"` is useful for grouped components, but most route pages need at
  least `md` or `lg` to avoid collapsing into one dense block.

## Related

- `Container` for width and horizontal padding without the vertical stack.
- `ResponsiveStack` for custom stacking outside a full page.
- `PageHeader` for route titles, descriptions, breadcrumbs, and actions.
- `AppShell` for persistent sidebars and application chrome.
