import { useState } from "react";
import { Canvas, CanvasItem } from "./Canvas";
import { CanvasToolbar } from "./CanvasToolbar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasToolbarDemo(props: any) {
  const [tool, setTool] = useState("select");
  const items = [
    { id: "select", icon: "↖", label: "Select", shortcut: "V", active: tool === "select", onClick: () => setTool("select") },
    { id: "hand",   icon: "✋", label: "Pan",    shortcut: "H", active: tool === "hand",   onClick: () => setTool("hand"), divider: true },
    { id: "rect",   icon: "▭",  label: "Rect",   shortcut: "R", active: tool === "rect",   onClick: () => setTool("rect") },
    { id: "circle", icon: "○",  label: "Ellipse",shortcut: "E", active: tool === "circle", onClick: () => setTool("circle") },
    { id: "pen",    icon: "✎",  label: "Pen",    shortcut: "P", active: tool === "pen",    onClick: () => setTool("pen"), divider: true },
    { id: "text",   icon: "T",  label: "Text",   shortcut: "T", active: tool === "text",   onClick: () => setTool("text") },
  ];

  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10">
      <Canvas grid="dots" overlay={<CanvasToolbar {...props} items={items} />}>
        <CanvasItem x={220} y={200}>
          <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm">
            Active tool: <span className="text-fuchsia-300">{tool}</span>
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasToolbarDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    orientation: { type: "select", options: ["vertical", "horizontal"], default: "vertical" },
    position: { type: "select", options: ["left", "right", "top", "bottom"], default: "left" },
    floating: { type: "boolean", default: true },
  },
  variants: [
    { label: "Vertical · left", props: {} },
    { label: "Horizontal · top", props: { orientation: "horizontal", position: "top" } },
    { label: "Vertical · right", props: { position: "right" } },
  ],
  events: [],
  notes: "Click the icons to switch tools — the active state and tooltips update accordingly.",
};
