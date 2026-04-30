import { ReflowList } from "./ReflowList";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const labels = [
  "All",
  "Open",
  "Closed",
  "Archived",
  "Drafts",
  "Mentioned",
  "Assigned",
  "Reviewed",
  "Starred",
  "Recent",
];

function Chip({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
      {label}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ReflowListDemo(props: any) {
  return (
    <div className="w-full p-4">
      <ReflowList {...props}>
        {labels.map((l) => (
          <Chip key={l} label={l} />
        ))}
      </ReflowList>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ReflowListDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    gap: { type: "number", min: 0, max: 24, step: 2, default: 8 },
    align: { type: "select", options: ["start", "center", "end", "stretch"], default: "center" },
    justify: { type: "select", options: ["start", "center", "end", "between"], default: "start" },
    wrap: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Justify between", props: { justify: "between" } },
    { label: "No wrap", props: { wrap: false } },
  ],
  events: [],
  notes:
    "Resize the frame to watch chips slide between rows. The reflow detector buckets width into ~64px steps to avoid jitter.",
};
