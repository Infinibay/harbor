import { useState } from "react";
import { ShortcutSheet } from "./ShortcutSheet";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const groups = [
  {
    id: "global",
    label: "Global",
    shortcuts: [
      { keys: ["⌘", "K"], description: "Open command palette" },
      { keys: ["⌘", "/"], description: "Toggle this shortcut sheet" },
      { keys: ["⌘", ","], description: "Open settings" },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    shortcuts: [
      { keys: ["G", "H"], description: "Go home" },
      { keys: ["G", "P"], description: "Go to projects" },
      { keys: ["?"], description: "Show help" },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ShortcutSheetDemo(props: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open shortcut sheet</Button>
      <ShortcutSheet
        {...props}
        open={open}
        onClose={() => {
          setOpen(false);
          props.onClose?.();
        }}
        groups={groups}
      />
    </>
  );
}

export const playground: PlaygroundManifest = {
  component: ShortcutSheetDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {},
  events: [{ name: "onClose", signature: "() => void" }],
};
