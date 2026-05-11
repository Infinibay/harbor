import { useState } from "react";
import { Badge } from "../display/Badge";
import { HarborProvider } from "../../lib/theme";
import { FileExplorer, type FileExplorerNode } from "./FileExplorer";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const icons = {
  folder: <span className="text-[10px] font-semibold text-amber-300">D</span>,
  tsx: <span className="text-[10px] font-semibold text-sky-300">T</span>,
  json: <span className="text-[10px] font-semibold text-amber-200">J</span>,
};

const nodes: FileExplorerNode[] = [
  {
    id: "app",
    name: "app",
    icon: icons.folder,
    children: [
      { id: "app/layout", name: "layout.tsx", icon: icons.tsx },
      { id: "app/page", name: "page.tsx", icon: icons.tsx, badge: <Badge tone="success">open</Badge> },
      { id: "app/loading", name: "loading.tsx", icon: icons.tsx },
    ],
  },
  {
    id: "components",
    name: "components",
    icon: icons.folder,
    children: [
      { id: "components/sidebar", name: "Sidebar.tsx", icon: icons.tsx, badge: <Badge>dirty</Badge> },
      { id: "components/editor", name: "EditorTabs.tsx", icon: icons.tsx },
    ],
  },
  { id: "package", name: "package.json", icon: icons.json },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FileExplorerDemo(props: any) {
  const [selectedId, setSelectedId] = useState("app/page");
  const [expandedIds, setExpandedIds] = useState(["app", "components"]);

  return (
    <HarborProvider
      defaultTheme="harbor-dark"
      target="desktop-app"
      density="compact"
      className="h-[360px] w-72 overflow-hidden rounded-2xl border border-white/10 bg-[var(--harbor-workbench-bg)]"
    >
      <FileExplorer
        {...props}
        nodes={nodes}
        selectedId={selectedId}
        expandedIds={expandedIds}
        onExpandedIdsChange={setExpandedIds}
        onSelect={setSelectedId}
      />
    </HarborProvider>
  );
}

export const playground: PlaygroundManifest = {
  component: FileExplorerDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {},
  variants: [
    { label: "Workspace tree", props: {} },
  ],
  events: [
    {
      name: "onSelect",
      signature: "(id: string, node: FileExplorerNode) => void",
      description: "Fires when a folder or leaf row is selected.",
    },
    {
      name: "onExpandedIdsChange",
      signature: "(ids: string[]) => void",
      description: "Use it to persist or synchronize expanded folders.",
    },
  ],
  notes:
    "Click folders to expand or collapse them. Click files to update the controlled selected id.",
};
