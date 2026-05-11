# FluidGrid

`FluidGrid` computes the number of columns from available container width and a
minimum item width. It can animate children between cells when the column count
changes, making responsive dashboards and card grids feel intentional during
resize.

Use it for cards, tiles, shortcuts, gallery items, and dashboard widgets.

## Import

```tsx
import { FluidGrid } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<FluidGrid minItemWidth={240} maxColumns={4} gap={16}>
  {projects.map((project) => (
    <ProjectCard key={project.id} project={project} />
  ))}
</FluidGrid>
```

## Props

- **children** - `ReactNode`. Required grid items.
- **minItemWidth** - `number`. Minimum width before wrapping to another column.
  Default `220`.
- **maxColumns** - `number`. Maximum columns; `0` means unlimited. Default `0`.
- **gap** - `number`. Pixel gap between cells. Default `16`.
- **animate** - `boolean`. Enables FLIP position animation. Default `true`.
- **className** - extra classes on the grid.

## Behavior

The component measures its container width, computes `cols`, and sets
`grid-template-columns: repeat(cols, minmax(0, 1fr))`. Children are wrapped in
`div` elements with stable FLIP keys.

## Accessibility

Fluid layout does not change DOM order. Keep rendered order meaningful for
screen readers and keyboard users, even when visual columns change.

## Gotchas

- Stable child keys are important for clean animation.
- Every child is wrapped in a `div`.
- `minItemWidth` and `gap` are pixel values.
- Very large grids should use virtualization or pagination.

## Related

- `ResponsiveGrid` for breakpoint-driven grids.
- `ReflowList` for wrapping rows.
- `ContainerBox` for CSS container queries.
- `MasonryGrid` for variable-height cards.
