import { LoadingOverlay } from "./LoadingOverlay";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LoadingOverlayDemo(props: any) {
  return (
    <div className="relative h-44 w-full max-w-md rounded-xl border border-white/10 bg-white/[0.02]">
      <LoadingOverlay
        {...props}
        fill
        progress={
          props.withProgress
            ? { done: props.done ?? 7, total: props.total ?? 12 }
            : undefined
        }
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: LoadingOverlayDemo as never,
  importPath: "@infinibay/harbor/feedback",
  controls: {
    label: { type: "text", default: "Applying template…" },
    size: { type: "number", default: 32, min: 16, max: 80, step: 4 },
    withProgress: { type: "boolean", default: false, description: "Show determinate progress bar." },
    done: { type: "number", default: 7, min: 0, max: 100 },
    total: { type: "number", default: 12, min: 1, max: 100 },
  },
  variants: [
    { label: "Indeterminate", props: { withProgress: false } },
    { label: "Determinate", props: { withProgress: true, done: 7, total: 12 } },
    { label: "Determinate · near done", props: { withProgress: true, done: 11, total: 12 } },
  ],
};
