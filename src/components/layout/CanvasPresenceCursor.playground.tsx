import { useEffect, useState } from "react";
import { Canvas, CanvasItem } from "./Canvas";
import { CanvasPresenceCursor } from "./CanvasPresenceCursor";
import type { PresenceUser } from "../../lib/useCanvasPresence";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const SEEDS: PresenceUser[] = [
  { id: "u1", name: "Ada", color: "#f472b6", cursor: { x: 120, y: 120 } },
  { id: "u2", name: "Linus", color: "#38bdf8", cursor: { x: 320, y: 220 } },
  { id: "u3", name: "Grace", color: "#a855f7", cursor: { x: 480, y: 140 } },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasPresenceCursorDemo(props: any) {
  const [users, setUsers] = useState(SEEDS);

  // Animate the seeded cursors so the spring smoothing is visible.
  useEffect(() => {
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.012;
      setUsers((prev) =>
        prev.map((u, i) => ({
          ...u,
          cursor: u.cursor
            ? {
                x: 200 + Math.cos(t + i * 1.7) * 160 + i * 90,
                y: 180 + Math.sin(t * 1.3 + i * 0.6) * 90,
              }
            : undefined,
        })),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <Canvas grid="dots">
        <CanvasItem x={80} y={80}>
          <div className="w-48 h-32 rounded-lg bg-[#1a1a24] border border-white/10 grid place-items-center text-sm text-white/70">
            Shared canvas
          </div>
        </CanvasItem>
        {users.map((u) => (
          <CanvasPresenceCursor key={u.id} user={u} {...props} />
        ))}
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasPresenceCursorDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    showLabel: { type: "boolean", default: true },
    stiffness: { type: "number", default: 260, min: 60, max: 600, step: 20 },
    damping: { type: "number", default: 28, min: 8, max: 60, step: 2 },
    awayOpacity: { type: "number", default: 0.35, min: 0, max: 1, step: 0.05 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "No label", props: { showLabel: false } },
    { label: "Snappy spring", props: { stiffness: 480, damping: 36 } },
  ],
  events: [],
  notes:
    "Three seeded cursors orbit the canvas so you can feel the per-cursor spring smoothing. Pan/zoom — the glyphs stay pixel-accurate.",
};
