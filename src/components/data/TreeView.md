# TreeView

Generic hierarchical list with expand/collapse and single-select. For
git commit graphs use `<BranchTree>`; for tabular data with
hierarchical grouping use `<DataTable>` with `grouping`.

## Import

```tsx
import { TreeView, type TreeNode } from "@infinibay/harbor/data";
```

## Example

```tsx
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
        ],
      },
    ],
  },
  { id: "package.json", label: "package.json" },
];

const [selected, setSelected] = useState<string>();

<TreeView
  nodes={nodes}
  selected={selected}
  onSelect={setSelected}
  defaultExpanded={["src", "src/components"]}
/>
```

## Props

- **nodes** — `TreeNode[]`. Required. `{ id, label: ReactNode,
  icon?: ReactNode, children?: TreeNode[] }`.
- **defaultExpanded** — `string[]`. Initially expanded ids. Default `[]`.
- **selected** — `string`. Currently selected id (controlled).
- **onSelect** — `(id: string) => void`. Fires on any node click,
  including parents (which also toggle expand).
- **className** — extra classes on the root `<ul>`.

## Notes

- Expansion state is internal; if you need controlled expansion
  manage it externally and re-mount the tree, or use `<DataTable>`.
- Clicking a parent both toggles expansion and selects it.
- Each node renders as a `<button>` for native keyboard focus and
  Enter/Space activation.
