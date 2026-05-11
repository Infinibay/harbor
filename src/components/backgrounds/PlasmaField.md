# PlasmaField

`PlasmaField` renders an animated canvas color field from summed sine waves. It draws at a
low resolution, stretches the canvas to the container, and applies blur for a smooth liquid
look.

Use it for atmospheric hero backgrounds, loading spaces, music or media surfaces, playful
launch pages, and visual experiments. It is intentionally decorative and should sit behind
simple foreground content.

## Import

```tsx
import { PlasmaField } from "@infinibay/harbor/backgrounds";
```

## Basic Usage

```tsx
<div className="relative h-96 overflow-hidden rounded-2xl">
  <PlasmaField scale={8} frequency={0.02} blur={18} />
  <div className="relative z-10 p-8">Signal field</div>
</div>
```

## Rendering Model

The component measures its container and creates a low-resolution canvas of
`width / scale` by `height / scale`. Each animation frame fills an `ImageData` buffer by
interpolating between palette colors. CSS stretches the canvas back to full size and applies
the configured blur.

Higher `scale` means fewer canvas pixels and cheaper rendering. Lower `scale` means more
detail and more CPU work. `frequency` changes the turbulence spacing, while `speed` changes
the phase motion over time.

## Props

- **scale** - low-res pixel scale. Default `8`.
- **frequency** - turbulence frequency. Default `0.02`.
- **blur** - CSS blur in px. Default `18`.
- **speed** - animation speed multiplier.
- **intensity** - alpha multiplier.
- **palette** - colors used for interpolation. Hex colors are expected.
- **paused** - stops animation externally.
- **respectReducedMotion** - lets reduced-motion users receive a still frame.
- **pauseWhenHidden** - skips animation work in hidden tabs.
- **pauseWhenOutOfView** - skips animation when off screen.
- **className** / **style** - wrapper props.

## Accessibility

`PlasmaField` is `aria-hidden` and pointer-events none. Do not place semantic content inside
it. Keep foreground text contrast high enough against the brightest generated colors.

Because this is continuous motion, leave reduced-motion handling enabled unless the field is
paused or used in a non-user-facing capture.

## Gotchas

- Parent needs `relative` if the field should fill that parent.
- Very low `scale` values can make the per-frame loop expensive on large containers.
- Palette parsing expects hex strings; CSS color functions are not parsed by `parseHex`.
- The canvas is intentionally not DPR-scaled because CSS upscales the low-resolution output.

## Related

- `Orbs` for cheaper glowing-dot motion.
- `MeshGradient` for soft blob motion without canvas.
- `Aurora` for calmer banded backgrounds.
- `BackgroundDistortion` for shader-like visual texture.
