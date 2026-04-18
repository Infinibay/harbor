import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { WindowFrame } from "../../components";
import { MenuBar } from "../../components";
import { StatusBar, StatusItem, StatusSeparator } from "../../components";
import { SplitPane } from "../../components";
import { TreeView } from "../../components";
import { CodeBlock } from "../../components";
import { Inspector, PropertyRow, InspectorNumber } from "../../components";
import { JsonViewer } from "../../components";
import { FindBar } from "../../components";
import { ShortcutSheet } from "../../components";
import { Button } from "../../components";
import { FolderIcon, FileIcon } from "../../showcase/icons";

export function IDEPage() {
  const [zoom, setZoom] = useState(125);
  const [inspFill, setInspFill] = useState(100);
  const [inspRotation, setInspRotation] = useState(0);
  const [findOpen, setFindOpen] = useState(false);
  const [cheatSheet, setCheatSheet] = useState(false);

  return (
    <Group
      id="ide"
      title="IDE · editor layout"
      desc="WindowFrame + MenuBar + StatusBar + SplitPane para chrome de IDE real."
    >
      <Demo title="Full IDE layout" hint="Files · editor · inspector · status bar." wide intensity="soft">
        <WindowFrame
          className="h-[440px] w-full"
          title="api-gateway — cluster-eu-west"
          subtitle="production"
          chromeStyle="macos"
          toolbar={
            <MenuBar
              items={[
                {
                  id: "file",
                  label: "File",
                  children: [
                    { id: "new", label: "New", shortcut: "⌘N", onSelect: () => {} },
                    { id: "open", label: "Open…", shortcut: "⌘O", onSelect: () => {} },
                    { id: "sep1", label: "", separator: true },
                    {
                      id: "recent",
                      label: "Open recent",
                      submenu: [
                        { id: "r1", label: "cluster-eu-west", onSelect: () => {} },
                        { id: "r2", label: "cluster-us-east", onSelect: () => {} },
                      ],
                    },
                    { id: "sep2", label: "", separator: true },
                    { id: "close", label: "Close window", shortcut: "⌘W", onSelect: () => {} },
                  ],
                },
                {
                  id: "edit",
                  label: "Edit",
                  children: [
                    { id: "undo", label: "Undo", shortcut: "⌘Z", onSelect: () => {} },
                    { id: "redo", label: "Redo", shortcut: "⇧⌘Z", onSelect: () => {} },
                    { id: "sep", label: "", separator: true },
                    { id: "find", label: "Find…", shortcut: "⌘F", onSelect: () => setFindOpen(true) },
                  ],
                },
                {
                  id: "view",
                  label: "View",
                  children: [
                    { id: "inspector", label: "Show inspector", checked: true, onSelect: () => {} },
                    { id: "minimap", label: "Show minimap", checked: true, onSelect: () => {} },
                    { id: "sep", label: "", separator: true },
                    { id: "zoomin", label: "Zoom in", shortcut: "⌘+", onSelect: () => setZoom(Math.min(400, zoom + 10)) },
                    { id: "zoomout", label: "Zoom out", shortcut: "⌘-", onSelect: () => setZoom(Math.max(10, zoom - 10)) },
                  ],
                },
                {
                  id: "help",
                  label: "Help",
                  children: [
                    { id: "cheat", label: "Keyboard shortcuts…", shortcut: "?", onSelect: () => setCheatSheet(true) },
                  ],
                },
              ]}
            />
          }
          statusBar={
            <StatusBar>
              <StatusItem tone="success">● connected</StatusItem>
              <StatusSeparator />
              <StatusItem>TypeScript 5.5</StatusItem>
              <StatusSeparator />
              <StatusItem>UTF-8 · LF</StatusItem>
              <span className="flex-1" />
              <StatusItem onClick={() => setFindOpen(true)}>Find · ⌘F</StatusItem>
              <StatusSeparator />
              <StatusItem onClick={() => setCheatSheet(true)}>Shortcuts · ?</StatusItem>
            </StatusBar>
          }
        >
          <SplitPane
            initialSize={200}
            min={140}
            max={320}
            first={
              <div className="h-full bg-white/[0.02]">
                <TreeView
                  className="p-2"
                  defaultExpanded={["root", "src"]}
                  nodes={[
                    {
                      id: "root",
                      label: "api-gateway",
                      icon: <FolderIcon />,
                      children: [
                        {
                          id: "src",
                          label: "src",
                          icon: <FolderIcon />,
                          children: [
                            { id: "index", label: "index.ts", icon: <FileIcon /> },
                            { id: "routes", label: "routes.ts", icon: <FileIcon /> },
                            { id: "mw", label: "middleware.ts", icon: <FileIcon /> },
                          ],
                        },
                        { id: "pkg", label: "package.json", icon: <FileIcon /> },
                        { id: "rd", label: "README.md", icon: <FileIcon /> },
                      ],
                    },
                  ]}
                />
              </div>
            }
            second={
              <SplitPane
                initialSize={320}
                min={240}
                max={480}
                first={
                  <div className="h-full p-3">
                    <CodeBlock
                      lang="ts"
                      title="src/routes.ts"
                      code={`import { Router } from "./runtime";

export const routes = new Router();

routes.get("/health", () => ({ ok: true }));
routes.get("/metrics", (ctx) => ctx.json(metrics()));`}
                    />
                  </div>
                }
                second={
                  <div className="h-full bg-[#0a0a10]">
                    <Inspector
                      className="m-3"
                      sections={[
                        {
                          id: "transform",
                          title: "Transform",
                          children: (
                            <>
                              <PropertyRow label="Fill">
                                <InspectorNumber value={inspFill} onChange={setInspFill} unit="%" min={0} max={100} />
                              </PropertyRow>
                              <PropertyRow label="Rotation">
                                <InspectorNumber value={inspRotation} onChange={setInspRotation} unit="°" min={-180} max={180} />
                              </PropertyRow>
                            </>
                          ),
                        },
                        {
                          id: "json",
                          title: "JSON payload",
                          collapsed: true,
                          children: (
                            <JsonViewer
                              data={{
                                service: "api-gateway",
                                replicas: 3,
                                env: ["prod", "eu-west-1"],
                                config: { timeout: 30, retries: 2 },
                              }}
                            />
                          ),
                        },
                      ]}
                    />
                  </div>
                }
              />
            }
          />
        </WindowFrame>
      </Demo>

      <Demo title="Find bar & shortcut sheet" wide intensity="soft">
        <Col>
          <Row>
            <Button variant="secondary" onClick={() => setFindOpen(true)}>
              Open find bar ⌘F
            </Button>
            <Button variant="secondary" onClick={() => setCheatSheet(true)}>
              Show shortcuts ?
            </Button>
          </Row>
          <FindBar
            open={findOpen}
            onClose={() => setFindOpen(false)}
            total={12}
            current={3}
            showReplace
            onReplace={() => {}}
            onNext={() => {}}
            onPrev={() => {}}
            onCaseToggle={() => {}}
            onRegexToggle={() => {}}
          />
          <ShortcutSheet
            open={cheatSheet}
            onClose={() => setCheatSheet(false)}
            groups={[
              {
                title: "Navigation",
                items: [
                  { keys: ["⌘", "K"], description: "Command palette" },
                  { keys: ["⌘", "P"], description: "Quick open" },
                  { keys: ["⌘", "B"], description: "Toggle sidebar" },
                  { keys: ["⌘", "J"], description: "Toggle terminal" },
                ],
              },
              {
                title: "Edit",
                items: [
                  { keys: ["⌘", "Z"], description: "Undo" },
                  { keys: ["⇧", "⌘", "Z"], description: "Redo" },
                  { keys: ["⌘", "X"], description: "Cut" },
                  { keys: ["⌘", "C"], description: "Copy" },
                  { keys: ["⌘", "V"], description: "Paste" },
                ],
              },
              {
                title: "Search",
                items: [
                  { keys: ["⌘", "F"], description: "Find in file" },
                  { keys: ["⇧", "⌘", "F"], description: "Find in project" },
                  { keys: ["⌘", "G"], description: "Next match" },
                  { keys: ["⇧", "⌘", "G"], description: "Previous match" },
                ],
              },
            ]}
          />
        </Col>
      </Demo>

      <Demo title="JSON viewer" wide intensity="soft">
        <JsonViewer
          data={{
            service: "api-gateway",
            version: "2.3.0",
            replicas: 3,
            env: "production",
            config: {
              timeout: 30,
              retries: 2,
              regions: ["eu-west-1", "us-east-1"],
              features: {
                rateLimit: true,
                caching: { enabled: true, ttl: 60 },
                tracing: null,
              },
            },
            active: true,
            uptime: 184532,
          }}
        />
      </Demo>
    </Group>
  );
}
