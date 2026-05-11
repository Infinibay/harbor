# MovablePanelLayout

Dockable panel layout for desktop-style applications: IDEs, Tauri tools,
database clients, visual builders, observability workbenches, and internal
operator consoles. It gives users a primary workspace with movable side and
bottom panels, similar to professional tools where the file tree, inspector,
assistant, terminal, and logs can change position.

Use `MovablePanelLayout` when panel placement is part of the workflow. If the
screen only needs one static sidebar or inspector, use `AppShell`, `Sidebar`,
or `SplitPane` instead.

## Import

```tsx
import {
  MovablePanelLayout,
  type MovablePanel,
  type MovablePanelPosition,
} from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
function Workbench() {
  const [positions, setPositions] = useState<
    Record<string, MovablePanelPosition>
  >({
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
      content: <Explorer />,
    },
    {
      id: "assistant",
      title: "Assistant",
      subtitle: "review context",
      position: positions.assistant,
      content: <Assistant />,
    },
    {
      id: "terminal",
      title: "Terminal",
      subtitle: "npm run dev",
      position: positions.terminal,
      content: <Terminal />,
    },
  ];

  return (
    <MovablePanelLayout
      panels={panels}
      leftSize={300}
      rightSize={340}
      bottomSize={260}
      onPanelMove={(id, position) =>
        setPositions((current) => ({ ...current, [id]: position }))
      }
    >
      <EditorSurface />
    </MovablePanelLayout>
  );
}
```

## Props

- **panels** - ordered panel definitions. Each panel has `id`, `title`,
  `position`, and `content`; `subtitle`, `minSize`, and `size` are available
  for richer workbench metadata.
- **children** - the primary workspace rendered between the side panels and
  above the bottom panel.
- **onPanelMove** - required callback fired when a panel is docked to `left`,
  `right`, `bottom`, or moved to `hidden`.
- **leftSize** / **rightSize** / **bottomSize** - fixed dock zone sizes in
  pixels. Defaults are tuned for desktop workbenches.
- **className** - applies to the root layout container.

## Interaction Model

Each panel header acts as the drag handle. When the user drags far enough, the
layout shows dock targets for the left, right, and bottom regions. Dropping on
one of those regions calls `onPanelMove(panelId, position)`. Clicking the hide
button calls `onPanelMove(panelId, "hidden")`.

The component does not store final panel positions internally. This is
intentional: production tools usually persist workbench layout in local storage,
user preferences, project settings, or a synced profile. Keep the panel
positions in app state and pass the current value back through `panels`.

## Composition Notes

Use it as the main body of a desktop app shell, usually below a menu bar or
toolbar and above a status bar. Good panel content is task-specific: file
explorers, outline views, inspectors, search results, terminals, logs, and AI
assistant context. Avoid putting unrelated cards in movable panels just because
the layout can host them.

Panel content should be compact and scrollable. The center `children` region
should remain the main work surface: editor, canvas, graph, database table, or
preview. If the center stops feeling primary, reduce the number of visible
panels or hide secondary panels behind commands.

## Accessibility

The hide control is a native button with a title. Drag docking is pointer-first,
so provide equivalent commands elsewhere for keyboard users: menu items,
command palette actions, or panel header buttons that move panels to a known
region. Keep focus inside the moved panel content stable when possible, and
avoid hiding a panel that currently owns unsaved user input without an alternate
way back.

## Gotchas

- `MovablePanelLayout` is a layout controller, not a window manager. It does
  not resize panels interactively or persist user preferences by itself.
- Hidden panels are not rendered because their `position` is `"hidden"`. Keep
  a command or menu item that can restore them.
- The dock zone sizes are fixed numbers. Choose sizes that match the product
  target and minimum window size.
- Use this only for dense professional tools. A simple dashboard with one
  sidebar is easier to understand with `AppShell` or `SplitPane`.

## Related Components

`AppShell`, `WindowFrame`, `SplitPane`, `Sidebar`, `Toolbar`, `BrowserTabs`,
`StatusBar`, `CommandPalette`.
