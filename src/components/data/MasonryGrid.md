# MasonryGrid

`MasonryGrid` lays out children in vertical columns so cards with uneven heights can form a Pinterest-style gallery. Use it for inspiration boards, media cards, templates, changelog highlights, customer examples, screenshots, and content collections where equal-height rows would waste space.

This component uses a simple deterministic distribution: child `0` goes to column `0`, child `1` to column `1`, and so on. It does not measure card heights or run a packing algorithm. That makes it predictable and cheap, but it is not a perfect visual balancer for every dataset.

## Import

```tsx
import { MasonryGrid } from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
<MasonryGrid columns={3} gap={16}>
  {templates.map((template) => (
    <Card
      key={template.id}
      title={template.name}
      description={template.description}
    >
      <img src={template.previewUrl} alt="" />
    </Card>
  ))}
</MasonryGrid>
```

Use fewer columns in narrow layouts:

```tsx
<MasonryGrid className="max-md:hidden" columns={3} gap={12}>
  {cards}
</MasonryGrid>

<MasonryGrid className="md:hidden" columns={1} gap={12}>
  {cards}
</MasonryGrid>
```

## Props

- **columns** - optional number. Defaults to `3`. Determines how many vertical buckets are rendered.
- **gap** - optional number in pixels. Defaults to `12`. Applied between columns and between cards inside each column.
- **children** - required `ReactNode`. Every child is converted with `Children.toArray` before distribution.
- **className** - optional string merged onto the root flex container.

## Layout Model

`MasonryGrid` renders a flex row of columns. Each column is a vertical flex stack. Children are assigned by index modulo the column count, so item order is preserved within each column but not as a strict left-to-right reading order across the whole grid.

This is a good tradeoff for visual galleries and card collections. It is not the right primitive for ordered feeds, keyboard-heavy lists, or data that must be read row by row.

## Accessibility

Because visual order differs from source order, be careful with meaningful sequences. Screen readers and keyboard navigation follow DOM order, which is still the original child order as distributed into columns. For chronological or ranked content, prefer a normal list, `DataTable`, or `ResponsiveGrid`.

Images inside masonry cards still need useful `alt` text when they carry content.

## Gotchas

- The component does not auto-change column count by breakpoint. Use responsive rendering or parent logic.
- It does not measure card height, so one column can still become taller than the others.
- Avoid it for forms, tables, or workflows where source order matters.
- Passing `columns={0}` will produce an invalid layout; keep the value at `1` or higher.

## Related

- `ResponsiveGrid` for equal-row responsive card grids.
- `Card` for the repeated items inside the masonry layout.
- `ImageGallery` and `Carousel` for media-focused browsing.
- `DataTable` for ordered, sortable records.
