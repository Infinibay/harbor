# Waves

`Waves` renders layered animated SVG sine waves as a decorative background. It
is useful for product sections, empty states, onboarding panels, media headers,
or subtle branded surfaces where motion should feel ambient rather than
interactive.

The component is visual-only. It should sit behind real content and never be the
only way a page communicates information.

## Import

```tsx
import { Waves } from "@infinibay/harbor/backgrounds";
```

## Basic Usage

```tsx
<div className="relative overflow-hidden rounded-xl bg-surface">
  <Waves amplitude={0.08} frequency={1.6} intensity={0.45} />
  <Card title="Deploy preview ready" description="Review the generated build." />
</div>
```

Use a custom palette to match a product surface:

```tsx
<Waves
  palette={["#38bdf8", "#a855f7", "#34d399"]}
  count={5}
  speed={0.7}
/>
```

## Props

- **count** - `number`. Number of stacked wave layers. Default `4`.
- **amplitude** - `number`. Relative wave height against the viewport. Default
  `0.1`.
- **frequency** - `number`. Horizontal wave frequency. Higher values create
  tighter peaks. Default `2.2`.
- **resolution** - `number`. Number of points used to build each path. Default
  `80`.
- **speed** - `number`. Animation speed multiplier from common background props.
- **intensity** - `number`. Opacity/loudness multiplier from common background
  props.
- **palette** - `readonly string[]`. Colors cycled across wave layers.
- **paused** - `boolean`. Pauses animation externally.
- **respectReducedMotion** - `boolean`. Lets reduced-motion users receive a
  still frame.
- **pauseWhenHidden** - `boolean`. Skips work while the tab is hidden.
- **pauseWhenOutOfView** - `boolean`. Skips work while off-screen.
- **className** - extra classes on the absolute wrapper.
- **style** - inline styles on the wrapper.

## Rendering Model

`Waves` renders absolute-positioned SVG paths. During animation it updates each
path's `d` attribute imperatively through Harbor's animation-frame utility. That
keeps React from re-rendering every frame.

Each layer receives a phase, vertical offset, speed multiplier, palette color,
and opacity based on `intensity`.

## Accessibility

The wrapper is `aria-hidden` and pointer-events are disabled, so the background
does not interfere with reading or interaction. Keep foreground contrast high,
especially when using bright palettes or high intensity.

Respect reduced motion for production surfaces. If motion is decorative, users
who request reduced motion should still get a calm static composition.

## Gotchas

- The wrapper is `absolute inset-0`; the parent must be `position: relative` and
  have an explicit height.
- High `resolution`, `count`, and `speed` values increase animation work. Keep
  decorative backgrounds quiet in data-heavy apps.
- This is not a chart. Do not use wave shapes to represent quantitative data.

## Related

- `Aurora`, `MeshGradient`, and `PlasmaField` for other animated backgrounds.
- `BackgroundDistortion` for media-heavy visual surfaces.
- `Card` and `Section` for foreground content over decorative backgrounds.
- `HarborProvider` for theme colors that can inform custom palettes.
