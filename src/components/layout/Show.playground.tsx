import { Show, Hide } from "./Show";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ShowDemo(props: any) {
  return (
    <div className="flex w-full flex-col gap-3 p-4 text-sm text-white/80">
      <Show {...props}>
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3">
          Visible — the configured Show condition is true.
        </div>
      </Show>
      <Hide {...props}>
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/15 px-4 py-3">
          Hidden when Show is visible (this is the Hide twin).
        </div>
      </Hide>
      <div className="text-xs text-white/40">
        Resize the viewport to flip the condition.
      </div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ShowDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    above: { type: "select", options: ["", "sm", "md", "lg", "xl", "2xl"], default: "md" },
    below: { type: "select", options: ["", "sm", "md", "lg", "xl", "2xl"], default: "" },
    animate: { type: "select", options: ["fade", "slide", "scale", "false"], default: "fade" },
  },
  variants: [
    { label: "Above md", props: { above: "md" } },
    { label: "Below lg", props: { below: "lg" } },
    { label: "Slide animation", props: { above: "md", animate: "slide" } },
    { label: "Scale animation", props: { above: "md", animate: "scale" } },
  ],
  events: [],
  notes:
    "All conditions AND together. Empty string controls map to undefined (no constraint).",
};
