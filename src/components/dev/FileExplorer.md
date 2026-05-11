# FileExplorer

Tree navigation for developer tools, IDE-like workspaces, file managers, and any product surface where users need to browse nested resources without leaving the current screen.

## Import

```tsx
import { FileExplorer } from "@infinibay/harbor/dev";
```

## Basic Usage

```tsx
const nodes = [
  {
    id: "src",
    name: "src",
    children: [
      { id: "src/app", name: "App.tsx" },
      { id: "src/main", name: "main.tsx" },
    ],
  },
];

<FileExplorer
  nodes={nodes}
  selectedId={selectedId}
  defaultExpandedIds={["src"]}
  onSelect={(id) => setSelectedId(id)}
/>;
```

## Props

- **nodes** - `FileExplorerNode[]`. Required tree model. Nodes with `children` render as folders.
- **selectedId** - selected node id. Use it to keep the explorer in sync with the active document or route.
- **defaultExpandedIds** - uncontrolled initial folders.
- **expandedIds** - controlled expanded folder ids.
- **onExpandedIdsChange** - called when controlled expansion changes.
- **onSelect** - called with the selected id and node.
- **onNodeContextMenu** - receives the original button context-menu event and node. Use it for rename, duplicate, delete, reveal, or copy-path menus.
- **className** - extra classes on the scroll container.

## Interaction Model

Clicking a folder toggles it and selects it. Clicking a leaf selects it. The component can be uncontrolled for simple demos or controlled when the tree state is part of a workspace store.

Use controlled `expandedIds` when the application needs to restore workspace state, expand search results, reveal a newly created file, or keep several explorer panes synchronized.

## Composition Notes

Use `icon` for file-type or resource-type signals and `badge` for short state markers such as modified, generated, locked, or error. Keep badges compact; the row is designed for scanning dense trees.

`FileExplorer` is intentionally focused on the tree. Pair it with `EditorTabs`, `Toolbar`, `ContextMenu`, `Terminal`, and `StatusBar` to build full developer workbenches.

## Accessibility

Rows render as native buttons, so pointer and keyboard activation work without custom event plumbing. Provide meaningful node names because they become the primary accessible label.

## Gotchas

Do not store large file payloads inside `nodes`. Keep the tree model light and load file content through the selected id.

Avoid putting long interactive controls inside `badge`; the row itself is already the primary interaction target.

## Related Components

`EditorTabs`, `Terminal`, `CodeBlock`, `LogViewer`, `Toolbar`, `ContextMenu`.
