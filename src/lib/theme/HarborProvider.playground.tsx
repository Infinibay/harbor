import { HarborProvider, type HarborDensity, type HarborTarget } from "./HarborProvider";
import type { PlaygroundManifest } from "../../../../web/src/harbor/lib/playground";

function HarborProviderDemo(props: {
  target?: HarborTarget;
  density?: HarborDensity;
}) {
  return (
    <HarborProvider
      target={props.target ?? "webapp"}
      density={props.density ?? "comfortable"}
      className="w-full max-w-xl rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] bg-[var(--harbor-workbench-panel-bg)] p-[var(--harbor-target-panel-padding)] shadow-[var(--harbor-target-shadow)]"
    >
      <div className="flex items-center justify-between gap-[var(--harbor-target-gap)]">
        <div>
          <div className="text-[length:var(--harbor-target-font-size)] font-semibold text-[color:var(--harbor-field-fg)]">
            Adaptive target scope
          </div>
          <div className="mt-1 text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-muted-fg)]">
            Components inside this provider read target and density tokens.
          </div>
        </div>
        <button
          type="button"
          className="min-h-[var(--harbor-target-control-height)] rounded-[var(--harbor-target-radius)] bg-brand px-[var(--harbor-target-control-padding-x)] text-[length:var(--harbor-target-font-size)] font-medium text-brand-fg"
        >
          Action
        </button>
      </div>
    </HarborProvider>
  );
}

export const playground: PlaygroundManifest = {
  component: HarborProviderDemo as never,
  importPath: "@infinibay/harbor/theme",
  defaultChildren: "<App />",
  controls: {
    target: {
      type: "select",
      default: "webapp",
      options: ["desktop-app", "webapp", "website", "mobile", "tablet"],
    },
    density: {
      type: "select",
      default: "comfortable",
      options: ["compact", "comfortable", "spacious"],
    },
  },
  variants: [
    {
      label: "Desktop app",
      props: { target: "desktop-app", density: "compact" },
      description: "Dense spacing, smaller radii, and editor-style controls.",
    },
    {
      label: "Web app",
      props: { target: "webapp", density: "comfortable" },
      description: "Balanced dashboard/application defaults.",
    },
    {
      label: "Website",
      props: { target: "website", density: "spacious" },
      description: "Larger, softer defaults for marketing and content pages.",
    },
  ],
  notes:
    "The real provider also manages themes and persistence. This preview focuses on target and density tokens.",
};
