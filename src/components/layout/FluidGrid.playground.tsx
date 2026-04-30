import { FluidGrid } from "./FluidGrid";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const tones = [
  "from-fuchsia-500/40 to-purple-600/30",
  "from-sky-500/40 to-cyan-600/30",
  "from-emerald-500/40 to-teal-600/30",
  "from-amber-500/40 to-orange-600/30",
  "from-pink-500/40 to-rose-600/30",
  "from-indigo-500/40 to-violet-600/30",
  "from-lime-500/40 to-green-600/30",
  "from-rose-500/40 to-red-600/30",
  "from-teal-500/40 to-emerald-600/30",
];

function Tile({ i }: { i: number }) {
  return (
    <div
      className={`h-28 rounded-xl border border-white/10 bg-gradient-to-br ${tones[i % tones.length]} p-3 text-xs text-white/80`}
    >
      Item {i + 1}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FluidGridDemo(props: any) {
  return (
    <div className="w-full p-4">
      <FluidGrid {...props}>
        {Array.from({ length: 9 }).map((_, i) => (
          <Tile key={i} i={i} />
        ))}
      </FluidGrid>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FluidGridDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    minItemWidth: { type: "number", min: 100, max: 480, step: 10, default: 220 },
    maxColumns: { type: "number", min: 0, max: 8, step: 1, default: 0 },
    gap: { type: "number", min: 0, max: 32, step: 2, default: 16 },
    animate: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Dense (140px floor)", props: { minItemWidth: 140 } },
    { label: "Capped at 3 cols", props: { maxColumns: 3 } },
    { label: "No animation", props: { animate: false } },
  ],
  events: [],
  notes:
    "Resize the frame to watch columns auto-fit. Animations FLIP each item between its old and new cell on every reflow.",
};
