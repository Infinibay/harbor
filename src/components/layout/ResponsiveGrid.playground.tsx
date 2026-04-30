import { ResponsiveGrid } from "./ResponsiveGrid";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const tones = [
  "from-fuchsia-500/40 to-purple-600/30",
  "from-sky-500/40 to-cyan-600/30",
  "from-emerald-500/40 to-teal-600/30",
  "from-amber-500/40 to-orange-600/30",
  "from-pink-500/40 to-rose-600/30",
  "from-indigo-500/40 to-violet-600/30",
];

function Tile({ i }: { i: number }) {
  return (
    <div
      className={`h-24 rounded-xl border border-white/10 bg-gradient-to-br ${tones[i % tones.length]} p-3 text-xs text-white/80`}
    >
      Item {i + 1}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResponsiveGridDemo(props: any) {
  return (
    <div className="w-full p-4">
      <ResponsiveGrid {...props}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Tile key={i} i={i} />
        ))}
      </ResponsiveGrid>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ResponsiveGridDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    gap: { type: "number", min: 0, max: 12, step: 1, default: 4 },
  },
  variants: [
    { label: "1 / 2 / 3 cols", props: { columns: { base: 1, md: 2, lg: 3 } } },
    { label: "2 / 4 cols", props: { columns: { base: 2, md: 4 } } },
    { label: "Single column", props: { columns: 1 } },
    { label: "Six fixed", props: { columns: 6 } },
  ],
  events: [],
  notes:
    "Driven purely by Tailwind media queries — resize the viewport (not the container) to see the column count change.",
};
