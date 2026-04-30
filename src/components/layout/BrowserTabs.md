# BrowserTabs

Browser-style tab strip with reorderable, closable, pinnable tabs and
an optional new-tab button. Drag-to-reorder is powered by
`framer-motion`'s `Reorder.Group`; the active-tab underline animates
via shared `layoutId`. Pair it with `<WindowFrame>` for a full
browser mock, or use it standalone for tabbed UIs.

## Import

```tsx
import { BrowserTabs, type BrowserTab } from "@infinibay/harbor/layout";
```

## Example

```tsx
const [tabs, setTabs] = useState<BrowserTab[]>([
  { id: "1", title: "harbor", pinned: true },
  { id: "2", title: "docs" },
  { id: "3", title: "github", loading: true },
]);
const [active, setActive] = useState("2");

<BrowserTabs
  tabs={tabs}
  activeId={active}
  onActivate={setActive}
  onClose={(id) => setTabs((t) => t.filter((x) => x.id !== id))}
  onReorder={setTabs}
  onNew={() => setTabs((t) => [...t, { id: crypto.randomUUID(), title: "new tab" }])}
/>
```

## Props

- **tabs** — `BrowserTab[]`. Required. Each tab has `id`, `title`,
  optional `icon`, `pinned`, `loading`.
- **activeId** — `string`. Required. The currently active tab id.
- **onActivate** — `(id: string) => void`. Required. Fires on click.
- **onClose** — `(id: string) => void`. Optional. Without it, the ×
  button is hidden. Pinned tabs never show ×.
- **onReorder** — `(tabs: BrowserTab[]) => void`. Optional. Without it
  drag-to-reorder is effectively read-only.
- **onNew** — `() => void`. Optional. Renders a `+` button at the end
  of the strip when provided.
- **className** — extra classes on the wrapper.

## Notes

- Pinned tabs are not draggable (`dragListener={!pinned}`).
- The loading icon is a small spinner; otherwise `icon ?? "🌐"` is
  used as a fallback.
- The active tab's bottom edge is animated with `layoutId="tab-bottom"`
  so it slides between tabs when you switch.
