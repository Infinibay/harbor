import { Canvas, CanvasItem } from "./Canvas";
import {
  CanvasOrbit,
  CanvasPulse,
  CanvasFloat,
  CanvasJiggle,
  CanvasFollowPath,
} from "./CanvasMotion";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CanvasMotionDemo(props: any) {
  const paused = Boolean(props.paused);
  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-white/10">
      <Canvas grid="dots">
        {/* Orbit */}
        <CanvasItem x={180} y={140} bounds={false}>
          <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center text-[10px] uppercase tracking-widest text-white/50">
            sun
          </div>
        </CanvasItem>
        <CanvasOrbit cx={180} cy={140} radius={70} duration={6} paused={paused}>
          <div className="w-4 h-4 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.7)]" />
        </CanvasOrbit>
        <CanvasOrbit cx={180} cy={140} radius={110} duration={10} startAngle={120} paused={paused}>
          <div className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]" />
        </CanvasOrbit>

        {/* Pulse */}
        <CanvasItem x={420} y={120} bounds={false}>
          <CanvasPulse scale={[1, 1.18]} opacity={[0.7, 1]} paused={paused}>
            <div className="px-3 py-2 rounded-lg bg-emerald-500/25 border border-emerald-300/50 text-xs">
              live
            </div>
          </CanvasPulse>
        </CanvasItem>

        {/* Float */}
        <CanvasItem x={420} y={220} bounds={false}>
          <CanvasFloat amplitude={10} duration={2.4} paused={paused}>
            <div className="px-3 py-2 rounded-lg bg-amber-500/25 border border-amber-300/50 text-xs">
              float
            </div>
          </CanvasFloat>
        </CanvasItem>

        {/* Jiggle */}
        <CanvasItem x={420} y={320} bounds={false}>
          <CanvasJiggle amplitude={3} frequency={4} rotate paused={paused}>
            <div className="px-3 py-2 rounded-lg bg-rose-500/25 border border-rose-300/50 text-xs">
              jiggle
            </div>
          </CanvasJiggle>
        </CanvasItem>

        {/* FollowPath */}
        <CanvasFollowPath
          d="M 60 380 Q 220 260 380 380 T 700 380"
          duration={5}
          rotate
          showPath
          paused={paused}
        >
          <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
        </CanvasFollowPath>
      </Canvas>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CanvasMotionDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    paused: { type: "boolean", default: false, description: "Pause every motion primitive at once." },
  },
  variants: [
    { label: "Animating", props: {} },
    { label: "Paused", props: { paused: true } },
  ],
  events: [],
  notes:
    "Demo uses every primitive in CanvasMotion: orbit (planets), pulse, float, jiggle, follow-path. They all live inside the same <Canvas>.",
};
