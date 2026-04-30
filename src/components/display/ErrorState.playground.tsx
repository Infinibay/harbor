import { ErrorState } from "./ErrorState";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: ErrorState as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    title: { type: "text", default: "Something went wrong" },
    description: { type: "text", default: "We couldn't load the project list. Please try again." },
    code: { type: "text", default: "503" },
  },
  variants: [
    { label: "503", props: { code: "503" } },
    { label: "404", props: { title: "Project not found", code: "404", description: "The project you're looking for doesn't exist or was deleted." } },
    { label: "No code", props: { code: "" } },
  ],
  events: [{ name: "onRetry", signature: "() => void", description: "Renders the Retry button when provided." }],
};
