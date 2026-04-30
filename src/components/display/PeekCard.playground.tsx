import { PeekCard } from "./PeekCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const fakeMedia = (
  <div className="aspect-video w-full bg-gradient-to-br from-fuchsia-500/40 via-sky-500/30 to-emerald-500/40" />
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PeekCardDemo(props: any) {
  return (
    <div className="w-80">
      <PeekCard
        {...props}
        title={props.title ?? "Living UI library"}
        description={props.description ?? "Hover to peek at the details panel."}
        media={fakeMedia}
        more={
          <div className="space-y-2 text-sm text-white/70">
            <p>Detail content shown on hover. Use it for previews of related items, search results, or anything that benefits from a quick look without a click.</p>
            <p className="text-white/50">Move the cursor away to dismiss.</p>
          </div>
        }
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: PeekCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    title: { type: "text", default: "Living UI library" },
    description: { type: "text", default: "Hover to peek at the details panel." },
  },
};
