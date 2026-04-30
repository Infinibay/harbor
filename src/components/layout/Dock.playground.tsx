import { Dock } from "./Dock";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const Icon = ({ d }: { d: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const items = [
  { id: "home", label: "Home", icon: <Icon d="M3 12l9-9 9 9M5 10v10h14V10" />, active: true },
  { id: "search", label: "Search", icon: <Icon d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm9 16l-4-4" /> },
  { id: "mail", label: "Mail", icon: <Icon d="M3 6h18v12H3zM3 6l9 7 9-7" /> },
  { id: "settings", label: "Settings", icon: <Icon d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /> },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DockDemo(props: any) {
  return <Dock items={items} {...props} />;
}

export const playground: PlaygroundManifest = {
  component: DockDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    size: { type: "number", default: 44, min: 32, max: 72, step: 2, description: "Base icon size in px." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Large", props: { size: 56 } },
    { label: "Compact", props: { size: 36 } },
  ],
  events: [{ name: "item.onClick", signature: "() => void" }],
  notes: "Move the cursor across the dock to see the proximity magnification.",
};
