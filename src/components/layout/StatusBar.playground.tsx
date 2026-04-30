import { StatusBar, StatusItem, StatusSeparator } from "./StatusBar";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatusBarDemo(props: any) {
  return (
    <StatusBar {...props}>
      <StatusItem tone="success">● main</StatusItem>
      <StatusSeparator />
      <StatusItem onClick={() => console.log("changes")}>3 changes</StatusItem>
      <StatusSeparator />
      <StatusItem tone="info">Ln 42, Col 18</StatusItem>
      <StatusSeparator />
      <StatusItem tone="warning">2 warnings</StatusItem>
      <StatusSeparator />
      <StatusItem>UTF-8</StatusItem>
    </StatusBar>
  );
}

export const playground: PlaygroundManifest = {
  component: StatusBarDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {},
  variants: [{ label: "Default", props: {} }],
  events: [{ name: "StatusItem.onClick", signature: "() => void" }],
  notes: "Compose with <StatusItem tone icon onClick> and <StatusSeparator>.",
};
