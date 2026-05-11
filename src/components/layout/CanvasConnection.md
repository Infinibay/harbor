# CanvasConnection

`CanvasConnection` draws an SVG edge between two world-space points inside a
Harbor canvas. It is built for node editors, workflow builders, dependency
graphs, diagramming tools, and visual automation surfaces where connections need
to move with pan and zoom.

Use it as a sibling to canvas items so the edge rides the same world transform.

## Import

```tsx
import { CanvasConnection } from "@infinibay/harbor/layout";
```

## Basic Usage

Pass start and end points in the same coordinate system as your canvas items.

```tsx
<CanvasConnection
  from={{ x: source.x + source.width, y: source.y + 24 }}
  to={{ x: target.x, y: target.y + 24 }}
  fromDirection="right"
  toDirection="left"
  arrow
/>
```

## Curve Modes

Choose the curve that matches the workflow.

```tsx
<CanvasConnection curve="bezier" from={a} to={b} />
<CanvasConnection curve="orthogonal" from={a} to={b} />
<CanvasConnection curve="straight" from={a} to={b} />
```

`curve="smart"` routes around obstacle rectangles with a practical orthogonal
heuristic.

```tsx
<CanvasConnection
  curve="smart"
  from={a}
  to={b}
  obstacles={nodes.map((node) => node.bounds)}
/>
```

## Labels And Interaction

Labels render at the midpoint. `onClick` and `onContextMenu` add a wider
transparent interaction path without changing the visible stroke.

```tsx
<CanvasConnection
  from={a}
  to={b}
  label="success"
  animated
  onClick={() => selectEdge(edge.id)}
/>
```

## Props

- `from`, `to`: world-space endpoints.
- `fromDirection`, `toDirection`: socket direction hints.
- `curve`: `straight`, `bezier`, `orthogonal`, or `smart`.
- `color`, `thickness`, `animated`, `label`, `arrow`: visual options.
- `obstacles`, `obstaclePadding`, `endpointPadding`: smart-routing controls.
- `onClick`, `onContextMenu`, `interactionWidth`: interaction options.
- `className`: wrapper class override.

## Accessibility

Canvas edges are primarily visual. If edge selection or configuration matters,
provide a keyboard-accessible edge list, inspector panel, command palette, or
node detail view.

Do not encode edge status only with color. Use labels, badges, or selected-edge
details for state such as success, failure, disabled, or pending.

## Gotchas

The smart router is heuristic, not a full graph-layout engine. It is good for
interactive editors, but complex dense graphs may still need a dedicated layout
algorithm.

The component sizes its local SVG to the edge bounding box. Very thick strokes
or labels can extend outside that box, so keep the surrounding canvas overflow
behavior intentional.

## Related

- `Canvas` for the world coordinate system.
- `GraphNode` for node surfaces.
- `CanvasSelectionBox` for selection state.
- `NetworkGraph` for data-driven graph visualization.
