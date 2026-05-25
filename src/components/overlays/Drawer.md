# Drawer

`Drawer` renders a portal-backed side or edge panel with backdrop, Escape handling, title area, scrollable body, and optional footer. Use it for filters, record details, inspectors, settings panels, checkout sidebars, and workflows where users should keep page context while working in a focused panel.

Use `Dialog` instead when the task blocks the page or requires an explicit modal decision.

## Import

```tsx
import { Drawer } from "@infinibay/harbor/overlays";
```

## Basic Usage

```tsx
import { useState } from "react";
import { Button } from "@infinibay/harbor/buttons";
import { Drawer } from "@infinibay/harbor/overlays";

export function FilterDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open filters</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        footer={<Button size="sm">Apply filters</Button>}
      >
        Filter controls go here.
      </Drawer>
    </>
  );
}
```

## Props

- **open** - `boolean`. Required visibility state.
- **onClose** - `() => void`. Required close callback.
- **side** - `"right" | "left" | "bottom" | "top"`. Default `"right"`.
- **size** - `number | string`. Width for left/right, height for top/bottom. Default `380`.
- **title** - `ReactNode`. Optional header title.
- **children** - `ReactNode`. Scrollable drawer body.
- **footer** - `ReactNode`. Optional fixed footer area.
- **className** - extra classes on the panel.

## Behavior

The drawer renders through `Portal` at `Z.DRAWER`. Clicking the backdrop calls `onClose`. Pressing Escape also calls `onClose`. Clicking inside the panel stops propagation so body interactions do not close it.

Panel position and rounded corners change based on `side`. Motion enters from the chosen edge and exits back to that edge.

## Accessibility

The panel uses `role="dialog"` and `aria-modal="true"`. When `title` is provided, it is connected with `aria-labelledby`.

When opened, `Drawer` moves focus into the panel, traps Tab navigation inside the drawer, dismisses on Escape or outside pointer interaction, and restores focus to the opener when it closes.

## Gotchas

- `onClose` is called from backdrop, Escape, and the close button.
- `size` is applied directly as width or height.
- Without `title`, no close button is rendered by the component.
- Keep long forms inside the scrollable body and primary actions in `footer`.

## Related

- `Dialog` for blocking modal decisions.
- `Popover` for small anchored overlays.
- `Sheet`-style app panels can be composed with `AppShell` and `Aside`.
