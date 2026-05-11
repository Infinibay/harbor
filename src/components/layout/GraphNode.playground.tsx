import { Badge } from "../display/Badge";
import {
  ExecutionTrace,
  GraphNode,
  GraphNodePalette,
  type GraphPaletteItem,
} from "./GraphNode";
import { HarborProvider } from "../../lib/theme";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const paletteItems: GraphPaletteItem[] = [
  { id: "source", label: "Source", description: "Receives events", category: "Input" },
  { id: "transform", label: "Transform", description: "Normalizes payloads", category: "Processing" },
  { id: "publish", label: "Publish", description: "Sends results downstream", category: "Output" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GraphNodeDemo(props: any) {
  return (
    <HarborProvider
      defaultTheme="harbor-dark"
      target="desktop-app"
      density="compact"
      className="grid w-full gap-4 rounded-2xl border border-white/10 bg-[var(--harbor-graph-canvas-bg)] p-4 md:grid-cols-[minmax(0,1fr)_16rem]"
    >
      <div className="grid place-items-center">
        <GraphNode
          {...props}
          title="Transform"
          subtitle="Normalize event payload"
          icon="fx"
          selected
          ports={[
            { id: "input", side: "left", label: "Input", status: "success" },
            { id: "rejects", side: "bottom", label: "Rejects", status: "warning" },
            { id: "output", side: "right", label: "Output", status: "active" },
          ]}
          meta="2.4k events/min"
          footer={
            <ExecutionTrace
              items={[
                { id: "parse", label: "Parse envelope", status: "success" },
                { id: "map", label: "Map schema", detail: "3 warnings", status: "warning" },
              ]}
            />
          }
          actions={<Badge tone="success">live</Badge>}
        />
      </div>
      <GraphNodePalette items={paletteItems} onAdd={() => {}} />
    </HarborProvider>
  );
}

export const playground: PlaygroundManifest = {
  component: GraphNodeDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    status: {
      type: "select",
      options: ["idle", "queued", "running", "success", "warning", "error", "disabled"],
      default: "running",
    },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Running", props: { status: "running" } },
    { label: "Success", props: { status: "success" } },
    { label: "Warning", props: { status: "warning" } },
    { label: "Disabled", props: { status: "disabled", disabled: true } },
  ],
  notes:
    "Ports are declarative and should keep stable ids so GraphCanvas can resolve edge anchors.",
};
