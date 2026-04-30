import { VirtualList } from "./VirtualList";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

type Item = { id: number; name: string; cpu: number };

const sampleItems: Item[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: `vm-node-${String(i).padStart(4, "0")}`,
  cpu: (i * 13) % 100,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VirtualListDemo(props: any) {
  return (
    <div style={{ width: "100%" }}>
      <VirtualList<Item>
        items={sampleItems}
        itemHeight={props.itemHeight ?? 36}
        height={props.height ?? 400}
        overscan={props.overscan ?? 6}
        keyFor={(it) => it.id}
        renderItem={(it) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 14px",
              height: "100%",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.35)", width: 56 }}>
              #{it.id}
            </span>
            <span style={{ flex: 1 }}>{it.name}</span>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>
              {it.cpu}% cpu
            </span>
          </div>
        )}
        className="rounded-lg border border-white/10"
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: VirtualListDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {
    itemHeight: { type: "number", default: 36, min: 20, max: 96, step: 2 },
    height: { type: "number", default: 400, min: 200, max: 720, step: 20 },
    overscan: { type: "number", default: 6, min: 0, max: 30, step: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Dense rows", props: { itemHeight: 24 } },
    { label: "Tall rows", props: { itemHeight: 64 } },
    { label: "Tall viewport", props: { height: 600 } },
  ],
};
