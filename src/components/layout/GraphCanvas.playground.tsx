import { useState } from "react";
import {
  GraphCanvas,
  type GraphCanvasEdge,
  type GraphCanvasNode,
} from "./GraphCanvas";
import { GraphNode } from "./GraphNode";
import { HarborProvider } from "../../lib/theme";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

type NodeData = {
  label: string;
  kind: string;
  status: "idle" | "running" | "success" | "warning";
};

const initialNodes: GraphCanvasNode<NodeData>[] = [
  {
    id: "source",
    x: 80,
    y: 120,
    ports: [{ id: "out", side: "right", label: "Events", status: "success" }],
    data: { label: "Source", kind: "Webhook", status: "success" },
  },
  {
    id: "transform",
    x: 330,
    y: 210,
    ports: [
      { id: "in", side: "left", label: "Input", status: "success" },
      { id: "out", side: "right", label: "Output", status: "active" },
    ],
    data: { label: "Transform", kind: "Normalize payload", status: "running" },
  },
  {
    id: "sink",
    x: 520,
    y: 130,
    ports: [{ id: "in", side: "left", label: "Payload", status: "idle" }],
    data: { label: "Warehouse", kind: "Analytics", status: "idle" },
  },
];

const initialEdges: GraphCanvasEdge[] = [
  { id: "source-transform", from: "source", fromPort: "out", to: "transform", toPort: "in", label: "events" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GraphCanvasDemo(props: any) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedIds, setSelectedIds] = useState(["transform"]);

  return (
    <HarborProvider
      defaultTheme="harbor-dark"
      target="desktop-app"
      density="compact"
      className="h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[var(--harbor-graph-canvas-bg)]"
    >
      <GraphCanvas
        {...props}
        defaultTransform={{ x: 36, y: 40, zoom: 0.78 }}
        nodes={nodes}
        edges={edges}
        selectedIds={selectedIds}
        selectedEdgeIds={[]}
        activeEdgeIds={["source-transform"]}
        onSelectedIdsChange={setSelectedIds}
        onNodeMove={(nodeId, position) => {
          setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, ...position } : node));
        }}
        onConnect={(connection) => {
          const id = `${connection.from}-${connection.to}-${edges.length + 1}`;
          setEdges((current) => [...current, { id, ...connection, label: "new edge" }]);
        }}
        renderNode={({ node, selected }) => (
          <GraphNode
            title={node.data?.label}
            subtitle={node.data?.kind}
            status={node.data?.status}
            selected={selected}
            ports={node.ports}
            meta={selected ? "Selected in inspector" : "Drag to reposition"}
          />
        )}
      />
    </HarborProvider>
  );
}

export const playground: PlaygroundManifest = {
  component: GraphCanvasDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    showMinimap: { type: "boolean", default: true },
    showZoomControls: { type: "boolean", default: true },
    showStatusBar: { type: "boolean", default: true },
    edgeCurve: { type: "select", options: ["smart", "smooth", "straight", "step"], default: "smart" },
  },
  variants: [
    { label: "Full graph workspace", props: {} },
    { label: "No minimap", props: { showMinimap: false } },
    { label: "Straight edges", props: { edgeCurve: "straight" } },
  ],
  events: [
    { name: "onSelectedIdsChange", signature: "(ids: string[]) => void", description: "Drives inspectors, toolbars, and status bars." },
    { name: "onNodeMove", signature: "(nodeId, position) => void", description: "Persist node position after drag." },
    { name: "onConnect", signature: "(connection) => void", description: "Create an edge after a port-to-port drag." },
  ],
  notes:
    "Drag nodes to move them. Drag from one port to another to create a new edge.",
};
