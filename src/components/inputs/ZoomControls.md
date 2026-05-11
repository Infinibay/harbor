# ZoomControls

`ZoomControls` is the compact zoom widget used around canvases, diagrams, maps, editors, and design tools. It gives the user three fast actions: zoom out, inspect the current percentage, and zoom in. Hovering the percentage reveals preset zoom levels and an optional fit-to-view action.

Use it when zoom is a discrete workspace setting. If the user needs continuous scrubbing, pair the workspace with `Slider` or `RangeSlider` instead.

## Import

```tsx
import { ZoomControls } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { ZoomControls } from "@infinibay/harbor/inputs";

export function CanvasZoom() {
  const [zoom, setZoom] = useState(100);

  return (
    <ZoomControls
      value={zoom}
      onChange={setZoom}
      min={25}
      max={400}
      step={25}
      presets={[50, 100, 150, 200, 400]}
      onFit={() => setZoom(100)}
    />
  );
}
```

## Props

- **value** - `number`. Required current zoom percentage. `100` means 100%.
- **onChange** - `(v: number) => void`. Required setter called by buttons and presets.
- **min** - `number`. Minimum value for the minus button. Default `10`.
- **max** - `number`. Maximum value for the plus button. Default `400`.
- **step** - `number`. Delta used by the minus and plus buttons. Default `10`.
- **presets** - `number[]`. Values shown in the hover menu. Default `[25, 50, 100, 200]`.
- **onFit** - `() => void`. Adds a "Fit to view" menu item when provided.
- **className** - extra classes on the wrapper.

## Behavior

Minus and plus clamp values into `[min, max]`. Preset items call `onChange(preset)` directly. The center percentage is a button-like trigger whose menu opens on hover, which keeps the control compact inside dense toolbars.

The component stores no zoom state. Your app owns `value`, applies it to the canvas transform, and decides what "fit to view" means.

## Accessibility

Minus and plus buttons have `aria-label` values. The preset menu is hover-driven and is not a full menu button implementation, so keyboard users can still use minus and plus but cannot reliably open the preset list with a keyboard alone. If presets are essential in your app, expose the same commands in a command palette, menu bar, or shortcuts sheet.

## Gotchas

- Values are percentages, not multipliers. Use `100`, not `1`.
- Presets are not clamped. Keep them inside your own min and max range.
- `onFit` is a callback only. It does not change `value` unless your callback does.
- The menu is meant for workspace chrome, not forms.

## Related

- `CanvasZoomControls` for canvas-specific zoom controls.
- `Slider` for continuous input.
- `Toolbar` for placing zoom controls with other editor commands.
