# CanvasMotion

A bundle of small motion primitives meant to live inside a `<Canvas>`
world layer. Use them to give nodes an ambient, alive feel — orbiting
satellites, breathing pulses, gentle floats, organic jiggle, or strict
SVG-path travel. Each one is a thin wrapper around Framer Motion's
animate loop, with sensible defaults.

The exported components are: **CanvasOrbit**, **CanvasPulse**,
**CanvasFloat**, **CanvasJiggle**, **CanvasFollowPath**.

## Import

```tsx
import {
  CanvasOrbit,
  CanvasPulse,
  CanvasFloat,
  CanvasJiggle,
  CanvasFollowPath,
} from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas>
  <CanvasOrbit cx={300} cy={200} radius={120} duration={8}>
    <div className="w-6 h-6 rounded-full bg-fuchsia-400" />
  </CanvasOrbit>

  <CanvasItem x={300} y={200}>
    <CanvasPulse scale={[1, 1.12]} duration={1.6}>
      <div className="w-12 h-12 rounded-full bg-sky-400" />
    </CanvasPulse>
  </CanvasItem>

  <CanvasFollowPath
    d="M 80 80 Q 240 20 400 200 T 720 320"
    duration={6}
    rotate
    showPath
  >
    <span>→</span>
  </CanvasFollowPath>
</Canvas>
```

## Props (`<CanvasOrbit>`)

- **cx** / **cy** — `number`. World-space center.
- **radius** — `number`.
- **duration** — `number`. Seconds per revolution. Default `6`.
- **clockwise** — `boolean`. Default `true`.
- **startAngle** — `number`. Degrees, `0` = right.
- **centerChild** — `boolean`. Default `true`.
- **paused** — `boolean`.

## Props (`<CanvasPulse>`)

- **scale** — `[min, max]`. Default `[1, 1.08]`.
- **opacity** — `[min, max]`.
- **duration** — `number`. Default `1.6`.
- **ease** — Framer `Easing` or array.
- **paused** — `boolean`.

## Props (`<CanvasFloat>`)

- **amplitude** — `number`. Px peak-to-trough. Default `8`.
- **duration** — `number`. Default `3`.
- **axis** — `"y" | "x"`. Default `"y"`.
- **phase** — `number`. Delay so siblings don't move in lockstep.
- **paused** — `boolean`.

## Props (`<CanvasJiggle>`)

- **amplitude** — `number`. Max px offset. Default `2`.
- **frequency** — `number`. Higher = faster twitch. Default `3`.
- **rotate** — `boolean`. Also wobble rotation.
- **paused** — `boolean`.

## Props (`<CanvasFollowPath>`)

- **d** — `string`. SVG path commands in world coords.
- **duration** — `number`. Default `4`.
- **loop** — `boolean`. Default `true`.
- **rotate** — `boolean`. Spin to face tangent.
- **showPath** — `boolean`. Render a faint dashed trail.
- **pathStroke** — `string`.
- **paused** — `boolean`.

## Notes

- `CanvasOrbit` and `CanvasFollowPath` set their own absolute
  positioning — drop them as direct children of `<Canvas>`, not inside
  a `<CanvasItem>`.
- `CanvasPulse` / `CanvasFloat` / `CanvasJiggle` only animate transforms
  on a wrapper `div`; they're meant to wrap content already positioned
  by a `<CanvasItem>`.
- All five components accept a `paused` prop so you can stop them
  during expensive interactions.
