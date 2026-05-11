# Constellations

`Constellations` draws drifting points and nearby connection lines on a Canvas 2D
layer. It is useful for technical product surfaces: network dashboards, graph
editors, AI workbenches, infra landing sections, terminal headers, and empty
states that need depth without becoming the primary content.

The component is decorative. It renders behind or above content and does not
carry product state.

## Import

```tsx
import { Constellations } from "@infinibay/harbor/backgrounds";
```

## Basic Usage

Place it in a positioned container. The component is absolute and fills the
parent.

```tsx
<section className="relative overflow-hidden rounded-xl bg-surface-1">
  <Constellations intensity={0.45} density={0.45} />
  <div className="relative p-6">
    <h2>Network health</h2>
  </div>
</section>
```

## Cursor Reactivity

By default, nearby nodes glow toward the cursor. Disable it for static previews,
low-power surfaces, or areas where pointer motion should not change the mood.

```tsx
<Constellations cursorReactive={false} paused={isBackgroundPaused} />
```

## Performance Tuning

`density` controls node count, and line drawing is O(n²). Keep density modest on
large containers. `maxDistance` controls how many lines are drawn.

```tsx
<Constellations density={0.35} maxDistance={110} drift={8} />
```

## Props

- `density`: nodes per 10,000 square pixels.
- `maxDistance`: distance under which nodes connect.
- `nodeSize`: node radius in pixels.
- `drift`: movement speed in pixels per second.
- `lineColor`: connection-line color override.
- `cursorReactive`: enables cursor glow.
- `cursorRadius`: cursor influence radius.
- Common background props: `speed`, `intensity`, `palette`, `paused`,
  `respectReducedMotion`, `pauseWhenHidden`, `pauseWhenOutOfView`, `className`,
  and `style`.

## Accessibility

The background is `aria-hidden` and pointer-transparent. Do not use it as a
status indicator. If network state matters, show it with text, badges, charts,
or alerts.

Respect reduced motion for product pages and long-lived dashboards.

## Gotchas

The parent must have dimensions. A zero-height container produces no visible
canvas.

High density on large monitors can become expensive because every node pair is
checked each frame.

## Related

- `BackgroundDistortion` for overlay texture.
- `AnimatedBackground` for full-surface motion.
- `NetworkGraph` when nodes and edges represent real data.
- `MeshGradient` for calmer color fields.
