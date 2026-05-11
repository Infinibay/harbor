# ResponsiveGrid

`ResponsiveGrid` renders a CSS grid whose column count and gap can change across Tailwind viewport breakpoints. Use it for card grids, feature sections, metric groups, settings panels, docs examples, app skeletons, and responsive layouts where children should flow into predictable columns.

Unlike measurement-based layout primitives, `ResponsiveGrid` does not inspect its container. It relies on viewport media queries, which makes it stable inside drawers, accordions, tabs, animated panels, and other containers that can briefly report unreliable dimensions.

## Import

```tsx
import { ResponsiveGrid } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
  <MetricCard label="Requests" value="24.8k" />
  <MetricCard label="Errors" value="18" />
  <MetricCard label="Latency" value="84ms" />
</ResponsiveGrid>
```

Use a fixed column count when the parent already controls width:

```tsx
<ResponsiveGrid columns={2} gap={3}>
  {cards}
</ResponsiveGrid>
```

## Props

- **children** - required `ReactNode`.
- **columns** - optional number or responsive object. Defaults to `1`.
- **gap** - optional number or responsive object. Defaults to `4`.
- **className** - optional string merged onto the root grid.

Responsive objects can use `base`, `sm`, `md`, `lg`, `xl`, and `2xl` keys:

```tsx
<ResponsiveGrid
  columns={{ base: 1, sm: 2, lg: 4 }}
  gap={{ base: 3, lg: 5 }}
>
  {items}
</ResponsiveGrid>
```

## Layout Model

`columns` is clamped between `1` and `12` before the Tailwind class is generated. `gap` maps directly to Tailwind gap scale classes. The root always includes `grid w-full`.

Because classes are generated from known values, use column and gap values that Tailwind can include in the build. Dynamic values outside the supported class set may not produce CSS.

## Accessibility

`ResponsiveGrid` is layout only. It does not add list semantics, headings, or labels. If the children are a collection, consider wrapping them in a semantic list or making each card self-labelled with a heading.

Avoid changing visual order with CSS if the reading order matters. `ResponsiveGrid` preserves DOM order.

## Gotchas

- Breakpoints are viewport-based, not container-based.
- It does not equalize card heights.
- Use `MasonryGrid` when uneven-height visual packing matters.
- Avoid arbitrary `gap` values that Tailwind will not generate.

## Related

- `MasonryGrid` for uneven-height card galleries.
- `Bento` for more expressive dashboard grids.
- `Container` and `Page` for page width and padding.
- `Card`, `MetricCard`, and `FeatureCard` as common children.
