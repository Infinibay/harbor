import { Card } from "./Card";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CardDemo(props: any) {
  return (
    <div className="relative w-full grid place-items-center py-8 px-4 overflow-hidden rounded-2xl">
      {/* Backdrop — gradient blobs so the glass variant has something to blur */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(closest-side at 25% 30%, rgba(168,85,247,0.55), transparent 70%)," +
            "radial-gradient(closest-side at 75% 70%, rgba(56,189,248,0.55), transparent 70%)," +
            "radial-gradient(closest-side at 80% 20%, rgba(244,114,182,0.45), transparent 70%)," +
            "linear-gradient(135deg, #0a0a14, #14141c)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <Card {...props} className="w-80">
        <div className="p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-white/40">Project</div>
          <h3 className="mt-1 text-lg font-medium tracking-tight">harbor-site</h3>
          <p className="mt-2 text-sm text-white/60">
            Marketing site + showcase for the Harbor component library.
          </p>
        </div>
      </Card>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    variant: { type: "select", options: ["default", "glass", "solid"], default: "default" },
    interactive: { type: "boolean", default: false },
    tilt: { type: "boolean", default: false, description: "3D tilt on cursor proximity." },
    spotlight: { type: "boolean", default: false, description: "Cursor-following gradient spotlight." },
    spotlightStrength: {
      type: "select",
      options: ["quiet", "soft", "strong"],
      default: "strong",
      description: "Spotlight intensity. Quiet = prose, soft = forms/tables, strong = decorative.",
    },
    glow: { type: "boolean", default: false },
    selected: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Solid", props: { variant: "solid" } },
    { label: "Glass", props: { variant: "glass" } },
    { label: "Interactive · spotlight (strong)", props: { interactive: true, spotlight: true, spotlightStrength: "strong" } },
    { label: "Spotlight (soft)", props: { interactive: true, spotlight: true, spotlightStrength: "soft" } },
    { label: "Spotlight (quiet)", props: { interactive: true, spotlight: true, spotlightStrength: "quiet" } },
    { label: "Tilting", props: { tilt: true } },
    { label: "Selected", props: { selected: true } },
  ],
  notes:
    "The demo wraps the card in a textured backdrop (gradient blobs + grid) so the `glass` variant's backdrop-blur has something to blur against.",
};
