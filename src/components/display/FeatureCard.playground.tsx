import { FeatureCard } from "./FeatureCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FeatureCardDemo(props: any) {
  return <FeatureCard {...props} icon={<span>✦</span>} />;
}

export const playground: PlaygroundManifest = {
  component: FeatureCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    title: { type: "text", default: "Reacts to the cursor" },
    description: { type: "text", default: "A global cursor-proximity hook lets components respond to nearby motion." },
    href: { type: "text", default: "#" },
    linkLabel: { type: "text", default: "Learn more" },
    accent: { type: "select", options: ["fuchsia", "sky", "emerald", "amber", "rose"], default: "fuchsia" },
  },
  variants: [
    { label: "Fuchsia", props: { accent: "fuchsia" } },
    { label: "Sky", props: { accent: "sky" } },
    { label: "Emerald", props: { accent: "emerald" } },
  ],
};
