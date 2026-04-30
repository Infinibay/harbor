# Toolbar

Horizontal or vertical container for compact action buttons, with an
optional floating chrome (rounded card + backdrop blur). Pairs with
`<ToolbarGroup>` for clustering related actions and
`<ToolbarSeparator>` for visual breaks. For canvas-attached toolbars
see the dedicated `<CanvasToolbar>` family.

## Import

```tsx
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Toolbar variant="floating">
  <ToolbarGroup>
    <Button size="sm" variant="ghost">Bold</Button>
    <Button size="sm" variant="ghost">Italic</Button>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarGroup>
    <Button size="sm" variant="ghost">Link</Button>
    <Button size="sm" variant="ghost">Image</Button>
  </ToolbarGroup>
</Toolbar>
```

## Props (`<Toolbar>`)

- **children** — `ReactNode`. Required.
- **variant** — `"flat" | "floating"`. Default `"flat"`. `floating`
  adds a rounded card surface, border, shadow, and backdrop blur.
- **orientation** — `"horizontal" | "vertical"`. Default `"horizontal"`.
- **className** — extra classes on the wrapper.

## Props (`<ToolbarGroup>`)

- **children** — `ReactNode`. Required.
- **className** — extra classes.

## Props (`<ToolbarSeparator>`)

- **orientation** — `"vertical" | "horizontal"`. Default `"vertical"`.
  Match this to the parent toolbar's orientation.

## Notes

- The toolbar uses `role="toolbar"` for accessibility — descendants
  should be focusable controls.
- Default gap between items is `0.5` (2px); group with `<ToolbarGroup>`
  if you want tighter clusters separated by larger visual gaps.
