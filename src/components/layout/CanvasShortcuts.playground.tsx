import { useState } from "react";
import { Canvas, CanvasItem } from "./Canvas";
import { CanvasShortcuts } from "./CanvasShortcuts";
import { CanvasStatusBar } from "./CanvasStatusBar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

interface Node {
  id: string;
  x: number;
  y: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasShortcutsDemo(_props: any) {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "a", x: 160, y: 160 },
    { id: "b", x: 380, y: 240 },
    { id: "c", x: 220, y: 340 },
  ]);
  const [selection, setSelection] = useState<Set<string>>(new Set(["a"]));
  const [log, setLog] = useState<string[]>([]);

  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 5));

  const nudge = (dx: number, dy: number) => {
    setNodes((ns) =>
      ns.map((n) => (selection.has(n.id) ? { ...n, x: n.x + dx, y: n.y + dy } : n)),
    );
  };

  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10 outline-none" tabIndex={0}>
      <CanvasShortcuts
        onDelete={() => {
          push("delete");
          setNodes((ns) => ns.filter((n) => !selection.has(n.id)));
          setSelection(new Set());
        }}
        onDuplicate={() => {
          push("duplicate");
          setNodes((ns) => {
            const copies = ns
              .filter((n) => selection.has(n.id))
              .map((n) => ({ ...n, id: n.id + "'", x: n.x + 30, y: n.y + 30 }));
            return [...ns, ...copies];
          });
        }}
        onSelectAll={() => {
          push("select all");
          setSelection(new Set(nodes.map((n) => n.id)));
        }}
        onEscape={() => {
          push("escape");
          setSelection(new Set());
        }}
        onUndo={() => push("undo")}
        onRedo={() => push("redo")}
        onNudge={({ dx, dy, big }) => {
          push(`nudge ${dx},${dy}${big ? " (big)" : ""}`);
          nudge(dx, dy);
        }}
      />
      <Canvas
        grid="dots"
        overlay={
          <CanvasStatusBar
            left={<span>{selection.size} selected</span>}
            right={
              <span className="font-mono text-[10px] text-white/50 truncate max-w-[260px]">
                {log[0] ?? "press Delete · Cmd+D · arrows · Cmd+A · Esc"}
              </span>
            }
          />
        }
      >
        {nodes.map((n) => {
          const active = selection.has(n.id);
          return (
            <CanvasItem
              key={n.id}
              id={n.id}
              x={n.x}
              y={n.y}
              draggable
              onDrag={(p) => setNodes((ns) => ns.map((it) => (it.id === n.id ? { ...it, x: p.x, y: p.y } : it)))}
            >
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelection((s) => {
                    const ns = new Set(e.shiftKey ? s : []);
                    ns.add(n.id);
                    return ns;
                  });
                }}
                className={
                  "px-4 py-3 rounded-lg text-sm border " +
                  (active
                    ? "bg-fuchsia-500/30 border-fuchsia-300/70"
                    : "bg-white/5 border-white/15")
                }
              >
                Node {n.id}
              </div>
            </CanvasItem>
          );
        })}
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasShortcutsDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {},
  variants: [{ label: "Default", props: {} }],
  events: [],
  notes:
    "Click the demo to focus it, then try Delete, Cmd/Ctrl+D, Cmd/Ctrl+A, Escape, arrow keys (Shift for big nudge), Cmd/Ctrl+Z.",
};
