import { Container } from "./Container";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContainerDemo(props: any) {
  return (
    <div style={{ width: "100%" }}>
      <Container {...props}>
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-sm text-white/70">
          <div className="text-xs uppercase tracking-widest text-white/40">
            Container
          </div>
          <div className="mt-2 text-white/85">
            This block is centered and constrained by the active{" "}
            <code className="text-white/70">size</code> preset.
          </div>
        </div>
      </Container>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ContainerDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    size: {
      type: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "prose", "full"],
      default: "xl",
    },
    padded: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default (xl)", props: {} },
    { label: "Prose", props: { size: "prose" } },
    { label: "Small", props: { size: "sm" } },
    { label: "Full width", props: { size: "full" } },
    { label: "No padding", props: { padded: false } },
  ],
  events: [],
};
