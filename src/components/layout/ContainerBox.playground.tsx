import { ContainerBox } from "./ContainerBox";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContainerBoxDemo(props: any) {
  return (
    <div style={{ width: "100%" }}>
      <style>{`
        @container hbr-demo (min-width: 480px) {
          .hbr-demo-grid { grid-template-columns: 1fr 1fr; }
          .hbr-demo-label::after { content: " · wide"; color: rgba(168,85,247,0.9); }
        }
      `}</style>
      <ContainerBox {...props} name="hbr-demo">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="hbr-demo-label text-xs uppercase tracking-widest text-white/40">
            Container query
          </div>
          <div className="hbr-demo-grid mt-3 grid grid-cols-1 gap-2">
            <div className="rounded-lg bg-white/[0.04] p-3 text-sm text-white/80">
              Cell A
            </div>
            <div className="rounded-lg bg-white/[0.04] p-3 text-sm text-white/80">
              Cell B
            </div>
          </div>
          <p className="mt-3 text-xs text-white/50">
            Resize the playground frame: at &ge; 480px the grid splits in two
            columns and the label gains a "· wide" suffix.
          </p>
        </div>
      </ContainerBox>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: ContainerBoxDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    type: {
      type: "select",
      options: ["inline-size", "size", "normal"],
      default: "inline-size",
    },
    name: { type: "text", default: "hbr-demo" },
  },
  variants: [
    { label: "Inline-size (default)", props: {} },
    { label: "Both axes", props: { type: "size" } },
  ],
  events: [],
  notes:
    "The demo defines a tiny @container rule that swaps a 1-col grid to 2 cols at 480px to make the query context observable.",
};
