import { HoverCard } from "./HoverCard";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HoverCardDemo(props: any) {
  return (
    <HoverCard
      {...props}
      content={
        <div className="p-4 text-sm w-64">
          <div className="font-medium mb-1">@ana</div>
          <div className="text-white/60">Engineer · Infrastructure</div>
          <p className="mt-2 text-white/70">Builds the things that build the things.</p>
        </div>
      }
    >
      <a className="text-fuchsia-300 underline-offset-2 hover:underline">@ana</a>
    </HoverCard>
  );
}

export const playground: PlaygroundManifest = {
  component: HoverCardDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {
    side: { type: "select", options: ["top", "bottom"], default: "bottom" },
    delay: { type: "number", default: 300, min: 0, max: 1500, step: 50 },
  },
  variants: [
    { label: "Bottom", props: { side: "bottom" } },
    { label: "Top", props: { side: "top" } },
    { label: "Instant", props: { delay: 0 } },
  ],
};
