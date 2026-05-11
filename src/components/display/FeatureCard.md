# FeatureCard

`FeatureCard` presents a product capability with an optional icon, title, description, accent tone, and optional link. Use it for feature grids, onboarding choices, empty-state next steps, docs landing sections, release highlights, and product overview pages.

It is a content card, not a generic app container. Keep it focused on one capability or action path.

## Import

```tsx
import { FeatureCard } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<FeatureCard
  icon={<LayoutDashboardIcon />}
  title="Dashboard shells"
  description="Compose sidebar navigation, page headers, metrics, charts, and tables into operational web apps."
  href="/documentation/app-skeletons"
  linkLabel="View skeletons"
  accent="sky"
/>
```

Use it in a grid:

```tsx
<ResponsiveGrid columns={3}>
  <FeatureCard title="Forms" description="Validated settings flows." />
  <FeatureCard title="Charts" description="Operational metrics and trends." />
  <FeatureCard title="Overlays" description="Dialogs, drawers, menus, and popovers." />
</ResponsiveGrid>
```

## Props

- **icon** - optional `ReactNode` rendered in a tone-aware square.
- **title** - required `ReactNode`.
- **description** - required `ReactNode`.
- **href** - optional string. When provided, a link is rendered.
- **linkLabel** - optional string. Defaults to `"Learn more →"`.
- **accent** - optional `"fuchsia"`, `"sky"`, `"emerald"`, `"amber"`, or `"rose"`. Defaults to `"fuchsia"`.
- **className** - optional string merged onto the root card.

## Composition Guidance

Use the icon to identify the category quickly, then let the title and description carry the actual promise. Strong feature cards describe a workflow outcome: `"Build a settings form"` is clearer than `"Inputs"`.

When cards are repeated, keep descriptions similar in length so the grid scans cleanly. If one feature needs much more explanation, give it its own section.

## Accessibility

The link is a normal anchor when `href` is provided. Make `linkLabel` specific when multiple cards appear on the same page; repeated `"Learn more"` links are less useful for assistive technology.

Icons should be decorative or redundant with the title. Do not put the only meaningful label inside the icon.

## Gotchas

- `FeatureCard` does not make the whole card clickable; only the link is interactive.
- Avoid using too many accent colors in one grid.
- Do not use it for dense operational data. Use `Card`, `MetricCard`, or `DataTable`.
- External links need app-level handling if you want `target="_blank"`.

## Related

- `Card` for general app surfaces.
- `IconTile` for smaller icon-leading rows.
- `ResponsiveGrid` for arranging feature cards.
- `LinkPreviewCard` for linking to external content with metadata.
