# Bubbles

SVG metaball bubbles that drift, bounce off the edges, and **merge** when they get close. The merge is done with a blur + alpha-stretch matrix, so edges stay crisp even though the bubbles are soft underneath.

## Import

```tsx
import { Bubbles } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<div className="relative h-96">
  <Bubbles count={12} gooeyness={20} gradient backdrop="#0b0b14" />
</div>
```

## Props

- **count** — `number`. Number of bubbles. Default: `10`.
- **sizeRange** — `[number, number]`. Min/max radius in px. Default: `[30, 110]`.
- **drift** — `number`. Base drift speed in px/s. Default: `36`.
- **gooeyness** — `number`. Alpha-stretch factor. Higher = sharper merges. 5..20 is usable. Default: `18`.
- **mergeRadius** — `number`. Gaussian-blur stdDeviation; controls how close bubbles must get before they merge. Default: `14`.
- **gradient** — `boolean`. Use a radial gradient inside each bubble instead of flat fill.
- **backdrop** — `string`. CSS color drawn behind the bubbles.
- **speed** — `number`. Default: `1`.
- **intensity** — `number`. 0..1, drives bubble opacity. Default: `0.5`.
- **palette** — `readonly string[]`. Default: Harbor accents.
- **paused**, **respectReducedMotion**, **pauseWhenHidden**, **pauseWhenOutOfView** — animation guards.
- **className**, **style** — applied to the wrapper.

## Notes

- Renders `position: absolute inset-0`. Parent must be positioned.
- The metaball filter is a stacking context — content underneath the SVG won't compose through it. Use `backdrop` to color the gap.
- High `count` × `mergeRadius` is the most expensive combination; the GPU does the blur but very large radii on full-bleed surfaces show up in profiles.
- For looser glow blobs without merging, prefer `<MeshGradient>` or `<Orbs>`.
