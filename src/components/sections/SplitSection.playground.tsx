import { SplitSection } from "./SplitSection";
import { Button } from "../../components/buttons/Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const fakeMedia = (
  <div className="aspect-[4/3] w-full rounded-xl border border-white/10 bg-gradient-to-br from-fuchsia-500/40 via-sky-500/30 to-emerald-500/40" />
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SplitSectionDemo(props: any) {
  return (
    <SplitSection
      {...props}
      kicker={props.kicker ?? "Theming"}
      title={props.title ?? "Re-skin everything by overriding one variable."}
      description={props.description ?? "Every Harbor component reads its colors through CSS custom properties."}
      media={fakeMedia}
    >
      <div className="mt-4 flex gap-2">
        <Button variant="primary">Try the playground</Button>
        <Button variant="ghost">Read the docs</Button>
      </div>
    </SplitSection>
  );
}

export const playground: PlaygroundManifest = {
  component: SplitSectionDemo as never,
  importPath: "@infinibay/harbor/sections",
  controls: {
    reverse: { type: "boolean", default: false, description: "Flip media to the right side." },
    kicker: { type: "text", default: "Theming" },
    title: { type: "text", default: "Re-skin everything by overriding one variable." },
  },
  variants: [
    { label: "Media left", props: { reverse: false } },
    { label: "Media right", props: { reverse: true } },
  ],
};
