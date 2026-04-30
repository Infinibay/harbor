import { ToastProvider, useToast } from "./Toast";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function ToastTrigger({
  tone,
  title,
  description,
  duration,
  withAction,
}: {
  tone?: "default" | "success" | "warning" | "danger" | "info";
  title?: string;
  description?: string;
  duration?: number;
  withAction?: boolean;
}) {
  const { push } = useToast();
  return (
    <button
      onClick={() =>
        push({
          tone,
          title: title ?? "Saved",
          description,
          duration,
          action: withAction
            ? { label: "Undo", onClick: () => console.log("undo") }
            : undefined,
        })
      }
      className="px-4 py-2 rounded-md bg-fuchsia-500/80 hover:bg-fuchsia-500 text-white text-sm font-medium"
    >
      Show toast
    </button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToastDemo(props: any) {
  return (
    <ToastProvider>
      <div className="min-h-[200px] flex items-center justify-center">
        <ToastTrigger {...props} />
      </div>
    </ToastProvider>
  );
}

export const playground: PlaygroundManifest = {
  component: ToastDemo as never,
  importPath: "@infinibay/harbor/feedback",
  controls: {
    tone: {
      type: "select",
      options: ["default", "success", "warning", "danger", "info"],
      default: "success",
    },
    title: { type: "text", default: "Saved" },
    description: { type: "text", default: "Your changes are live." },
    duration: { type: "number", default: 4000, description: "ms; 0 keeps it sticky." },
    withAction: { type: "boolean", default: false, description: "Render an Undo action." },
  },
  variants: [
    { label: "Success", props: { tone: "success", title: "Deployed", description: "v0.4.2 is live." } },
    { label: "Danger", props: { tone: "danger", title: "Couldn't reach the API", withAction: true } },
    { label: "Sticky", props: { tone: "info", title: "Long task running", duration: 0 } },
  ],
  notes:
    "Toasts are imperative — call `useToast().push(...)` from anywhere under <ToastProvider>. Click the button repeatedly to stack them.",
};
