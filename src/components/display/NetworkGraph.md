# NetworkGraph

Standalone force-directed graph — pure SVG, no Canvas. Wheel zoom,
drag to pan, drag a node to pin it, Shift+drag to release. For VM /
host topology overlays drop hosts as nodes and links as edges.

## Import

```tsx
import {
  NetworkGraph,
  type GraphNode,
  type GraphEdge,
} from "@infinibay/harbor/display";
```

## Example

```tsx
<NetworkGraph
  nodes={[
    { id: "lb",   label: "lb-01",   status: "online" },
    { id: "api1", label: "api-01",  status: "online" },
    { id: "api2", label: "api-02",  status: "degraded" },
    { id: "db",   label: "db-prim", status: "online", fixed: true, x: 0, y: 120 },
  ]}
  edges={[
    { from: "lb", to: "api1", animated: true },
    { from: "lb", to: "api2", animated: true },
    { from: "api1", to: "db", thickness: 2 },
    { from: "api2", to: "db", thickness: 2 },
  ]}
  layout="force"
  height={480}
  onNodeClick={(n) => navigate(`/hosts/${n.id}`)}
/>
```

## GraphNode / GraphEdge

```ts
GraphNode {
  id: string;
  label: string;
  status?: Status;        // small dot overlay (HTML, kept crisp)
  group?: string;
  color?: string;         // override node fill/stroke
  x?: number; y?: number; // initial position hint
  fixed?: boolean;        // physics never moves this node
}

GraphEdge {
  from: string; to: string;
  thickness?: number;
  animated?: boolean;     // dashed + flowing animation
  color?: string;
  label?: string;
}
```

## Props

- **nodes** — `readonly GraphNode[]`. Required.
- **edges** — `readonly GraphEdge[]`. Required.
- **layout** — `"force" | "circular" | "hierarchical"`. Default `"force"`.
  - `force` — physics simulation runs until energy decays.
  - `circular` — equally-spaced ring around origin.
  - `hierarchical` — simple grid; pre-position nodes for better results.
- **height** — `number`. Container height. Default `480`.
- **onNodeClick** — `(node: GraphNode) => void`.
- **onEdgeClick** — `(edge: GraphEdge) => void`.
- **overlay** — `ReactNode`. Absolute layer above the SVG (legends, HUDs).
- **className** — extra classes on the container.

## Notes

- The simulation tunings (`REPULSION`, `SPRING_K`, `DAMPING`) are
  baked-in — for very different scales (>~50 nodes) consider a real
  graph library.
- Dragging a node sets `pinned = true` on the live sim entry — Shift+drag
  on a pinned node releases it back to physics.
- Status chips are rendered as HTML overlays so they stay sharp at any zoom.
