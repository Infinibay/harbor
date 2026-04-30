import { IconButton } from "./IconButton";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IconButtonDemo(props: any) {
  return <IconButton icon={<SettingsIcon />} {...props} />;
}

export const playground: PlaygroundManifest = {
  component: IconButtonDemo as never,
  importPath: "@infinibay/harbor/buttons",
  controls: {
    size: { type: "select", options: ["sm", "md", "lg"], default: "md" },
    variant: { type: "select", options: ["solid", "ghost", "glass"], default: "solid" },
    label: { type: "text", default: "Settings" },
    disabled: { type: "boolean", default: false },
    reactive: { type: "boolean", default: true, description: "Cursor-proximity lean." },
    quiet: { type: "boolean", default: false, description: "Disables reactive lean for dense contexts." },
  },
  variants: [
    { label: "Solid", props: { variant: "solid" } },
    { label: "Ghost", props: { variant: "ghost" } },
    { label: "Glass", props: { variant: "glass" } },
    { label: "Small · quiet", props: { variant: "ghost", size: "sm", quiet: true } },
  ],
  events: [{ name: "onClick", signature: "(e: MouseEvent) => void" }],
  notes: "IconButton requires an `icon` ReactNode — the playground supplies one.",
};
