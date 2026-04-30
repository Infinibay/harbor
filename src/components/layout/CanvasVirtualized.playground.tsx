import { useMemo } from "react";
import { Canvas, CanvasItem } from "./Canvas";
import { CanvasVirtualized } from "./CanvasVirtualized";
import { CanvasStatusBar } from "./CanvasStatusBar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

interface Item {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hue: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasVirtualizedDemo(props: any) {
  const count = Number(props.count ?? 400);
  const buffer = Number(props.buffer ?? 200);
  const disabled = Boolean(props.disabled);

  const items = useMemo<Item[]>(() => {
    const out: Item[] = [];
    const cols = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
      const cx = i % cols;
      const cy = Math.floor(i / cols);
      out.push({
        id: `n-${i}`,
        x: cx * 90,
        y: cy * 90,
        width: 70,
        height: 60,
        hue: (i * 23) % 360,
      });
    }
    return out;
  }, [count]);

  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10">
      <Canvas grid="dots" overlay={<CanvasStatusBar left={<span>{items.length} total items</span>} />}>
        <CanvasVirtualized
          items={items}
          buffer={buffer}
          disabled={disabled}
          renderItem={(it) => (
            <CanvasItem key={it.id} id={it.id} x={it.x} y={it.y}>
              <div
                style={{
                  width: it.width,
                  height: it.height,
                  background: `hsl(${it.hue} 80% 55% / 0.25)`,
                  border: `1px solid hsl(${it.hue} 80% 70% / 0.5)`,
                }}
                className="rounded-md grid place-items-center text-[10px] font-mono text-white/70"
              >
                {it.id}
              </div>
            </CanvasItem>
          )}
        />
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasVirtualizedDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    count: { type: "number", min: 50, max: 4000, step: 50, default: 400 },
    buffer: { type: "number", min: 0, max: 1000, step: 50, default: 200 },
    disabled: { type: "boolean", default: false, description: "Render every item, even off-screen." },
  },
  variants: [
    { label: "400 items · buffered", props: { count: 400 } },
    { label: "2000 items", props: { count: 2000 } },
    { label: "Virtualization off", props: { count: 800, disabled: true } },
  ],
  events: [],
  notes:
    "Pan around (space+drag or middle-click) and zoom out — only items intersecting the viewport (± buffer) are mounted.",
};
