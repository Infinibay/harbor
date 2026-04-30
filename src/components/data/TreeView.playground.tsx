import { useState } from "react";
import { TreeView, type TreeNode } from "./TreeView";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sampleNodes: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "src/index.ts", label: "index.ts" },
      {
        id: "src/components",
        label: "components",
        children: [
          { id: "src/components/Button.tsx", label: "Button.tsx" },
          { id: "src/components/Dialog.tsx", label: "Dialog.tsx" },
          {
            id: "src/components/data",
            label: "data",
            children: [
              { id: "src/components/data/DataTable.tsx", label: "DataTable.tsx" },
              { id: "src/components/data/TreeView.tsx", label: "TreeView.tsx" },
            ],
          },
        ],
      },
      { id: "src/lib", label: "lib", children: [
        { id: "src/lib/cn.ts", label: "cn.ts" },
      ] },
    ],
  },
  { id: "package.json", label: "package.json" },
  { id: "tsconfig.json", label: "tsconfig.json" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TreeViewDemo(props: any) {
  const [selected, setSelected] = useState<string | undefined>(
    "src/components/data/DataTable.tsx",
  );
  return (
    <div style={{ width: "100%", maxHeight: 480, overflow: "auto" }}>
      <TreeView
        {...props}
        nodes={props.nodes ?? sampleNodes}
        defaultExpanded={props.defaultExpanded ?? ["src", "src/components"]}
        selected={selected}
        onSelect={setSelected}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: TreeViewDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {},
  variants: [
    { label: "Default expanded", props: { defaultExpanded: ["src", "src/components"] } },
    { label: "All collapsed", props: { defaultExpanded: [] } },
    { label: "Deep open", props: { defaultExpanded: ["src", "src/components", "src/components/data", "src/lib"] } },
  ],
  events: [{ name: "onSelect", signature: "(id: string) => void" }],
};
