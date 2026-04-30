import { useState } from "react";
import { FlyoutToolbar, type FlyoutToolbarEntry } from "./FlyoutToolbar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

function Icon({ d }: { d: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <path d={d} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = {
  cursor: "M5 3 L5 19 L10 14 L13 21 L15 20 L12 13 L19 13 Z",
  hand: "M7 11V6a1.5 1.5 0 0 1 3 0v5 M10 10V4.5a1.5 1.5 0 0 1 3 0V10 M13 10V5.5a1.5 1.5 0 0 1 3 0V13 M16 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.6-3.9L4 13",
  rect: "M4 5h16v14H4z",
  ellipse: "M4 12a8 5 0 1 0 16 0 a8 5 0 1 0 -16 0",
  triangle: "M12 4 L20 19 L4 19 Z",
  pen: "M3 21l4-1 11-11-3-3L4 17l-1 4z",
  text: "M5 5h14 M12 5v14",
  zoom: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3 M11 8v6 M8 11h6",
  gear: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M19 12l2 1-2 4-2-1 M5 12l-2 1 2 4 2-1 M12 5l1-2 4 2-1 2 M12 19l1 2 4-2-1-2",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FlyoutToolbarDemo(props: any) {
  const [tool, setTool] = useState("select");

  const entries: FlyoutToolbarEntry[] = [
    { kind: "item", item: { id: "select", icon: <Icon d={ICONS.cursor} />, label: "Select", shortcut: "V", active: tool === "select", onClick: () => setTool("select") } },
    { kind: "item", item: { id: "hand", icon: <Icon d={ICONS.hand} />, label: "Pan", shortcut: "H", active: tool === "hand", onClick: () => setTool("hand"), divider: true } },
    {
      kind: "group",
      group: {
        id: "shapes",
        label: "Shapes",
        items: [
          { id: "rect", icon: <Icon d={ICONS.rect} />, label: "Rectangle", shortcut: "R", active: tool === "rect", onClick: () => setTool("rect") },
          { id: "ellipse", icon: <Icon d={ICONS.ellipse} />, label: "Ellipse", shortcut: "O", active: tool === "ellipse", onClick: () => setTool("ellipse") },
          { id: "triangle", icon: <Icon d={ICONS.triangle} />, label: "Triangle", active: tool === "triangle", onClick: () => setTool("triangle") },
        ],
      },
    },
    { kind: "item", item: { id: "pen", icon: <Icon d={ICONS.pen} />, label: "Pen", shortcut: "P", active: tool === "pen", onClick: () => setTool("pen") } },
    { kind: "item", item: { id: "text", icon: <Icon d={ICONS.text} />, label: "Text", shortcut: "T", active: tool === "text", onClick: () => setTool("text") } },
  ];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        height: 480,
        background:
          "radial-gradient(closest-side at 30% 30%, rgba(168,85,247,0.4), transparent 70%), linear-gradient(135deg, #0a0a14, #14141c)",
      }}
    >
      <FlyoutToolbar
        entries={entries}
        title={props.orientation === "horizontal" ? "" : "Tools"}
        trailing={
          <button className="w-9 h-9 rounded-lg grid place-items-center text-white/60 hover:bg-white/5 hover:text-white">
            <Icon d={ICONS.gear} />
          </button>
        }
        {...props}
      />
      <div className="absolute bottom-3 right-3 px-2 py-1 text-[11px] rounded-md bg-black/60 text-white/80 border border-white/10">
        Tool: {tool}
      </div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FlyoutToolbarDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    orientation: { type: "select", options: ["vertical", "horizontal"], default: "vertical" },
    floating: { type: "boolean", default: true },
    position: { type: "select", options: ["left", "right", "top", "bottom"], default: "left" },
    flyoutCloseDelay: { type: "number", default: 120, min: 0, max: 600, step: 20 },
  },
  variants: [
    { label: "Left rail", props: { position: "left" } },
    { label: "Top rail", props: { orientation: "horizontal", position: "top" } },
    { label: "Right rail", props: { position: "right" } },
  ],
  events: [],
  notes:
    "Hover the 'Shapes' group button to open the flyout submenu; right-click to pin it open. Selected tool persists in the bottom-right badge.",
};
