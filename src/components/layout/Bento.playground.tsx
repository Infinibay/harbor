import { Bento, BentoItem } from "./Bento";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const tones = [
  "from-fuchsia-500/40 to-purple-600/30",
  "from-sky-500/40 to-cyan-600/30",
  "from-emerald-500/40 to-teal-600/30",
  "from-amber-500/40 to-orange-600/30",
  "from-pink-500/40 to-rose-600/30",
  "from-indigo-500/40 to-violet-600/30",
  "from-lime-500/40 to-green-600/30",
];

function Tile({ i, label }: { i: number; label?: string }) {
  return (
    <div
      className={`h-full w-full rounded-xl border border-white/10 bg-gradient-to-br ${tones[i % tones.length]} p-3 text-xs text-white/80`}
    >
      {label ?? `Tile ${i + 1}`}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BentoDemo(props: any) {
  return (
    <div className="w-full p-4">
      <Bento {...props}>
        <BentoItem span={{ base: { col: 2, row: 2 }, md: { col: 2, row: 2 } }}>
          <Tile i={0} label="Hero · 2x2" />
        </BentoItem>
        <BentoItem span={{ base: { col: 2, row: 1 }, md: { col: 2, row: 1 } }}>
          <Tile i={1} label="Wide · 2x1" />
        </BentoItem>
        <BentoItem span={{ md: { col: 1, row: 1 } }}>
          <Tile i={2} />
        </BentoItem>
        <BentoItem span={{ md: { col: 1, row: 1 } }}>
          <Tile i={3} />
        </BentoItem>
        <BentoItem span={{ base: { col: 2, row: 1 }, md: { col: 2, row: 1 } }}>
          <Tile i={4} label="Wide · 2x1" />
        </BentoItem>
        <BentoItem>
          <Tile i={5} />
        </BentoItem>
        <BentoItem span={{ md: { col: 2, row: 1 } }}>
          <Tile i={6} label="Wide · 2x1" />
        </BentoItem>
      </Bento>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: BentoDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    gap: { type: "number", min: 0, max: 32, step: 2, default: 12 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Tighter", props: { gap: 6 } },
    { label: "Roomy", props: { gap: 24 } },
  ],
  events: [],
  notes:
    "Resize the playground frame (or drag a SplitPane) to watch tiles reflow with FLIP animations as the container crosses breakpoints.",
};
