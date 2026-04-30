import { useState } from "react";
import { BrowserTabs, type BrowserTab } from "./BrowserTabs";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BrowserTabsDemo(props: any) {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: "1", title: "harbor", pinned: true },
    { id: "2", title: "Showcase · Layout" },
    { id: "3", title: "docs.infinibay.com", loading: true },
    { id: "4", title: "github.com/infinibay" },
  ]);
  const [active, setActive] = useState("2");

  return (
    <div style={{ width: "100%", maxWidth: 720 }} className="rounded-xl border border-white/10 bg-[#0f0f16]">
      <BrowserTabs
        {...props}
        tabs={tabs}
        activeId={active}
        onActivate={setActive}
        onReorder={setTabs}
        onClose={
          props.closable
            ? (id: string) => {
                setTabs((t) => t.filter((x) => x.id !== id));
                if (id === active && tabs.length > 1) {
                  const next = tabs.find((x) => x.id !== id);
                  if (next) setActive(next.id);
                }
              }
            : undefined
        }
        onNew={
          props.newTabButton
            ? () => {
                const id = String(Date.now());
                setTabs((t) => [...t, { id, title: "new tab" }]);
                setActive(id);
              }
            : undefined
        }
      />
      <div className="p-6 text-sm text-white/60">
        Active tab: <span className="text-white">{active}</span>
      </div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: BrowserTabsDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    closable: { type: "boolean", default: true, description: "Wire onClose so the × button shows on non-pinned tabs." },
    newTabButton: { type: "boolean", default: true, description: "Show the + new-tab button." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Read-only (no close, no new)", props: { closable: false, newTabButton: false } },
  ],
  events: [
    { name: "onActivate" },
    { name: "onClose" },
    { name: "onReorder" },
    { name: "onNew" },
  ],
  notes: "Drag tabs horizontally to reorder; pinned tabs stay put.",
};
