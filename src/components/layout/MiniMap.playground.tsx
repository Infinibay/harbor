import { useState } from "react";
import { MiniMap } from "./MiniMap";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const ITEMS = [
  { x: 200, y: 150, w: 280, h: 180, color: "rgba(168,85,247,0.6)" },
  { x: 700, y: 300, w: 320, h: 200, color: "rgba(56,189,248,0.6)" },
  { x: 1500, y: 900, w: 260, h: 220, color: "rgba(244,114,182,0.6)" },
  { x: 2400, y: 500, w: 400, h: 240, color: "rgba(250,204,21,0.6)" },
  { x: 3200, y: 1800, w: 320, h: 200, color: "rgba(52,211,153,0.6)" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MiniMapDemo(props: any) {
  const [vp, setVp] = useState({ x: 800, y: 500, w: 1280, h: 720 });

  return (
    <div className="relative w-full grid place-items-center" style={{ height: 320 }}>
      <MiniMap
        world={{ w: 4000, h: 3000 }}
        viewport={vp}
        items={ITEMS}
        onNavigate={(x, y) => setVp((prev) => ({ ...prev, x, y }))}
        {...props}
      />
      <div className="absolute bottom-3 left-3 px-2 py-1 text-[11px] rounded-md bg-black/60 text-white/80 border border-white/10">
        Camera: ({Math.round(vp.x)}, {Math.round(vp.y)})
      </div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MiniMapDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    width: { type: "number", default: 220, min: 120, max: 360, step: 20 },
    height: { type: "number", default: 150, min: 80, max: 240, step: 10 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Compact", props: { width: 140, height: 96 } },
    { label: "Large", props: { width: 320, height: 220 } },
  ],
  events: [],
  notes: "Click or drag inside the minimap to move the white viewport rect — the camera coords below update live.",
};
