import { useState } from "react";
import { Group, Demo, Row } from "../../showcase/ShowcaseCard";
import { Breadcrumbs } from "../../components";
import { DataTable, type Column } from "../../components";
import { TreeView } from "../../components";
import { FileDrop } from "../../components";
import { Badge } from "../../components";
import { FolderIcon, FileIcon } from "../../showcase/icons";

type FileRow = {
  id: string;
  name: string;
  kind: "folder" | "file";
  ext?: string;
  size: string;
  modified: string;
};

export function FileManagerPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const files: FileRow[] = [
    { id: "1", name: "Documents", kind: "folder", size: "—", modified: "today" },
    { id: "2", name: "Screenshots", kind: "folder", size: "—", modified: "yesterday" },
    { id: "3", name: "README.md", kind: "file", ext: "md", size: "4.2 KB", modified: "2h ago" },
    { id: "4", name: "design-spec.fig", kind: "file", ext: "fig", size: "48.1 MB", modified: "yesterday" },
    { id: "5", name: "demo.mp4", kind: "file", ext: "mp4", size: "182 MB", modified: "3d ago" },
    { id: "6", name: "package.json", kind: "file", ext: "json", size: "1.4 KB", modified: "1w ago" },
    { id: "7", name: "archive.zip", kind: "file", ext: "zip", size: "340 MB", modified: "2w ago" },
  ];

  const cols: Column<FileRow>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (r) => (
        <span className="inline-flex items-center gap-2">
          <span className="text-white/60">
            {r.kind === "folder" ? <FolderIcon /> : <FileIcon />}
          </span>
          <span className="text-white">{r.name}</span>
          {r.ext ? (
            <Badge tone="neutral">{r.ext}</Badge>
          ) : null}
        </span>
      ),
    },
    {
      key: "size",
      label: "Size",
      align: "right",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-white/60 tabular-nums">{r.size}</span>
      ),
    },
    {
      key: "modified",
      label: "Modified",
      align: "right",
      sortable: true,
      render: (r) => <span className="text-white/50">{r.modified}</span>,
    },
  ];

  return (
    <Group id="files" title="File manager" desc="Sidebar tree + breadcrumbs + table + upload.">
      <Demo title="Breadcrumbs" wide>
        <Breadcrumbs
          items={[
            { label: "~" },
            { label: "Projects" },
            { label: "infinibay" },
            { label: "assets" },
          ]}
        />
      </Demo>

      <Demo title="Tree + table layout" wide>
        <div className="w-full flex gap-4 h-[380px]">
          <div className="w-56 rounded-xl bg-white/[0.02] border border-white/8 p-2 overflow-auto">
            <TreeView
              defaultExpanded={["root", "proj"]}
              nodes={[
                {
                  id: "root",
                  label: "~",
                  icon: <FolderIcon />,
                  children: [
                    {
                      id: "proj",
                      label: "Projects",
                      icon: <FolderIcon />,
                      children: [
                        { id: "infinibay", label: "infinibay", icon: <FolderIcon /> },
                        { id: "acme", label: "acme", icon: <FolderIcon /> },
                      ],
                    },
                    { id: "docs", label: "Documents", icon: <FolderIcon /> },
                    { id: "dl", label: "Downloads", icon: <FolderIcon /> },
                  ],
                },
              ]}
            />
          </div>
          <div className="flex-1 min-w-0 rounded-xl bg-white/[0.02] border border-white/8 overflow-auto">
            <DataTable
              rows={files}
              columns={cols}
              rowKey={(r) => r.id}
              selectable
              selected={selected}
              onSelectionChange={setSelected}
            />
          </div>
        </div>
      </Demo>

      <Demo title="Upload zone" wide>
        <FileDrop accept="image/*,application/pdf" />
      </Demo>

      <Demo title="Selection">
        <Row>
          <span className="text-sm text-white/70">
            {selected.length} selected
          </span>
          <Badge tone="purple">{selected.length} files</Badge>
        </Row>
      </Demo>
    </Group>
  );
}
