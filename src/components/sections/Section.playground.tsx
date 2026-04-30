import { Section } from "./Section";
import { Button } from "../../components/buttons/Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectionDemo(props: any) {
  return (
    <Section
      {...props}
      kicker={props.kicker ?? "Why Harbor"}
      title={props.title ?? "A UI library shaped like a product."}
      description={props.description ?? "Most libraries hand you flat building blocks. Harbor hands you a system that already knows how to behave."}
      actions={<Button variant="ghost">Read more →</Button>}
    >
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/60">
        (Section body. Place anything here.)
      </div>
    </Section>
  );
}

export const playground: PlaygroundManifest = {
  component: SectionDemo as never,
  importPath: "@infinibay/harbor/sections",
  controls: {
    align: { type: "select", options: ["left", "center"], default: "left" },
    spacing: { type: "select", options: ["compact", "default", "loose"], default: "default" },
    kicker: { type: "text", default: "Why Harbor" },
    title: { type: "text", default: "A UI library shaped like a product." },
  },
  variants: [
    { label: "Left", props: { align: "left" } },
    { label: "Center", props: { align: "center" } },
    { label: "Compact", props: { spacing: "compact" } },
    { label: "Loose", props: { spacing: "loose" } },
  ],
};
