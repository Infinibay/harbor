import { ResponsiveStack } from "./ResponsiveStack";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

function Block({ label, tone }: { label: string; tone: string }) {
  return (
    <div className={`min-w-32 rounded-xl border border-white/10 ${tone} px-4 py-6 text-sm text-white/80`}>
      {label}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResponsiveStackDemo(props: any) {
  return (
    <div className="w-full p-4">
      <ResponsiveStack {...props}>
        <Block label="One" tone="bg-fuchsia-500/20" />
        <Block label="Two" tone="bg-sky-500/20" />
        <Block label="Three" tone="bg-emerald-500/20" />
      </ResponsiveStack>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ResponsiveStackDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    align: { type: "select", options: ["start", "center", "end", "stretch"], default: "stretch" },
    justify: { type: "select", options: ["start", "center", "end", "between", "around"], default: "start" },
    wrap: { type: "boolean", default: false },
  },
  variants: [
    { label: "Col → Row at md", props: { direction: { base: "col", md: "row" }, gap: 3 } },
    { label: "Always row", props: { direction: "row", gap: 3 } },
    { label: "Always col", props: { direction: "col", gap: 3 } },
    { label: "Reverse at md", props: { direction: { base: "col", md: "row-reverse" } } },
  ],
  events: [],
  notes:
    "Resize the viewport across the `md` breakpoint to see the direction flip.",
};
