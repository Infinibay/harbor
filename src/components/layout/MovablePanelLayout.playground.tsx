import { useState } from "react";
import {
  MovablePanelLayout,
  type MovablePanel,
  type MovablePanelPosition,
} from "./MovablePanelLayout";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function MovablePanelLayoutDemo() {
  const [positions, setPositions] = useState<Record<string, MovablePanelPosition>>({
    explorer: "left",
    assistant: "right",
    terminal: "bottom",
  });

  const panels: MovablePanel[] = [
    {
      id: "explorer",
      title: "Explorer",
      subtitle: "workspace",
      position: positions.explorer,
      content: <DemoList items={["src/App.tsx", "src/components/DataGrid.tsx", "src/lib/query.ts"]} />,
    },
    {
      id: "assistant",
      title: "Assistant",
      subtitle: "review context",
      position: positions.assistant,
      content: <DemoList items={["Explain selection", "Generate test", "Refactor symbol"]} />,
    },
    {
      id: "terminal",
      title: "Terminal",
      subtitle: "npm run dev",
      position: positions.terminal,
      content: <pre className="p-3 font-mono text-xs text-fg-muted">$ npm run dev{"\n"}ready in 312ms</pre>,
    },
  ];

  return (
    <div className="h-[460px] overflow-hidden rounded-lg border border-border bg-surface-0">
      <MovablePanelLayout
        panels={panels}
        onPanelMove={(id, position) => setPositions((current) => ({ ...current, [id]: position }))}
      >
        <div className="grid h-full place-items-center bg-[var(--harbor-workbench-bg,var(--harbor-surface-0))] text-sm text-fg-muted">
          Editor surface
        </div>
      </MovablePanelLayout>
    </div>
  );
}

function DemoList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-1 p-3">
      {items.map((item) => (
        <button key={item} type="button" className="rounded-sm px-2 py-1.5 text-left text-xs text-fg-muted hover:bg-white/5">
          {item}
        </button>
      ))}
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: MovablePanelLayoutDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {},
  variants: [{ label: "Desktop dock layout", props: {} }],
  events: [
    { name: "onPanelMove", signature: "(panelId, position: 'left' | 'right' | 'bottom' | 'hidden') => void" },
  ],
};
