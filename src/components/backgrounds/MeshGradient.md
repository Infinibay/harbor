# MeshGradient

`MeshGradient` renders an animated field of soft color blobs that drift inside a container and
bounce off its edges. Heavy blur makes neighboring blobs melt into each other, creating a
polished ambient background without re-rendering React on every frame.

Use it behind hero regions, empty states, onboarding panels, media headers, and premium
surfaces that need depth. Keep it decorative and restrained: the mesh should support the
content, not compete with charts, forms, or dense app chrome.

## Import

```tsx
import { MeshGradient } from "@infinibay/harbor/backgrounds";
```

## Basic Usage

```tsx
<div className="relative h-96 overflow-hidden rounded-2xl">
  <MeshGradient blobs={5} blur={100} speed={0.8} intensity={0.45} />
  <div className="relative z-10 p-8">
    <h2>Launch workspace</h2>
  </div>
</div>
```

## Animation Model

The component measures its container, creates deterministic blob positions from the current
configuration, and moves DOM nodes directly inside a single animation loop. Blob state is
seeded from `blobs`, `blobSize`, `drift`, and `palette`, so the same props create the same
starting layout.

`speed` multiplies the drift velocity. `intensity` affects opacity. `respectReducedMotion`,
`pauseWhenHidden`, and `pauseWhenOutOfView` are passed to Harbor's animation-frame hook so the
background can stop when it should not spend motion or CPU budget.

## Props

- **blobs** - `number`. Number of blobs. Default `4`.
- **blobSize** - `number`. Blob diameter as a fraction of `min(width, height)`.
  Default `0.7`.
- **blur** - `number`. Wrapper blur in px. Default `80`.
- **drift** - `number`. Base drift speed in container fractions per second. Default `0.08`.
- **speed** - `number`. Multiplier on `drift`. Default `1`.
- **intensity** - `number`. `0..1`; drives blob opacity. Default `0.5`.
- **palette** - `readonly string[]`. Default Harbor accent palette.
- **paused** - `boolean`. Stops motion externally.
- **respectReducedMotion** - `boolean`. Lets reduced-motion users receive a still frame.
- **pauseWhenHidden** - `boolean`. Skips animation work in hidden tabs.
- **pauseWhenOutOfView** - `boolean`. Skips animation when the element is off screen.
- **className** / **style** - applied to the absolute wrapper.

## Accessibility

`MeshGradient` is `aria-hidden` and `pointer-events: none`, so it is decorative by design. Do
not put semantic content inside it. Keep foreground contrast high enough after blur and color
mixing; the mesh can change perceived contrast even when text colors are unchanged.

For product UIs, leave `respectReducedMotion` enabled unless the background is completely
static in your configuration.

## Gotchas

- The wrapper is `absolute inset-0`; the parent must be positioned, usually with
  `relative`, and should often use `overflow-hidden`.
- `filter: blur(...)` creates a stacking context. Put foreground content in a higher stacking
  layer if needed.
- Large blur, many blobs, and high opacity can become visually loud. Start with `4` or `5`
  blobs and low intensity.
- Container size `0` produces no visible blob dimensions until measured.

## Related

- `Aurora` for sweeping layered bands.
- `Orbs` for separated glowing dots.
- `Bubbles` for metaball-like movement.
- `AnimatedBackground` for a higher-level background switcher.
