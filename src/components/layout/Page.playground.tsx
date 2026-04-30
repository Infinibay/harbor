import { Page } from "./Page";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-xs uppercase tracking-widest text-white/40">
        {title}
      </div>
      <div className="mt-2 text-sm text-white/80">{body}</div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PageDemo(props: any) {
  return (
    <div style={{ height: 520, width: "100%", overflow: "auto" }}>
      <Page {...props}>
        <Section title="Header" body="Page title row goes here." />
        <Section title="Stats" body="Three KPIs across, ideally." />
        <Section title="Recent activity" body="A timeline or feed." />
      </Page>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: PageDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    size: {
      type: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "prose", "full"],
      default: "xl",
    },
    gap: {
      type: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      default: "lg",
    },
    padded: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Tight (sm gap)", props: { gap: "sm" } },
    { label: "Prose", props: { size: "prose" } },
    { label: "Full width", props: { size: "full" } },
  ],
  events: [],
};
