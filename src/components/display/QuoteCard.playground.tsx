import { QuoteCard } from "./QuoteCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuoteCardDemo(props: any) {
  return (
    <QuoteCard
      {...props}
      author={{
        name: "Ana Pérez",
        role: "Engineering Lead, Acme",
        avatar: "https://i.pravatar.cc/150?img=12",
      }}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: QuoteCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    quote: { type: "text", default: "Harbor cut our setup time in half. We shipped the dashboard rewrite in two sprints." },
    accent: { type: "select", options: ["fuchsia", "sky", "emerald", "amber"], default: "fuchsia" },
  },
  variants: [
    { label: "Fuchsia", props: { accent: "fuchsia" } },
    { label: "Sky", props: { accent: "sky" } },
    { label: "Emerald", props: { accent: "emerald" } },
  ],
};
