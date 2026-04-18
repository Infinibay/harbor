import { useRef, useState } from "react";
import { Group, Demo, Row } from "../../showcase/ShowcaseCard";
import { Canvas, CanvasItem, type CanvasHandle, type CanvasTransform } from "../../components";
import { Button } from "../../components";
import { HostCard } from "../../components";
import { Card } from "../../components";
import { Accordion, AccordionItem } from "../../components";
import { TreeView } from "../../components";
import { ScrollArea } from "../../components";
import { Sidebar } from "../../components";
import { NavBar } from "../../components";
import { Avatar } from "../../components";
import { Badge } from "../../components";
import { IconButton } from "../../components";
import { RailSidebar } from "../../components";
import { CollapsibleSidebar } from "../../components";
import { FilterPanel } from "../../components";
import { SettingsPanel } from "../../components";
import { FolderIcon, FileIcon, HomeIcon, GearIcon, Spark, MagnifierIcon } from "../../showcase/icons";

export function ContainersPage() {
  const [sidebarSel, setSidebarSel] = useState("overview");
  const [treeSel, setTreeSel] = useState("api");
  const [nav, setNav] = useState("workloads");
  const [rail, setRail] = useState("files");
  const [collapsed, setCollapsed] = useState("projects");
  const [settings, setSettings] = useState("general");
  const [filters, setFilters] = useState<Record<string, string[]>>({
    status: ["running"],
    region: [],
  });

  return (
    <Group id="containers" title="Containers & data" desc="Accordion, tree, scroll area, sidebar.">
      <Demo title="Accordion" wide intensity="soft">
        <Accordion defaultValue="a" className="w-full">
          <AccordionItem value="a" title="What is Infinibay?">
            Infinibay is a managed cluster platform.
          </AccordionItem>
          <AccordionItem value="b" title="How does billing work?">
            Per-second pricing, no egress fees for the first 1TB.
          </AccordionItem>
          <AccordionItem value="c" title="Can I self-host?">
            Yes — enterprise tier includes on-prem deploys.
          </AccordionItem>
        </Accordion>
      </Demo>
      <Demo title="Tree view" intensity="soft">
        <div className="w-full">
          <TreeView
            defaultExpanded={["root", "services"]}
            selected={treeSel}
            onSelect={setTreeSel}
            nodes={[
              {
                id: "root",
                label: "production",
                icon: <FolderIcon />,
                children: [
                  {
                    id: "services",
                    label: "services",
                    icon: <FolderIcon />,
                    children: [
                      { id: "api", label: "api-gateway", icon: <FileIcon /> },
                      { id: "auth", label: "auth", icon: <FileIcon /> },
                    ],
                  },
                  {
                    id: "dbs",
                    label: "databases",
                    icon: <FolderIcon />,
                    children: [
                      { id: "pg", label: "postgres", icon: <FileIcon /> },
                      { id: "rd", label: "redis", icon: <FileIcon /> },
                    ],
                  },
                ],
              },
            ]}
          />
        </div>
      </Demo>
      <Demo title="Custom scroll area" hint="Thumb purple, auto-hide." intensity="soft">
        <ScrollArea maxHeight={200} className="w-full border border-white/8">
          <div className="p-4 space-y-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="text-sm text-white/70 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/70" />
                Event #{i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Demo>
      <Demo title="Sidebar" wide intensity="soft">
        <div className="w-full h-[380px] flex gap-4">
          <Sidebar
            selected={sidebarSel}
            onSelect={setSidebarSel}
            header={
              <Row>
                <Avatar name="Infinibay" size="md" />
                <div className="text-sm text-white font-semibold">Infinibay</div>
              </Row>
            }
            footer={
              <Row>
                <Avatar name="Andrés" status="online" size="sm" />
                <span className="text-xs text-white/60">andres@</span>
              </Row>
            }
            sections={[
              {
                items: [
                  { id: "overview", label: "Overview", icon: <HomeIcon /> },
                  { id: "services", label: "Services", icon: <FolderIcon />, badge: <Badge tone="purple">12</Badge> },
                  { id: "metrics", label: "Metrics", icon: <Spark /> },
                ],
              },
              {
                label: "Team",
                items: [
                  { id: "members", label: "Members", icon: <HomeIcon /> },
                  { id: "roles", label: "Roles", icon: <GearIcon /> },
                ],
              },
            ]}
          />
          <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/8 grid place-items-center text-white/40 text-sm">
            Selected: <span className="text-white ml-2">{sidebarSel}</span>
          </div>
        </div>
      </Demo>
      <Demo title="RailSidebar — icon-only (VS Code-style)" wide intensity="soft">
        <div className="w-full h-[360px] flex gap-4">
          <RailSidebar
            value={rail}
            onChange={setRail}
            header={
              <div
                className="w-8 h-8 rounded-lg grid place-items-center"
                style={{ background: "linear-gradient(135deg,#a855f7,#38bdf8)" }}
              >
                <span className="text-xs font-bold text-white">H</span>
              </div>
            }
            footer={<Avatar name="Andrés" size="sm" status="online" />}
            items={[
              { id: "files", label: "Files", icon: <FolderIcon /> },
              { id: "search", label: "Search", icon: <MagnifierIcon /> },
              { id: "explorer", label: "Explorer", icon: <HomeIcon /> },
              { id: "extensions", label: "Extensions", icon: <Spark /> },
              { id: "settings", label: "Settings", icon: <GearIcon /> },
            ]}
          />
          <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/8 grid place-items-center text-white/40 text-sm">
            Active: <span className="text-white ml-2">{rail}</span>
          </div>
        </div>
      </Demo>

      <Demo title="CollapsibleSidebar" hint="Toggle ↔ collapsa a iconos con tooltips." wide intensity="soft">
        <div className="w-full h-[380px] flex gap-4">
          <CollapsibleSidebar
            value={collapsed}
            onChange={setCollapsed}
            header={
              <Row>
                <Avatar name="Infinibay" size="sm" />
                <div className="text-sm text-white font-semibold truncate">
                  Infinibay
                </div>
              </Row>
            }
            footer={<Avatar name="Andrés" size="sm" status="online" />}
            sections={[
              {
                items: [
                  { id: "overview", label: "Overview", icon: <HomeIcon /> },
                  {
                    id: "projects",
                    label: "Projects",
                    icon: <FolderIcon />,
                    badge: <Badge tone="purple">12</Badge>,
                  },
                  { id: "search", label: "Search", icon: <MagnifierIcon /> },
                ],
              },
              {
                label: "Team",
                items: [
                  { id: "members", label: "Members", icon: <HomeIcon /> },
                  { id: "settings", label: "Settings", icon: <GearIcon /> },
                ],
              },
            ]}
          />
          <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/8 grid place-items-center text-white/40 text-sm">
            Active: <span className="text-white ml-2">{collapsed}</span>
          </div>
        </div>
      </Demo>

      <Demo title="FilterPanel" hint="Filtros con checkboxes/radios por grupo." wide intensity="soft">
        <div className="w-full h-[420px] flex gap-4">
          <FilterPanel
            value={filters}
            onChange={setFilters}
            onClear={() => setFilters({ status: [], region: [], kind: [] })}
            groups={[
              {
                id: "status",
                label: "Status",
                options: [
                  { value: "running", label: "Running", count: 12 },
                  { value: "failed", label: "Failed", count: 3 },
                  { value: "pending", label: "Pending", count: 1 },
                ],
              },
              {
                id: "region",
                label: "Region",
                options: [
                  { value: "eu-west-1", label: "eu-west-1", count: 6 },
                  { value: "us-east-1", label: "us-east-1", count: 8 },
                  { value: "ap-south-1", label: "ap-south-1", count: 2 },
                ],
              },
              {
                id: "kind",
                label: "Plan",
                type: "radio",
                options: [
                  { value: "hobby", label: "Hobby" },
                  { value: "pro", label: "Pro" },
                  { value: "ent", label: "Enterprise" },
                ],
              },
            ]}
          />
          <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/8 p-4 text-xs text-white/50 overflow-auto">
            <div className="font-mono whitespace-pre">
              {JSON.stringify(filters, null, 2)}
            </div>
          </div>
        </div>
      </Demo>

      <Demo title="SettingsPanel" hint="Para apps con muchas preferencias." wide intensity="soft">
        <div className="w-full h-[380px] flex gap-4">
          <SettingsPanel
            value={settings}
            onChange={setSettings}
            header={
              <Row>
                <Avatar name="Andrés" size="sm" status="online" />
                <div className="text-sm text-white font-semibold truncate">Settings</div>
              </Row>
            }
            sections={[
              {
                label: "Account",
                items: [
                  { id: "general", label: "General", icon: <HomeIcon />, description: "Profile, region" },
                  { id: "billing", label: "Billing", icon: <Spark />, description: "Plan & usage" },
                  { id: "security", label: "Security", icon: <GearIcon />, description: "2FA, sessions" },
                ],
              },
              {
                label: "Workspace",
                items: [
                  { id: "members", label: "Members", icon: <HomeIcon /> },
                  { id: "integrations", label: "Integrations", icon: <FolderIcon /> },
                  { id: "audit", label: "Audit log", icon: <FileIcon /> },
                ],
              },
            ]}
          />
          <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/8 p-6 text-sm text-white/65">
            <div className="text-white font-semibold text-base capitalize">{settings}</div>
            <div className="mt-2">Content for <span className="text-white">{settings}</span> pane.</div>
          </div>
        </div>
      </Demo>

      <Demo title="Nav bar" wide intensity="soft">
        <NavBar
          value={nav}
          onChange={setNav}
          brand="Infinibay"
          items={[
            { id: "workloads", label: "Workloads" },
            { id: "networks", label: "Networks" },
            { id: "storage", label: "Storage" },
            { id: "billing", label: "Billing" },
          ]}
          right={
            <Row>
              <IconButton size="sm" variant="ghost" label="Search" icon={<MagnifierIcon />} />
              <Avatar name="Andrés" size="sm" status="online" interactive />
            </Row>
          }
        />
      </Demo>

      <Demo
        title="Canvas · infinite GPU-accelerated world"
        hint="Space + drag to pan · wheel to zoom · React children just work"
        wide
        intensity="soft"
      >
        <CanvasDemo />
      </Demo>
    </Group>
  );
}

function CanvasDemo() {
  const canvasRef = useRef<CanvasHandle>(null);
  const [transform, setTransform] = useState<CanvasTransform>({
    x: 0,
    y: 0,
    zoom: 1,
  });
  const [notes, setNotes] = useState([
    { id: "n1", x: 80, y: 80, text: "Drag me — space+drag pans the view." },
    { id: "n2", x: 560, y: 320, text: "Scroll to zoom around the cursor." },
  ]);

  return (
    <div className="w-full flex flex-col gap-3">
      <Row className="justify-between items-center">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => canvasRef.current?.reset()}>
            Reset
          </Button>
          <Button size="sm" variant="ghost" onClick={() => canvasRef.current?.fit()}>
            Fit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              canvasRef.current?.zoomTo(Math.min(8, transform.zoom * 1.5))
            }
          >
            Zoom in
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              canvasRef.current?.zoomTo(Math.max(0.1, transform.zoom / 1.5))
            }
          >
            Zoom out
          </Button>
        </div>
        <div className="text-xs text-white/50 tabular-nums font-mono">
          x {transform.x.toFixed(0)} · y {transform.y.toFixed(0)} · zoom{" "}
          {transform.zoom.toFixed(2)}
        </div>
      </Row>
      <Canvas
        ref={canvasRef}
        grid="dots"
        gridSize={28}
        onTransformChange={setTransform}
        className="h-[520px] rounded-2xl border border-white/10 bg-white/[0.02]"
        defaultTransform={{ x: 40, y: 40, zoom: 1 }}
      >
        <CanvasItem x={40} y={40}>
          <HostCard
            name="api-gateway-01"
            subtitle="Ubuntu 24.04 · 8 vCPU · 16 GB"
            status="online"
            cpu={42}
            ram={{ used: 11.8, total: 16 }}
            disk={{ used: 180, total: 500 }}
            tags={["eu-west-1", "prod"]}
            className="w-80"
          />
        </CanvasItem>
        <CanvasItem x={480} y={40}>
          <HostCard
            name="worker-db-02"
            subtitle="PostgreSQL replica"
            status="degraded"
            cpu={88}
            ram={{ used: 14.2, total: 16 }}
            disk={{ used: 450, total: 500 }}
            tags={["eu-west-1", "prod"]}
            className="w-80"
          />
        </CanvasItem>
        <CanvasItem x={260} y={360}>
          <Card
            title="Everything is just JSX"
            description="Buttons, inputs, cards — they all render inside the world with GPU-accelerated transforms."
            className="w-72"
          >
            <Row className="gap-2 pt-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
            </Row>
          </Card>
        </CanvasItem>
        {notes.map((n) => (
          <CanvasItem
            key={n.id}
            x={n.x}
            y={n.y}
            draggable
            onDrag={(pos) =>
              setNotes((prev) =>
                prev.map((p) => (p.id === n.id ? { ...p, ...pos } : p)),
              )
            }
          >
            <div className="px-3 py-2 rounded-lg bg-amber-300/90 text-slate-900 text-xs font-medium shadow-lg select-none w-52 cursor-grab active:cursor-grabbing">
              {n.text}
            </div>
          </CanvasItem>
        ))}
        <CanvasItem x={920} y={240} fixedSize>
          <div className="px-2 py-1 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-100 text-[10px] uppercase tracking-widest">
            fixed-size pin
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}
