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
import { FolderIcon, FileIcon, HomeIcon, GearIcon, Spark, MagnifierIcon } from "../../showcase/icons";

export function ContainersPage() {
  const [sidebarSel, setSidebarSel] = useState("overview");
  const [treeSel, setTreeSel] = useState("api");
  const [nav, setNav] = useState("workloads");

  return (
    <Group id="containers" title="Containers & data" desc="Accordion, tree, scroll area, sidebar.">
      <Demo title="Accordion" wide>
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
      <Demo title="Tree view">
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
      <Demo title="Custom scroll area" hint="Thumb purple, auto-hide.">
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
      <Demo title="Sidebar" wide>
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
      <Demo title="Nav bar" wide>
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
