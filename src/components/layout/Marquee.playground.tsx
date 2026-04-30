import { Marquee } from "./Marquee";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const tags = ["React", "TypeScript", "Tailwind", "Framer Motion", "Vite", "Storybook", "Vitest", "Playwright"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MarqueeDemo(props: any) {
  return (
    <div className="w-full">
      <Marquee {...props}>
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center h-8 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white/80"
          >
            {t}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MarqueeDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    speed: { type: "number", default: 40, min: 10, max: 200, step: 5, description: "Pixels per second." },
    direction: { type: "select", options: ["left", "right", "up", "down"], default: "left" },
    pauseOnHover: { type: "boolean", default: true },
    gap: { type: "number", default: 32, min: 0, max: 96, step: 4 },
    fade: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Fast", props: { speed: 120 } },
    { label: "Reverse", props: { direction: "right" } },
    { label: "No fade", props: { fade: false } },
  ],
  events: [],
  notes: "Hover the strip to pause when pauseOnHover is on.",
};
