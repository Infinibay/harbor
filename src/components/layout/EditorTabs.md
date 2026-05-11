# EditorTabs

Workbench tab strip for code editors, design tools, query consoles, file managers, and desktop-style applications where users keep several documents open at once.

## Import

```tsx
import { EditorTabs } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<EditorTabs
  tabs={[
    { id: "schema", title: "schema.sql", pinned: true },
    { id: "query", title: "query.ts", dirty: true },
  ]}
  activeId={activeId}
  onActivate={setActiveId}
  onClose={closeTab}
  onReorder={setTabs}
  onNew={createTab}
/>;
```

## Props

- **tabs** - `EditorTab[]`. Required ordered tab model.
- **activeId** - id of the active tab.
- **onActivate** - called when a tab is selected.
- **onClose** - enables close buttons for non-pinned, clean tabs.
- **onReorder** - called after drag reordering.
- **onNew** - renders the compact new-tab button.
- **className** - extra classes on the tab strip.

## Tab Model

Each tab needs an `id` and `title`. Use `icon` for file type or surface type, `dirty` for unsaved edits, `pinned` for non-closable tabs, and `badge` for short metadata such as branch, error count, or preview status.

Dirty tabs intentionally show a dot instead of a close button. That keeps unsaved state visible and avoids accidental close affordances in dense editors.

## Interaction Model

`EditorTabs` is controlled. Store `tabs` and `activeId` in the parent so the tab strip, editor body, file explorer, status bar, and route state all agree.

When `onReorder` is provided, tabs can be dragged horizontally. Pinned tabs keep their drag listener disabled so they behave like stable anchors.

## Accessibility

Close buttons include an `aria-label` with the tab title. Make sure tab titles are specific enough to identify the document, especially when multiple files share the same basename.

## Gotchas

Do not use `EditorTabs` as site navigation. It is for open working sets, not global route hierarchies. Use `Tabs`, `Sidebar`, `Breadcrumbs`, or `NavBar` for navigation.

## Related Components

`FileExplorer`, `BrowserTabs`, `Tabs`, `Toolbar`, `StatusBar`, `CodeBlock`, `Terminal`.
