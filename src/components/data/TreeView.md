# TreeView

`TreeView` renders a hierarchical list with animated expand and collapse behavior, single selection, and optional icons per node. Use it for file explorers, settings trees, package/module lists, navigation trees, and any compact hierarchy where the user needs to reveal children without leaving the current surface.

It is intentionally lighter than `DataTable`. Choose `TreeView` when each row is mostly a label. Choose `DataTable` when the hierarchy also needs columns, sorting, filtering, virtualization, grouping, or expanded detail rows.

## Import

```tsx
import { TreeView, type TreeNode } from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
import { useState } from "react";
import { TreeView, type TreeNode } from "@infinibay/harbor/data";

const nodes: TreeNode[] = [
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
          { id: "src/components/TreeView.tsx", label: "TreeView.tsx" },
        ],
      },
    ],
  },
  { id: "package.json", label: "package.json" },
];

export function FileTree() {
  const [selected, setSelected] = useState("src/components/Button.tsx");

  return (
    <TreeView
      nodes={nodes}
      selected={selected}
      onSelect={setSelected}
      defaultExpanded={["src", "src/components"]}
    />
  );
}
```

## Props

- **nodes** - `TreeNode[]`. Required hierarchy. Each node has `{ id, label, icon?, children? }`.
- **defaultExpanded** - `string[]`. Node ids that start open. Default `[]`.
- **selected** - `string`. Controlled selected node id.
- **onSelect** - `(id: string) => void`. Fires whenever a node is clicked, including parent nodes.
- **className** - extra classes on the root `<ul>`.

## Node Model

Every node needs a stable `id`. Use ids that mean something in your app, such as a file path, project id, setting key, or database id. `label` accepts `ReactNode`, so labels can include badges, counts, or formatted names. `icon` is rendered before the label and is useful for folders, files, environments, and resource types.

Expansion state is internal. `defaultExpanded` only sets the initial state for this mounted tree. Selection is controlled through `selected` and `onSelect`, which lets the parent app show details beside the tree.

## Behavior

Clicking a parent node toggles expansion and then calls `onSelect` with the same node id. Leaf nodes only call `onSelect`. Children mount and unmount with a height and opacity animation from `framer-motion`.

Indentation is calculated from depth, so deeply nested trees remain compact. Long labels are truncated to keep the row stable.

## Accessibility

Rows are native `<button>` elements, so they are focusable and respond to Enter and Space. The component currently does not implement full ARIA tree semantics such as `role="tree"`, `aria-expanded`, roving tab index, or arrow-key navigation. For an IDE-style file explorer, add those semantics or wrap `TreeView` in app-level keyboard shortcuts.

## Gotchas

- `defaultExpanded` is not controlled after mount.
- Parent clicks select and toggle at the same time.
- Use stable ids. Changing ids will reset selection and expansion.
- Very large trees are not virtualized. Use a dedicated virtual tree or `DataTable` for thousands of rows.

## Related

- `DataTable` for hierarchical data with columns and virtualization.
- `FileExplorer` for a richer file-browser surface.
- `BranchTree` for git branch topology.
