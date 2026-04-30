import { EmptyState } from "./EmptyState";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EmptyStateDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <EmptyState
        {...props}
        icon={<span>📦</span>}
        actions={<Button variant="primary" size="sm">New project</Button>}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: EmptyStateDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    title: { type: "text", default: "No projects yet" },
    description: { type: "text", default: "Create your first project to get started." },
    variant: { type: "select", options: ["default", "dashed", "inline"], default: "default" },
  },
  variants: [
    { label: "Default", props: { variant: "default" } },
    { label: "Dashed", props: { variant: "dashed" } },
    { label: "Inline", props: { variant: "inline" } },
  ],
};
