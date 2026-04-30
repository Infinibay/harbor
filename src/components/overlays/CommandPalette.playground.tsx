import { useState } from "react";
import { CommandPalette } from "./CommandPalette";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

const sampleCommands = [
  { id: "new-doc", label: "New document", section: "Workspace", run: () => {} },
  { id: "new-folder", label: "New folder", section: "Workspace", run: () => {} },
  { id: "go-home", label: "Go to home", section: "Navigate", run: () => {} },
  { id: "go-billing", label: "Go to billing", section: "Navigate", run: () => {} },
  { id: "theme-light", label: "Theme: Light", section: "Preferences", run: () => {} },
  { id: "theme-dark", label: "Theme: Dark", section: "Preferences", run: () => {} },
  { id: "logout", label: "Sign out", section: "Account", run: () => {} },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CommandPaletteDemo(props: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open palette · ⌘K</Button>
      <CommandPalette
        {...props}
        open={open}
        onOpenChange={(v: boolean) => {
          setOpen(v);
          props.onOpenChange?.(v);
        }}
        commands={sampleCommands}
      />
    </>
  );
}

export const playground: PlaygroundManifest = {
  component: CommandPaletteDemo as never,
  importPath: "@infinibay/harbor/overlays",
  controls: {
    placeholder: { type: "text", default: "Search commands…" },
  },
  events: [
    { name: "onOpenChange", signature: "(open: boolean) => void", description: "Fires on open and on close (Esc, click outside, command run)." },
  ],
};
