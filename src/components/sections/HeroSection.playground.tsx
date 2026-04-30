import { HeroSection } from "./HeroSection";
import { Button } from "../../components/buttons/Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeroSectionDemo(props: any) {
  return (
    <HeroSection
      {...props}
      eyebrow={props.eyebrow ?? "v0.4 · just shipped"}
      title={props.title ?? "Build interfaces that feel alive."}
      highlight={props.highlight ?? "alive"}
      description={props.description ?? "120 React components that respond to the cursor and coordinate with their siblings."}
      primaryCta={<Button variant="primary">Get started</Button>}
      secondaryCta={<Button variant="ghost">Read the docs</Button>}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: HeroSectionDemo as never,
  importPath: "@infinibay/harbor/sections",
  controls: {
    layout: { type: "select", options: ["centered", "split"], default: "centered" },
    eyebrow: { type: "text", default: "v0.4 · just shipped" },
    title: { type: "text", default: "Build interfaces that feel alive." },
    highlight: { type: "text", default: "alive", description: "Optional second line rendered below `title` with the brand gradient." },
    description: { type: "text", default: "120 React components that respond to the cursor and coordinate with their siblings." },
  },
  variants: [
    { label: "Centered", props: { layout: "centered" } },
    { label: "Split", props: { layout: "split" } },
  ],
};
