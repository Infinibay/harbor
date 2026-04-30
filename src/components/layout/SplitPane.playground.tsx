import { SplitPane } from "./SplitPane";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const First = (
  <div className="h-full w-full bg-fuchsia-500/15 p-4 text-sm text-white/80">
    <div className="text-xs uppercase tracking-[0.18em] text-white/40">First pane</div>
    <ul className="mt-3 space-y-1.5 text-white/70">
      <li>· Inbox</li>
      <li>· Drafts</li>
      <li>· Sent</li>
      <li>· Archive</li>
    </ul>
  </div>
);

const Second = (
  <div className="h-full w-full bg-sky-500/10 p-4 text-sm text-white/80">
    <div className="text-xs uppercase tracking-[0.18em] text-white/40">Second pane</div>
    <p className="mt-3 text-white/70">
      Drag the gutter to resize. The trailing pane fills the remaining
      space and scrolls independently.
    </p>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SplitPaneDemo(props: any) {
  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-white/10">
      <SplitPane first={First} second={Second} {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SplitPaneDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    orientation: { type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    initialSize: { type: "number", min: 80, max: 600, step: 10, default: 240 },
    min: { type: "number", min: 40, max: 400, step: 10, default: 120 },
    max: { type: "number", min: 200, max: 800, step: 10, default: 500 },
    collapsible: { type: "boolean", default: true },
  },
  variants: [
    { label: "Horizontal · collapsible", props: { orientation: "horizontal", collapsible: true } },
    { label: "Vertical", props: { orientation: "vertical", initialSize: 140 } },
  ],
  events: [],
  notes:
    "Double-click the gutter when `collapsible` is on to fold / unfold the first pane.",
};
