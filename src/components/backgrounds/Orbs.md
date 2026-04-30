# Orbs

Pulsing glow orbs — CSS + Framer Motion. Each orb is a single blurred `motion.div` looping a small position + scale tween. Default `mix-blend-mode: screen` makes overlapping orbs brighten without muddying.

## Import

```tsx
import { Orbs } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<div className="relative h-96 bg-black">
  <Orbs count={9} sizeRange={[60, 220]} glow={50} intensity={0.7} />
</div>
```

## Props

- **count** — `number`. Number of orbs. Default: `7`.
- **sizeRange** — `[number, number]`. Min/max radius in px. Default: `[40, 180]`.
- **glow** — `number`. Extra `blur(...)` in px on each orb. Default: `40`.
- **blend** — `"screen" | "plus-lighter" | "lighten" | "overlay" | "normal"`. Layer blend mode. Default: `"screen"`.
- **speed** — `number`. Inverse multiplier on per-orb tween duration. Default: `1`.
- **intensity** — `number`. 0..1, drives orb opacity. Default: `0.5`.
- **palette** — `readonly string[]`. Default: Harbor accents.
- **paused** — `boolean`. Freeze in current position.
- **respectReducedMotion** — `boolean`. Default: `true`.
- **className**, **style** — applied to the wrapper.

## Notes

- Renders `position: absolute inset-0`. Parent must be positioned.
- `screen` blend looks great on dark backgrounds and washed-out on light ones — switch to `overlay` or `multiply` for light themes.
- Layout is deterministic per `(count, sizeRange, palette)` (sin-hash seeded).
- Cheaper than `<MeshGradient>` because there's no per-frame JS — Framer drives CSS transforms on the compositor.
- Orbs don't merge; for metaballs use `<Bubbles>`.
