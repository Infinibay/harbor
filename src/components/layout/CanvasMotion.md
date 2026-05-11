# CanvasMotion

`CanvasMotion` is a small family of motion primitives for Harbor canvases. Instead of hand-writing Framer Motion loops in every node editor, you can use `CanvasOrbit`, `CanvasPulse`, `CanvasFloat`, `CanvasJiggle`, and `CanvasFollowPath` to add meaningful motion to items that live in world coordinates.

Use these helpers sparingly: they are best for status, attention, simulation, previews, and live object movement, not for decorating every element.

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

## Basic Usage

```tsx
<Canvas>
  <CanvasOrbit cx={320} cy={220} radius={96} duration={8}>
    <Badge>Replica</Badge>
  </CanvasOrbit>

  <CanvasItem x={120} y={160}>
    <CanvasPulse opacity={[0.55, 1]} scale={[1, 1.08]}>
      <StatusDot />
    </CanvasPulse>
  </CanvasItem>
</Canvas>
```

## Follow A Path

```tsx
<CanvasFollowPath
  d="M 80 120 C 220 40 360 220 520 120"
  duration={5}
  rotate
  showPath
>
  <ServerIcon />
</CanvasFollowPath>
```

`CanvasFollowPath` samples the SVG path with `getPointAtLength`, then positions the child at the sampled point. With `rotate`, the child faces the path tangent.

## Props

- `CanvasOrbit`: `cx`, `cy`, `radius`, `duration`, `clockwise`, `startAngle`, `centerChild`, `paused`.
- `CanvasPulse`: `scale`, `opacity`, `duration`, `ease`, `paused`.
- `CanvasFloat`: `amplitude`, `duration`, `axis`, `phase`, `paused`.
- `CanvasJiggle`: `amplitude`, `frequency`, `rotate`, `paused`.
- `CanvasFollowPath`: `d`, `duration`, `loop`, `rotate`, `paused`, `showPath`, `pathStroke`.

All components accept `children` and `className`.

## Accessibility

Motion components do not add semantic meaning by themselves. Put accessible names and states on the child component, and expose a user preference in your app for disabling ambient motion. Pass `paused` when reduced motion is enabled.

## Gotchas

`CanvasFollowPath` depends on browser SVG path measurement. It should run in the browser, not during server-only rendering. For many animated items, prefer fewer loops and lower update frequency.

## Related

Use with `Canvas`, `CanvasItem`, `CanvasConnection`, `CanvasSelectionBox`, `CanvasToolbar`, and `CanvasVirtualized`.
