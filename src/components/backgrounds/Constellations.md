# Constellations

Drifting points connected by lines when they're close enough — a network/star-map effect on a 2D canvas. Optionally lights up around the cursor.

## Import

```tsx
import { Constellations } from "@infinibay/harbor/backgrounds";
```

## Example

```tsx
<div className="relative h-96">
  <Constellations density={0.8} maxDistance={160} cursorReactive />
</div>
```

## Props

- **density** — `number`. Nodes per 10 000 px². Default: `0.6`.
- **maxDistance** — `number`. Pixel distance below which two nodes are connected. Default: `140`.
- **nodeSize** — `number`. Node radius in px. Default: `1.8`.
- **drift** — `number`. Drift speed in px/s. Default: `14`.
- **lineColor** — `string`. CSS color for connecting lines. Default: `rgba(168,85,247,1)` (Harbor fuchsia).
- **cursorReactive** — `boolean`. Highlight nodes near the cursor. Default: `true`.
- **cursorRadius** — `number`. Cursor reach in px. Default: `160`.
- **speed** — `number`. Default: `1`.
- **intensity** — `number`. 0..1, drives line and node alpha. Default: `0.5`.
- **palette** — `readonly string[]`. Node colors. Default: Harbor accents.
- **paused**, **respectReducedMotion**, **pauseWhenHidden**, **pauseWhenOutOfView** — animation guards.
- **className**, **style** — applied to the wrapper.

## Notes

- Renders `position: absolute inset-0`. Parent must be positioned.
- Node count auto-derives from container area × `density`; the line-drawing loop is O(n²) per frame so keep effective count under ~120 nodes for full-bleed use. On a 1920×1080 area the default density yields ~125 nodes.
- Cursor tracking uses the wrapper's `mousemove` — the wrapper is `pointer-events-none`, so the listener fires through to it via bubbling from siblings only when those siblings don't `stopPropagation`. If cursor reactivity feels dead, lift `<Constellations>` above interactive content or set `pointerEvents` via `style`.
- For a denser "magic carpet" effect prefer `<PlasmaField>`; for sparse glow points without lines, prefer `<Orbs>`.
