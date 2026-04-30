import { ExpandingSearch } from "./ExpandingSearch";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ExpandingSearchDemo(props: any) {
  return (
    <div className="w-full max-w-md">
      <ExpandingSearch {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ExpandingSearchDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    placeholder: { type: "text", default: "Search" },
    autoCollapseOnEmpty: { type: "boolean", default: false, description: "Collapse on blur when empty." },
    iconSize: { type: "number", default: 16, min: 12, max: 24, step: 1 },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Auto-collapse", props: { autoCollapseOnEmpty: true, placeholder: "Filter..." } },
  ],
  events: [
    { name: "onChange", signature: "(q: string) => void" },
    { name: "onOpenChange", signature: "(v: boolean) => void" },
  ],
  notes: "Click the magnifier to expand. Esc collapses.",
};
