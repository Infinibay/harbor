import { MenuBar } from "./MenuBar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const items = [
  {
    id: "file",
    label: "File",
    children: [
      { id: "new", label: "New", shortcut: "⌘N", onSelect: () => console.log("new") },
      { id: "open", label: "Open...", shortcut: "⌘O", onSelect: () => console.log("open") },
      { id: "sep1", separator: true, label: "" },
      {
        id: "recent",
        label: "Open recent",
        submenu: [
          { id: "r1", label: "harbor-site", onSelect: () => console.log("r1") },
          { id: "r2", label: "infinibay-app", onSelect: () => console.log("r2") },
        ],
      },
      { id: "sep2", separator: true, label: "" },
      { id: "quit", label: "Quit", shortcut: "⌘Q", danger: true, onSelect: () => console.log("quit") },
    ],
  },
  {
    id: "edit",
    label: "Edit",
    children: [
      { id: "undo", label: "Undo", shortcut: "⌘Z", onSelect: () => {} },
      { id: "redo", label: "Redo", shortcut: "⇧⌘Z", disabled: true, onSelect: () => {} },
      { id: "sep", separator: true, label: "" },
      { id: "find", label: "Find", shortcut: "⌘F", onSelect: () => {} },
    ],
  },
  {
    id: "view",
    label: "View",
    children: [
      { id: "sidebar", label: "Sidebar", checked: true, onSelect: () => {} },
      { id: "minimap", label: "Minimap", onSelect: () => {} },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MenuBarDemo(props: any) {
  return <MenuBar items={items} {...props} />;
}

export const playground: PlaygroundManifest = {
  component: MenuBarDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {},
  variants: [{ label: "Default", props: {} }],
  events: [{ name: "entry.onSelect", signature: "() => void" }],
  notes: "Click File / Edit / View, then hover siblings to switch. File > Open recent has a submenu.",
};
