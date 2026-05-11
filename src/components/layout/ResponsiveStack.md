# ResponsiveStack

`ResponsiveStack` is a flex layout primitive whose direction and gap can change
per breakpoint. It is used throughout Harbor to keep sections, forms, cards, and
tool surfaces readable from mobile to desktop without rewriting the same flex
classes in every component.

Use it when the same children should stack vertically on small screens and align
horizontally on wider screens.

## Import

```tsx
import { ResponsiveStack } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<ResponsiveStack
  direction={{ base: "col", md: "row" }}
  gap={{ base: 3, md: 5 }}
  align="stretch"
>
  <Card title="Plan" />
  <Card title="Usage" />
  <Card title="Billing" />
</ResponsiveStack>
```

For a fixed row:

```tsx
<ResponsiveStack direction="row" gap={2} align="center">
  <Button>Save</Button>
  <Button variant="secondary">Cancel</Button>
</ResponsiveStack>
```

## Props

- **children** - `ReactNode`. Required.
- **direction** - direction value or responsive map. Supports `"row"`, `"col"`,
  `"row-reverse"`, and `"col-reverse"`. Default `"col"`.
- **gap** - Tailwind spacing number or responsive map. Default `3`.
- **align** - `"start" | "center" | "end" | "stretch"`.
- **justify** - `"start" | "center" | "end" | "between" | "around"`.
- **wrap** - `boolean`. Enables `flex-wrap`.
- **className** - extra classes on the root.
- **style** - inline styles on the root.

## Responsive Props

`direction` and `gap` can be a single value or a map with `base`, `sm`, `md`,
`lg`, `xl`, and `2xl` keys:

```tsx
direction={{ base: "col", lg: "row" }}
gap={{ base: 2, lg: 6 }}
```

Harbor generates Tailwind breakpoint classes from those values.

## Accessibility

`ResponsiveStack` only changes visual layout. It does not alter DOM order, so
screen readers and keyboard navigation follow the order of children you render.
Keep that order logical even when using reverse directions.

Avoid using visual reversal to communicate a different reading order.

## Gotchas

- `gap` must correspond to Tailwind spacing classes that exist in the build.
  Arbitrary runtime numbers cannot generate new CSS classes.
- `wrap` can change row layout but does not animate movement by itself. Use
  `ReflowList` when animated wrapping matters.
- `row-reverse` and `col-reverse` affect visual order only.

## Related

- `Page` for route-level vertical rhythm.
- `ResponsiveGrid` for column grids.
- `ReflowList` for animated wrapping rows.
- `Container` for width constraints.
