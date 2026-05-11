# FlyoutToolbar

`FlyoutToolbar` is the compact tool rail for editors, canvases, diagram builders, image tools, and other dense workspaces. It keeps the primary tools visible while collapsing related actions into flyout groups, so the user can move quickly without turning the canvas into a wall of buttons.

Use it in a `Canvas` `overlay` slot for a floating rail, or set `floating={false}` when the toolbar belongs inside a fixed header or panel.

## Import

```tsx
import { FlyoutToolbar } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Canvas
  overlay={
    <FlyoutToolbar
      title="Tools"
      position="left"
      entries={[
        {
          kind: "item",
          item: {
            id: "select",
            label: "Select",
            icon: <MousePointer2 size={16} />,
            active: tool === "select",
            shortcut: "V",
            onClick: () => setTool("select"),
          },
        },
        {
          kind: "group",
          group: {
            id: "shapes",
            label: "Shapes",
            items: [
              { id: "rect", label: "Rectangle", icon: <Square size={16} />, active: tool === "rect", onClick: () => setTool("rect") },
              { id: "ellipse", label: "Ellipse", icon: <Circle size={16} />, active: tool === "ellipse", onClick: () => setTool("ellipse") },
            ],
          },
        },
      ]}
    />
  }
/>
```

## How It Works

An entry is either a single `item` or a `group`. A group renders as one button using the active item's icon by default. Hover opens the submenu, right-click toggles it, and clicking the group button executes the active item. This gives drawing tools the familiar "last used shape" behavior without extra app code.

## Props

- `entries`: required list of toolbar entries.
- `orientation`: `"vertical"` or `"horizontal"`. Default is `"vertical"`.
- `floating`: when `true`, the toolbar is absolutely positioned.
- `position`: `"top"`, `"bottom"`, `"left"`, or `"right"`.
- `title`: optional label rendered inside the rail.
- `trailing`: optional trailing slot for settings, more tools, or status.
- `flyoutCloseDelay`: hover-close delay in milliseconds. Default is `120`.

## Item And Group Shape

`FlyoutToolbarItem` accepts `id`, `icon`, `label`, `shortcut`, `active`, `disabled`, `onClick`, and `divider`.

`FlyoutToolbarGroup` accepts `id`, `label`, `items`, `divider`, `icon`, and `title`. Provide `group.icon` when the group should keep a stable icon instead of reflecting the active item.

## Accessibility

Each tool button receives an `aria-label` from `label` or `id`. Active tools use `aria-pressed`, disabled items use native `disabled`, and flyout groups expose `aria-haspopup="menu"` plus `aria-expanded`.

## Gotchas

The flyout is portalled with fixed positioning, so it escapes clipped parents. That is good inside canvases, but avoid placing it inside transformed containers if your app relies on custom coordinate math around the submenu.

## Related

Use with `Canvas`, `CanvasToolbar`, `CanvasZoomControls`, `CanvasStatusBar`, `Menu`, and `CommandPalette`.
