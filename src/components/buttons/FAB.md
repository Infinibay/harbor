# FAB

`FAB` renders a floating action button for the primary action on a focused
surface. It can be fixed to a viewport corner or rendered inline with
`position="none"` for demos and custom layouts.

Use it when one action is clearly primary, such as creating a record, starting a
capture, opening a composer, or adding an item on mobile or canvas-heavy
screens.

## Import

```tsx
import { FAB } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
<FAB
  label="New project"
  icon={<PlusIcon />}
  onClick={() => openCreateProject()}
/>;
```

Inline placement:

```tsx
<FAB
  position="none"
  variant="secondary"
  label="Add node"
  icon={<PlusIcon />}
/>
```

## Props

- **icon** - `ReactNode`. Required visible icon.
- **label** - `string`. Required accessible label.
- **onClick** - `() => void`. Optional click handler.
- **position** - `"bottom-right" | "bottom-left" | "top-right" | "top-left" |
  "none"`. Default `"bottom-right"`.
- **size** - `"md" | "lg"`. Default `"md"`.
- **variant** - `"primary" | "secondary"`. Default `"primary"`.
- **className** - extra classes on the button.

## Behavior

The button uses `aria-label={label}` because the visible surface is icon-only.
It includes hover, tap, and cursor-proximity motion to make it feel like a
primary floating control.

Fixed positions use `z-50`. `position="none"` removes fixed positioning so the
button can sit inside a local layout.

## Accessibility

Choose a concrete action label: `Create deployment`, `Add node`, or `New issue`
is better than `Add`. The action should also be available in a normal command
surface when possible, especially on complex desktop layouts.

Do not place multiple primary FABs on one screen. Users should not have to guess
which floating action is primary.

## Gotchas

- The FAB is icon-only visually; `label` is required for assistive technology.
- Fixed placement can overlap cookie banners, chat widgets, mobile nav, or app
  status bars. Test the final viewport.
- FABs are strongest on creation flows. For secondary commands, use `Button` or
  `Toolbar`.

## Related

- `Button` for standard actions.
- `Toolbar` for multiple visible commands.
- `Drawer` or `Dialog` for the creation flow opened by a FAB.
- `CanvasToolbar` for canvas-specific actions.
