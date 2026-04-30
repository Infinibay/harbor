import { useState } from "react";
import { ContentSwap, type ContentSwapVariant } from "./ContentSwap";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const PAGES = [
  { id: "home", title: "Home", body: "Welcome aboard." },
  { id: "docs", title: "Docs", body: "Components, hooks, and tokens." },
  { id: "blog", title: "Blog", body: "Engineering retrospectives." },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContentSwapDemo(props: any) {
  const [idx, setIdx] = useState(0);
  const page = PAGES[idx];
  return (
    <div className="flex flex-col gap-3" style={{ minWidth: 360 }}>
      <div className="flex gap-1.5">
        {PAGES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIdx(i)}
            className={
              "px-3 py-1.5 rounded-md text-xs " +
              (i === idx
                ? "bg-fuchsia-500/30 text-white"
                : "bg-white/5 text-white/70 hover:bg-white/10")
            }
          >
            {p.title}
          </button>
        ))}
      </div>
      <ContentSwap
        id={page.id}
        variant={(props.variant ?? "fade") as ContentSwapVariant}
        mode={props.mode ?? "wait"}
        duration={props.duration ?? 160}
        className={props.mode === "crossfade" ? "relative min-h-[120px]" : ""}
      >
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="text-white text-lg font-semibold">{page.title}</div>
          <p className="text-sm text-white/60 mt-1">{page.body}</p>
        </div>
      </ContentSwap>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ContentSwapDemo as never,
  importPath: "@infinibay/harbor/motion",
  controls: {
    variant: {
      type: "select",
      options: ["fade", "fade-up", "fade-down", "scale", "blur", "slide-left", "slide-right", "none"],
      default: "fade-up",
    },
    mode: {
      type: "select",
      options: ["wait", "sync", "crossfade"],
      default: "wait",
      description: "wait = blank gap; sync = stack; crossfade = absolute, needs sized wrapper.",
    },
    duration: { type: "number", default: 160, min: 60, max: 800, step: 20, description: "Single-side duration in ms." },
  },
  variants: [
    { label: "Fade up", props: { variant: "fade-up", mode: "wait" } },
    { label: "Slide left", props: { variant: "slide-left", mode: "wait" } },
    { label: "Crossfade · scale", props: { variant: "scale", mode: "crossfade" } },
    { label: "Blur", props: { variant: "blur", mode: "wait" } },
  ],
  notes:
    "Click the page tabs to fire transitions. Switch to crossfade to see absolute-positioned overlap (no blank frame).",
};
