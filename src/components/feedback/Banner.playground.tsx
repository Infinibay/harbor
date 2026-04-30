import { Banner } from "./Banner";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BannerDemo(props: any) {
  return (
    <Banner {...props} title={props.title ?? "New feature available"}>
      {props.children ?? "Filters now support saved views — try it from the toolbar."}
    </Banner>
  );
}

export const playground: PlaygroundManifest = {
  component: BannerDemo as never,
  importPath: "@infinibay/harbor/feedback",
  controls: {
    tone: { type: "select", options: ["info", "success", "warning", "danger"], default: "info" },
    open: { type: "boolean", default: true },
    sticky: { type: "boolean", default: false, description: "Pin to viewport top." },
    title: { type: "text", default: "New feature available" },
  },
  variants: [
    { label: "Info", props: { tone: "info" } },
    { label: "Success", props: { tone: "success", title: "Deployed" } },
    { label: "Warning", props: { tone: "warning", title: "Read-only mode" } },
    { label: "Sticky", props: { sticky: true, tone: "info" } },
  ],
  events: [{ name: "onClose", signature: "() => void" }],
  notes: "Banners differ from Alerts in that they span the full width and usually live at the top of a region.",
};
