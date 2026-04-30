import { ResponsiveSwap } from "./ResponsiveSwap";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const Mobile = (
  <div className="rounded-xl border border-white/10 bg-fuchsia-500/20 p-6 text-center text-sm text-white/80">
    Mobile variant
    <div className="mt-1 text-xs text-white/50">A compact, single-column layout.</div>
  </div>
);

const Desktop = (
  <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-sky-500/20 p-6 text-sm text-white/80">
    <div>Desktop · A</div>
    <div>Desktop · B</div>
    <div>Desktop · C</div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResponsiveSwapDemo(props: any) {
  return (
    <div className="w-full p-4">
      <ResponsiveSwap mobile={Mobile} desktop={Desktop} {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ResponsiveSwapDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    above: { type: "select", options: ["sm", "md", "lg", "xl", "2xl"], default: "md" },
    animate: { type: "select", options: ["fade", "slide", "false"], default: "fade" },
  },
  variants: [
    { label: "Fade @ md", props: { above: "md", animate: "fade" } },
    { label: "Slide @ lg", props: { above: "lg", animate: "slide" } },
    { label: "No animation", props: { animate: false } },
  ],
  events: [],
  notes:
    "Resize the viewport across the chosen breakpoint to swap variants. Only the active subtree is mounted.",
};
