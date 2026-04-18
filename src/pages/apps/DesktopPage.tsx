import { useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import { BrowserTabs, type BrowserTab } from "../../components";
import { Dock } from "../../components";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "../../components";
import { ZoomControls } from "../../components";
import { ToggleGroup } from "../../components";
import { IconButton } from "../../components";
import { WindowFrame } from "../../components";
import { FolderIcon } from "../../showcase/icons";

export function DesktopPage() {
  const [browserTabs, setBrowserTabs] = useState<BrowserTab[]>([
    { id: "t1", title: "docs · infinibay", pinned: true, icon: "📘" },
    { id: "t2", title: "Grafana / cluster", icon: "📊" },
    { id: "t3", title: "Deploy logs", loading: true },
    { id: "t4", title: "worker-pool#92" },
  ]);
  const [activeTab, setActiveTab] = useState("t2");
  const [dockActive, setDockActive] = useState("finder");
  const [zoom, setZoom] = useState(125);

  return (
    <Group id="desktop" title="Desktop · chrome nativo" desc="WindowFrame, Dock, Toolbar, BrowserTabs.">
      <Demo title="Window frame variants" hint="macOS y Windows chrome." wide intensity="soft">
        <Col>
          <WindowFrame
            className="h-[140px] w-full"
            title="Untitled.txt"
            subtitle="Edited"
            chromeStyle="macos"
          >
            <div className="p-4 text-sm text-white/70">macOS traffic lights style.</div>
          </WindowFrame>
          <WindowFrame
            className="h-[140px] w-full"
            title="Notepad"
            chromeStyle="windows"
          >
            <div className="p-4 text-sm text-white/70">Windows min/max/close buttons.</div>
          </WindowFrame>
        </Col>
      </Demo>

      <Demo title="Browser tabs" hint="Close, pinned, drag to reorder, new." wide intensity="soft">
        <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#0f0f16]">
          <BrowserTabs
            tabs={browserTabs}
            activeId={activeTab}
            onActivate={setActiveTab}
            onClose={(id) => {
              setBrowserTabs((ts) => ts.filter((t) => t.id !== id));
              if (id === activeTab) {
                setActiveTab(browserTabs.find((t) => t.id !== id)?.id ?? "");
              }
            }}
            onReorder={setBrowserTabs}
            onNew={() => {
              const id = `t${Date.now()}`;
              setBrowserTabs((ts) => [...ts, { id, title: "New tab", icon: "🆕" }]);
              setActiveTab(id);
            }}
          />
          <div className="h-20 grid place-items-center text-white/40 text-xs">
            Active: {browserTabs.find((t) => t.id === activeTab)?.title ?? "—"}
          </div>
        </div>
      </Demo>

      <Demo title="Toolbar + floating" wide intensity="soft">
        <Col>
          <Toolbar className="rounded-lg bg-white/[0.02] border border-white/10 px-1 py-1 w-full">
            <ToolbarGroup>
              <IconButton size="sm" variant="ghost" label="New" icon="＋" />
              <IconButton size="sm" variant="ghost" label="Open" icon={<FolderIcon />} />
              <IconButton size="sm" variant="ghost" label="Save" icon="💾" />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
              <IconButton size="sm" variant="ghost" label="Undo" icon="↺" />
              <IconButton size="sm" variant="ghost" label="Redo" icon="↻" />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
              <ToggleGroup
                size="sm"
                defaultValue="select"
                items={[
                  { value: "select", label: "⬚" },
                  { value: "pen", label: "✒" },
                  { value: "text", label: "T" },
                ]}
              />
            </ToolbarGroup>
            <span className="flex-1" />
            <ToolbarGroup>
              <ZoomControls value={zoom} onChange={setZoom} />
            </ToolbarGroup>
          </Toolbar>
          <Toolbar variant="floating">
            <IconButton size="sm" variant="ghost" label="Align left" icon="⬛" />
            <IconButton size="sm" variant="ghost" label="Align center" icon="⬜" />
            <IconButton size="sm" variant="ghost" label="Align right" icon="⬛" />
            <ToolbarSeparator />
            <IconButton size="sm" variant="ghost" label="Bold" icon="B" />
            <IconButton size="sm" variant="ghost" label="Italic" icon="I" />
          </Toolbar>
        </Col>
      </Demo>

      <Demo title="macOS-style dock" hint="Proximity magnification." wide intensity="soft">
        <div className="w-full flex justify-center py-6">
          <Dock
            items={[
              { id: "finder", label: "Finder", icon: "📁", active: dockActive === "finder" },
              { id: "code", label: "Code", icon: "💻", active: dockActive === "code" },
              { id: "mail", label: "Mail", icon: "✉️", active: dockActive === "mail", badge: <span className="w-4 h-4 rounded-full bg-rose-500 text-[9px] text-white grid place-items-center font-bold">3</span> },
              { id: "music", label: "Music", icon: "🎧", active: dockActive === "music" },
              { id: "figma", label: "Figma", icon: "🎨", active: dockActive === "figma" },
              { id: "slack", label: "Slack", icon: "💬", active: dockActive === "slack" },
              { id: "trash", label: "Trash", icon: "🗑️", active: dockActive === "trash" },
            ].map((i) => ({ ...i, onClick: () => setDockActive(i.id) }))}
          />
        </div>
      </Demo>
    </Group>
  );
}
