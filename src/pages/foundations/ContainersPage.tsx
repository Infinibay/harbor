import { useState } from "react";
import { Group, Demo, Row } from "../../showcase/ShowcaseCard";
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
    </Group>
  );
}
