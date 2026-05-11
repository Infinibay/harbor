import { useState } from "react";
import { Badge } from "../display/Badge";
import { EditorTabs, type EditorTab } from "./EditorTabs";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const initialTabs: EditorTab[] = [
  { id: "readme", title: "README.md", icon: "md", pinned: true },
  { id: "schema", title: "schema.sql", icon: "sql" },
  { id: "query", title: "query.ts", icon: "tsx", dirty: true },
  { id: "preview", title: "Preview", badge: <Badge tone="success">live</Badge> },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EditorTabsDemo(props: any) {
  const [tabs, setTabs] = useState(initialTabs);
  const [activeId, setActiveId] = useState("query");

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--harbor-workbench-bg)]">
      <EditorTabs
        {...props}
        tabs={tabs}
        activeId={activeId}
        onActivate={setActiveId}
        onReorder={setTabs}
        onClose={(id) => {
          setTabs((current) => current.filter((tab) => tab.id !== id));
          if (activeId === id) setActiveId(tabs[0]?.id ?? "");
        }}
        onNew={() => {
          const id = `scratch-${tabs.length + 1}`;
          setTabs((current) => [...current, { id, title: `scratch-${current.length + 1}.ts`, icon: "ts" }]);
          setActiveId(id);
        }}
      />
      <div className="h-48 p-4 font-mono text-sm text-white/65">
        Active document: <span className="text-white">{tabs.find((tab) => tab.id === activeId)?.title}</span>
      </div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: EditorTabsDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {},
  variants: [
    { label: "Editor workspace", props: {} },
  ],
  events: [
    { name: "onActivate", signature: "(id: string) => void", description: "Selects the document shown below the tab strip." },
    { name: "onClose", signature: "(id: string) => void", description: "Remove a clean, non-pinned tab." },
    { name: "onReorder", signature: "(tabs: EditorTab[]) => void", description: "Persist the drag-reordered working set." },
  ],
  notes:
    "Dirty tabs show an unsaved dot instead of a close button. Drag clean tabs to reorder the working set.",
};
