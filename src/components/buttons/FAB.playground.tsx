import { FAB } from "./FAB";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FABDemo(props: any) {
  return <FAB {...props} icon={<PlusIcon />} label={props.label ?? "New item"} />;
}

export const playground: PlaygroundManifest = {
  component: FABDemo as never,
  importPath: "@infinibay/harbor/buttons",
  controls: {
    label: { type: "text", default: "New item" },
    size: { type: "select", options: ["md", "lg"], default: "md" },
    variant: { type: "select", options: ["primary", "secondary"], default: "primary" },
    position: {
      type: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left", "none"],
      default: "none",
      description: "`none` keeps the FAB inline; the others anchor it to the viewport.",
    },
  },
  variants: [
    { label: "Inline · primary", props: { position: "none", variant: "primary" } },
    { label: "Inline · secondary", props: { position: "none", variant: "secondary" } },
    { label: "Large", props: { position: "none", size: "lg" } },
  ],
  events: [{ name: "onClick", signature: "() => void" }],
  notes: "Real apps usually anchor with `position` — set to `none` here so it stays inside the canvas.",
};
