# Orbs

`Orbs` renders a decorative layer of glowing circles that drift, pulse, and blend together.
It is cheaper than canvas effects because each orb is a single animated `motion.div` with a
blurred radial gradient.

Use it for ambient backgrounds behind hero sections, login panels, empty states, and visual
feature callouts. It works best when the foreground content is simple and the orbs can remain
soft, slow, and low contrast.

## Import

```tsx
import { Orbs } from "@infinibay/harbor/backgrounds";
```

## Basic Usage

```tsx
<div className="relative h-96 overflow-hidden rounded-2xl">
  <Orbs count={9} glow={60} blend="screen" intensity={0.45} />
  <div className="relative z-10 p-8">Launch preview</div>
</div>
```

## Animation Model

Each orb gets deterministic size, position, movement, duration, and opacity from its index.
The layer is absolute and pointer-events none. By default, overlapping orbs use
`mix-blend-mode: screen`, so they brighten instead of muddying.

When `paused` is true or reduced motion is preferred and `respectReducedMotion` is enabled,
orbs render as a still frame.

## Props

- **count** - number of orbs. Default `7`.
- **sizeRange** - `[min, max]` radius in px. Default `[40, 180]`.
- **glow** - blur amount in px. Default `40`.
- **blend** - CSS mix-blend-mode. Default `"screen"`.
- **speed** - animation speed multiplier.
- **intensity** - opacity multiplier.
- **palette** - colors for the orbs.
- **paused** - renders a still frame when true.
- **respectReducedMotion** - checks `prefers-reduced-motion`. Default `true`.
- **className** / **style** - wrapper props.

## Accessibility

`Orbs` is `aria-hidden` and non-interactive. Treat it as decoration only. Keep foreground
text contrast high enough against the brightest possible overlap, especially when using
`screen` or `plus-lighter`.

Respect reduced motion for public pages. If motion is purely decorative, users who request
reduced motion should not have to see it.

## Gotchas

- The wrapper is `absolute inset-0`; the parent needs `relative` and usually `overflow-hidden`.
- High `count`, large `sizeRange`, and high `glow` can become visually noisy.
- Blend modes depend on the background underneath. Test on the real surface, not only on black.
- `pauseWhenHidden` and `pauseWhenOutOfView` are part of common background props but this
  component currently only checks `paused` and reduced motion directly.

## Related

- `MeshGradient` for soft bouncing blobs.
- `PlasmaField` for continuous canvas color fields.
- `Aurora` for sweeping banded backgrounds.
- `AnimatedBackground` for switching between background styles.
