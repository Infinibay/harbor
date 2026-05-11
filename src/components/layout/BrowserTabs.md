# BrowserTabs

`BrowserTabs` renders draggable, closable, browser-style tabs for workbench shells. It supports active state, pinned tabs, loading indicators, reorder callbacks, close buttons, and a new-tab action.

Use it for desktop-style apps, Tauri workbenches, code editors, SQL clients, docs workspaces, and multi-document tools.

## Import

```tsx
import { BrowserTabs, type BrowserTab } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { useState } from "react";
import { BrowserTabs, type BrowserTab } from "@infinibay/harbor/layout";

export function EditorTabs() {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: "schema", title: "schema.sql", pinned: true },
    { id: "query", title: "query.ts", loading: false },
  ]);
  const [activeId, setActiveId] = useState("schema");

  return (
    <BrowserTabs
      tabs={tabs}
      activeId={activeId}
      onActivate={setActiveId}
      onReorder={setTabs}
      onClose={(id) => setTabs((current) => current.filter((tab) => tab.id !== id))}
      onNew={() => createNewTab()}
    />
  );
}
```

## Data Model

```ts
type BrowserTab = {
  id: string;
  title: string;
  icon?: ReactNode;
  pinned?: boolean;
  loading?: boolean;
};
```

Pinned tabs cannot be dragged or closed. Loading tabs show a spinner in the icon slot.

## Props

- **tabs**: `BrowserTab[]`. Required controlled tab order.
- **activeId**: `string`. Required selected tab id.
- **onActivate**: `(id: string) => void`. Required activation callback.
- **onClose**: `(id: string) => void`. Enables close buttons for unpinned tabs.
- **onReorder**: `(tabs: BrowserTab[]) => void`. Enables controlled reordering.
- **onNew**: `() => void`. Enables the new-tab button.
- **className**: custom class on the tab strip.

## Accessibility

Tab items are keyboard focusable, expose the active item with `aria-current`, and activate with Enter or Space. The close and new buttons have labels. Pair the strip with a corresponding panel region in the consuming app so the active tab controls visible content.

## Gotchas

- Reordering is powered by Framer Motion `Reorder`, so `tabs` must be stable objects or updated from `onReorder`.
- Closing the active tab is your responsibility. Choose the next active id before or after removing it.
- Pinned tabs still call `onActivate`; they only disable drag/close.
- The component renders the strip, not the tab panels.

## Related

- [`WindowFrame`](./WindowFrame.md) for desktop/browser chrome.
- [`MenuBar`](./MenuBar.md) for app menus above tabs.
- [`EditorTabs`](./EditorTabs.md) for editor-specific tabs.
