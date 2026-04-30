import { useState } from "react";
import { CommandPalette } from "./CommandPalette";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleCommands = [
  { id: "new-doc", label: "New document", section: "Workspace", action: () => {} },
  { id: "new-folder", label: "New folder", section: "Workspace", action: () => {} },
  { id: "go-home", label: "Go to home", section: "Navigate", action: () => {} },
  { id: "go-billing", label: "Go to billing", section: "Navigate", action: () => {} },
  { id: "theme-light", label: "Theme: Light", section: "Preferences", action: () => {} },
  { id: "theme-dark", label: "Theme: Dark", section: "Preferences", action: () => {} },
  { id: "logout", label: "Sign out", section: "Account", action: () => {} },
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
