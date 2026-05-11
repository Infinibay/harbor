# NetworkGraph

`NetworkGraph` renders a standalone node-link graph with force, circular, or
hierarchical layout, pan, wheel zoom, draggable pinned nodes, animated edges,
edge labels, status chips, and an overlay slot. It is built for service maps,
infrastructure topology, dependency graphs, workflow previews, and incident
exploration.

Use it when relationships are the content. Use `Canvas` primitives when users
are authoring a graph manually.

## Import

```tsx
import { NetworkGraph } from "@infinibay/harbor/display";
```

## Basic Usage

Nodes and edges are plain data. Edges reference node ids.

```tsx
<NetworkGraph
  nodes={[
    { id: "api", label: "API", status: "healthy" },
    { id: "db", label: "Database", status: "warning" },
  ]}
  edges={[{ from: "api", to: "db", label: "queries", animated: true }]}
  onNodeClick={(node) => setSelectedNode(node)}
/>
```

## Layouts

`force` runs a small force simulation. `circular` and `hierarchical` are static.
Provide `x` and `y` to seed positions, and `fixed` to pin nodes.

```tsx
<NetworkGraph layout="hierarchical" nodes={nodes} edges={edges} />
```

## Interaction

Users can drag empty space to pan, use the wheel to zoom, drag nodes to pin them,
and shift-drag pinned nodes to release them. `onEdgeClick` lets you inspect
connection details.

## Props

- `nodes`: required graph nodes.
- `edges`: required graph edges.
- `layout`: `force`, `circular`, or `hierarchical`.
- `height`: viewport height.
- `onNodeClick`, `onEdgeClick`: selection callbacks.
- `overlay`: absolute viewport-space overlay slot.
- `className`: wrapper class override.

Nodes include `id`, `label`, optional `status`, `group`, `color`, `x`, `y`, and
`fixed`. Edges include `from`, `to`, optional `thickness`, `animated`, `color`,
and `label`.

## Accessibility

The graph is a visual exploration surface. Provide a selected-node inspector,
table, or list for keyboard navigation and exact values. Do not rely on edge
color or node position as the only state signal.

## Gotchas

The force layout is intentionally lightweight. Large graphs or precise topology
layouts may need a dedicated layout engine.

The graph manages simulation state internally. When node identity changes, the
layout re-seeds.

## Related

- `Canvas` and `CanvasConnection` for authoring node editors.
- `GraphNode` for manual graph UIs.
- `ClusterView` for service clusters.
- `StatusDot` for node status.
