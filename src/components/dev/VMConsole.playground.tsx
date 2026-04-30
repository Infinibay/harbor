import { VMConsole } from "./VMConsole";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VMConsoleDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 760 }}>
      <VMConsole
        {...props}
        onConnect={() => props.onConnect?.()}
        onDisconnect={() => props.onDisconnect?.()}
        onFullscreen={() => props.onFullscreen?.()}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: VMConsoleDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    name: { type: "text", default: "vm-staging-01" },
    subtitle: { type: "text", default: "10.0.4.12 · ubuntu 24.04" },
    status: {
      type: "select",
      options: ["online", "offline", "warning", "error", "pending"],
      default: "online",
    },
    resolution: { type: "text", default: "80×24" },
    height: { type: "number", default: 360, min: 200, max: 720, step: 20 },
  },
  events: [
    { name: "onConnect", signature: "() => void" },
    { name: "onDisconnect", signature: "() => void" },
    { name: "onFullscreen", signature: "() => void" },
  ],
  notes:
    "No `terminal` adapter is wired here, so the panel renders the static placeholder. Pass a `TerminalAdapter` (e.g. an xterm.js wrapper) to make the content area interactive.",
};
