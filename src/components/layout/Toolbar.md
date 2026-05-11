# Toolbar

`Toolbar` is a compact command container for editor tools, canvas controls,
formatting actions, filters, and desktop-style app chrome. It provides the
toolbar role, horizontal or vertical layout, optional floating surface styling,
and helper primitives for groups and separators.

Use it when commands are visible and repeatedly used. For hidden or contextual
actions, use menus, command palettes, or context menus.

## Import

```tsx
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Toolbar variant="floating">
  <ToolbarGroup>
    <ToggleButton pressed={bold} onChange={setBold}>Bold</ToggleButton>
    <ToggleButton pressed={italic} onChange={setItalic}>Italic</ToggleButton>
  </ToolbarGroup>

  <ToolbarSeparator />

  <ToolbarGroup>
    <Button variant="ghost">Undo</Button>
    <Button variant="ghost">Redo</Button>
  </ToolbarGroup>
</Toolbar>
```

Vertical toolbars work well for canvas modes:

```tsx
<Toolbar orientation="vertical" variant="floating">
  <ToolbarGroup>
    <ToggleButton pressed={tool === "select"} onChange={() => setTool("select")} />
    <ToggleButton pressed={tool === "draw"} onChange={() => setTool("draw")} />
  </ToolbarGroup>
</Toolbar>
```

## Props

`Toolbar`:

- **children** - `ReactNode`. Required. Usually groups, separators, and buttons.
- **variant** - `"flat" | "floating"`. Default `"flat"`.
- **orientation** - `"horizontal" | "vertical"`. Default `"horizontal"`.
- **className** - extra classes on the wrapper.

`ToolbarGroup`:

- **children** - `ReactNode`.
- **className** - extra classes on the group.

`ToolbarSeparator`:

- **orientation** - `"vertical" | "horizontal"`. Default `"vertical"`.

## Layout Model

`Toolbar` only arranges children. It does not enforce which button components you
use or how command state is stored. Use `ToolbarGroup` to keep related commands
close together, then separate groups with `ToolbarSeparator`.

Use `variant="floating"` for canvas overlays and detached control bars. Use
`flat` when the toolbar already sits inside a header, panel, or app chrome.

## Accessibility

The root uses `role="toolbar"`. Toolbar controls still need their own labels,
pressed states, and disabled states. Prefer icon plus tooltip or visible text for
commands that are not universally recognizable.

Keep keyboard order the same as visual order. If a toolbar changes modes, make
the selected mode obvious with `ToggleButton` or `aria-pressed`.

## Gotchas

- Separators are visual only. They do not create semantic groups.
- `ToolbarGroup` is always inline-flex; for complex responsive wrapping, compose
  it with `ReflowList`.
- Vertical toolbars need horizontal separators; pass
  `orientation="horizontal"` to `ToolbarSeparator`.

## Related

- `ToggleButton` for on/off toolbar modes.
- `ButtonGroup` for compact grouped buttons.
- `CanvasToolbar` and `FlyoutToolbar` for canvas-specific controls.
- `CommandPalette` for searchable commands.
