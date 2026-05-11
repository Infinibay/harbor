import { Button } from "../buttons/Button";
import { Badge } from "../display/Badge";
import { HarborProvider } from "../../lib/theme";
import { PageHeader } from "./PageHeader";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PageHeaderDemo(props: any) {
  return (
    <HarborProvider
      defaultTheme="harbor-dark"
      target="webapp"
      density="comfortable"
      className="w-full rounded-2xl bg-[#080910] p-6 text-white"
    >
      <PageHeader
        {...props}
        className="[&_h1]:!text-white [&_p]:!text-white/65"
        actions={
          <>
            <Button variant="secondary">Export</Button>
            <Button>New deployment</Button>
          </>
        }
        meta={<Badge tone="success">Healthy</Badge>}
      />
    </HarborProvider>
  );
}

export const playground: PlaygroundManifest = {
  component: PageHeaderDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    eyebrow: { type: "text", default: "Production" },
    title: { type: "text", default: "Deployments" },
    description: {
      type: "text",
      default: "Monitor releases, incidents, and rollout health across environments.",
    },
    align: { type: "select", options: ["start", "center"], default: "start" },
  },
  variants: [
    { label: "Application page", props: { align: "start" } },
    { label: "Centered docs header", props: { align: "center", eyebrow: "Guide", title: "Build your first Harbor app" } },
  ],
  notes:
    "Use actions for page-level commands and meta for compact state such as environment, health, or ownership.",
};
