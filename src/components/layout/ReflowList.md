# ReflowList

`ReflowList` arranges children in a horizontal flex row and animates their
position when they wrap between rows. It is useful for chip rows, compact
toolbars, avatar groups, filter pills, secondary navigation, and responsive
action groups where items should move smoothly instead of snapping as space
changes.

The component uses a manual FLIP animation triggered by container width changes,
so it keeps normal flexbox behavior while making reflow easier to follow.

## Import

```tsx
import { ReflowList } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<ReflowList gap={8}>
  {filters.map((filter) => (
    <Badge key={filter.id}>{filter.label}</Badge>
  ))}
</ReflowList>
```

In a toolbar:

```tsx
<ReflowList justify="between" wrap>
  <ButtonGroup>{viewButtons}</ButtonGroup>
  <Button>New report</Button>
</ReflowList>
```

## Props

- **children** - `ReactNode`. Required. Each child is wrapped in a measured item.
- **gap** - `number`. CSS gap in pixels. Default `8`.
- **align** - `"start" | "center" | "end" | "stretch"`. Cross-axis alignment.
  Default `"center"`.
- **justify** - `"start" | "center" | "end" | "between"`. Main-axis
  distribution. Default `"start"`.
- **wrap** - `boolean`. Enables flex wrapping. Default `true`.
- **className** - extra classes on the root.

## Animation Model

`ReflowList` measures its own container width and buckets width changes into
roughly 64-pixel steps. On each bucket change, it runs a FLIP transition for
children marked with stable keys.

Stable React keys matter. If a child key changes every render, Harbor cannot
animate it from its previous position.

## Accessibility

The component only changes layout; it does not alter the semantics of its
children. Buttons remain buttons, links remain links, and badges remain text.
Keep tab order aligned with visual order by rendering children in the same order
users should navigate them.

For wrapped toolbars, avoid relying on spatial position alone. Labels and icons
should still explain what each item does after it moves to a new row.

## Gotchas

- `wrap={false}` disables wrapping, so overflow behavior depends on the parent.
- Large width changes are intentionally bucketed to avoid jitter during
  continuous resizing.
- Every child is wrapped in a `div`. If you need direct child selectors from the
  parent, account for that wrapper.

## Related

- `ButtonGroup` for grouped command buttons.
- `ResponsiveStack` for vertical or breakpoint-driven layout.
- `Toolbar` for command surfaces.
- `Badge` and `Tag` for chip-like children.
