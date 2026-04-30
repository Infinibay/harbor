import { Alert } from "./Alert";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AlertDemo(props: any) {
  return (
    <Alert {...props} title={props.title ?? "Heads up"}>
      {props.children ?? "We just upgraded the storage backend — you may notice a brief pause on first read."}
    </Alert>
  );
}

export const playground: PlaygroundManifest = {
  component: AlertDemo as never,
  importPath: "@infinibay/harbor/feedback",
  controls: {
    tone: {
      type: "select",
      options: ["info", "success", "warning", "danger", "neutral"],
      default: "info",
    },
    size: { type: "select", options: ["sm", "md"], default: "md" },
    layout: { type: "select", options: ["stack", "inline"], default: "stack" },
    title: { type: "text", default: "Heads up" },
  },
  variants: [
    { label: "Info", props: { tone: "info" } },
    { label: "Success", props: { tone: "success", title: "Deployed" } },
    { label: "Warning", props: { tone: "warning", title: "Almost full" } },
    { label: "Danger", props: { tone: "danger", title: "Action required" } },
    { label: "Inline · sm", props: { layout: "inline", size: "sm" } },
  ],
  events: [
    { name: "onClose", signature: "() => void", description: "Fires when the dismiss × is clicked." },
  ],
};
