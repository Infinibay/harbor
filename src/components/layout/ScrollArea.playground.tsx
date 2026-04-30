import { ScrollArea } from "./ScrollArea";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ScrollAreaDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 420 }} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <ScrollArea {...props}>
        <ul className="flex flex-col gap-2 pr-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <li
              key={i}
              className="rounded-lg border border-white/8 bg-white/[0.03] p-3 text-sm text-white/80"
            >
              <div className="text-xs uppercase tracking-widest text-white/40">
                Item {i + 1}
              </div>
              <div className="mt-1">
                Some scrollable content. Hover the right edge or scroll to see
                the thumb.
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ScrollAreaDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    maxHeight: { type: "number", default: 280, min: 120, max: 600, step: 20 },
    thumbTone: {
      type: "select",
      options: ["purple", "white"],
      default: "purple",
    },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Tall", props: { maxHeight: 480 } },
    { label: "White thumb", props: { thumbTone: "white" } },
  ],
  events: [],
};
