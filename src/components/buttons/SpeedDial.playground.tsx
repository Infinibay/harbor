import { SpeedDial } from "./SpeedDial";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const sampleActions = [
  { id: "doc", label: "New document", icon: <span>📄</span>, onSelect: () => {} },
  { id: "img", label: "Upload image", icon: <span>🖼️</span>, onSelect: () => {} },
  { id: "team", label: "Invite teammate", icon: <span>👥</span>, onSelect: () => {} },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SpeedDialDemo(props: any) {
  return (
    <div className="relative h-48 w-full">
      <SpeedDial
        {...props}
        icon={<PlusIcon />}
        actions={sampleActions}
        position={props.position ?? "none"}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SpeedDialDemo as never,
  importPath: "@infinibay/harbor/buttons",
  controls: {
    direction: {
      type: "select",
      options: ["up", "down", "left", "right"],
      default: "up",
    },
    position: {
      type: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left", "none"],
      default: "none",
    },
  },
  variants: [
    { label: "Up", props: { direction: "up", position: "none" } },
    { label: "Right", props: { direction: "right", position: "none" } },
    { label: "Down", props: { direction: "down", position: "none" } },
  ],
  notes: "Hover/tap the trigger to fan out the actions.",
};
