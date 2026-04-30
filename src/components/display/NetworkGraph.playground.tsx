import { NetworkGraph, type GraphEdge, type GraphNode } from "./NetworkGraph";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const nodes: GraphNode[] = [
  { id: "lb", label: "lb-01", status: "online" },
  { id: "api1", label: "api-01", status: "online" },
  { id: "api2", label: "api-02", status: "degraded" },
  { id: "api3", label: "api-03", status: "online" },
  { id: "cache", label: "redis-01", status: "online" },
  { id: "db", label: "db-prim", status: "online", fixed: true, x: 0, y: 160 },
  { id: "db-r", label: "db-replica", status: "online", fixed: true, x: 200, y: 160 },
];

const edges: GraphEdge[] = [
  { from: "lb", to: "api1", animated: true },
  { from: "lb", to: "api2", animated: true },
  { from: "lb", to: "api3", animated: true },
  { from: "api1", to: "cache" },
  { from: "api2", to: "cache" },
  { from: "api3", to: "cache" },
  { from: "api1", to: "db", thickness: 2 },
  { from: "api2", to: "db", thickness: 2 },
  { from: "api3", to: "db", thickness: 2 },
  { from: "db", to: "db-r", animated: true, color: "rgba(56,189,248,0.6)", label: "replicate" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NetworkGraphDemo(props: any) {
  return (
    <NetworkGraph
      {...props}
      nodes={nodes}
      edges={edges}
      onNodeClick={(n) => props.onNodeClick?.(n.id)}
      onEdgeClick={(e) => props.onEdgeClick?.(`${e.from}→${e.to}`)}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: NetworkGraphDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    layout: { type: "select", options: ["force", "circular", "hierarchical"], default: "force" },
    height: { type: "number", default: 480, min: 240, max: 800, step: 20 },
  },
  events: [
    { name: "onNodeClick", signature: "(node: GraphNode) => void" },
    { name: "onEdgeClick", signature: "(edge: GraphEdge) => void" },
  ],
  notes: "Drag empty area to pan, wheel to zoom, drag a node to pin it, Shift+drag a pinned node to release.",
};
