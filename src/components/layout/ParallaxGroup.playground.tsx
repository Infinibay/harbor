import { ParallaxGroup, ParallaxLayer } from "./ParallaxGroup";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ParallaxGroupDemo(props: any) {
  return (
    <div className="w-full p-4">
      <ParallaxGroup
        {...props}
        className="relative h-80 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/40 via-fuchsia-900/30 to-sky-900/40"
      >
        <ParallaxLayer depth={0.15} className="absolute inset-0">
          <div
            className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-fuchsia-500/30 blur-2xl"
          />
          <div
            className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-sky-500/30 blur-2xl"
          />
        </ParallaxLayer>
        <ParallaxLayer depth={0.4} className="absolute inset-0 grid place-items-center">
          <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.22em] text-white/60 backdrop-blur">
            Mid layer
          </div>
        </ParallaxLayer>
        <ParallaxLayer depth={0.8} tilt={0.4} className="absolute inset-0 grid place-items-center">
          <div className="rounded-xl border border-white/20 bg-black/40 px-6 py-4 text-lg font-medium text-white shadow-2xl backdrop-blur">
            Foreground · depth 0.8
          </div>
        </ParallaxLayer>
        <ParallaxLayer depth={-0.3} className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/40">
            Move your cursor
          </div>
        </ParallaxLayer>
      </ParallaxGroup>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ParallaxGroupDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    strength: { type: "number", min: 0, max: 80, step: 2, default: 24 },
    radius: { type: "number", min: 100, max: 800, step: 20, default: 420 },
    perspective: { type: "number", min: 0, max: 1600, step: 50, default: 800 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Strong", props: { strength: 48 } },
    { label: "No perspective", props: { perspective: 0 } },
  ],
  events: [],
  notes:
    "Move the cursor across the frame. Layers with higher `depth` translate more; the foreground tile also tilts in 3D.",
};
