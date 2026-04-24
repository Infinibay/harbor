import { useState, useMemo } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import { DataTable, type ColumnDef } from "../../components";
import { HeatmapCalendar } from "../../components";
import { Timeline } from "../../components";
import { Badge } from "../../components";
import { VirtualList } from "../../components";
import { InfiniteScroll } from "../../components";
import { MasonryGrid } from "../../components";
import { DiffViewer } from "../../components";
import { Row } from "../../showcase/ShowcaseCard";
import {
  ExportMenu,
  FacetedSearch,
  PropertyList,
  QueryBuilder,
  emptyQueryGroup,
  type FilterGroup,
  type QueryNode,
} from "../../components";

type Row = { id: string; name: string; status: string; cpu: number; mem: number; req: number };

export function DataPage() {
  const [tableSelected, setTableSelected] = useState<string[]>([]);

  const tableRows: Row[] = [
    { id: "n1", name: "api-gateway", status: "healthy", cpu: 42, mem: 68, req: 12400 },
    { id: "n2", name: "auth-service", status: "degraded", cpu: 88, mem: 72, req: 4200 },
    { id: "n3", name: "worker-pool", status: "healthy", cpu: 31, mem: 44, req: 8900 },
    { id: "n4", name: "billing", status: "healthy", cpu: 18, mem: 22, req: 620 },
    { id: "n5", name: "notifier", status: "failing", cpu: 2, mem: 8, req: 0 },
  ];
  const cols: ColumnDef<Row>[] = [
    { id: "name", header: "Service", sortable: true },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: ({ row }) => (
        <Badge
          pulse
          tone={
            row.status === "healthy"
              ? "success"
              : row.status === "degraded"
                ? "warning"
                : "danger"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: "cpu",
      header: "CPU",
      sortable: true,
      align: "end",
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-2 font-mono tabular-nums">
          {row.cpu}%
          <span className="w-12 h-1 rounded-full bg-white/5 overflow-hidden">
            <span
              className="block h-full"
              style={{
                width: `${row.cpu}%`,
                background:
                  row.cpu > 80
                    ? "rgb(244, 63, 94)"
                    : "linear-gradient(90deg,#a855f7,#38bdf8)",
              }}
            />
          </span>
        </div>
      ),
    },
    {
      id: "req",
      header: "Requests",
      sortable: true,
      align: "end",
      cell: ({ row }) => (
        <span className="font-mono tabular-nums">
          {row.req.toLocaleString()}
        </span>
      ),
    },
  ];

  const heatData = useMemo(() => {
    const d: Record<string, number> = {};
    const today = new Date();
    for (let i = 0; i < 140; i++) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() - i);
      d[dt.toISOString().slice(0, 10)] = Math.max(0, Math.round(Math.random() * 8 - 2));
    }
    return d;
  }, []);

  return (
    <Group id="data" title="Data · tablas, tiempo, viz" desc="DataTable sortable, heatmap, timeline.">
      <Demo title="DataTable" hint="Click headers para ordenar (↕ → ↑ → ↓)." wide intensity="soft">
        <DataTable
          rows={tableRows}
          columns={cols}
          rowId={(r) => r.id}
          selectable
          selected={tableSelected}
          onSelectionChange={setTableSelected}
        />
      </Demo>

      <Demo
        title="DataTable — isRowSelectable"
        hint="Per-row checkbox visibility. 'failing' rows are not selectable."
        wide
        intensity="soft"
      >
        <DataTable
          rows={tableRows}
          columns={cols}
          rowId={(r) => r.id}
          selectable
          isRowSelectable={(r) => r.status !== "failing"}
          selected={tableSelected}
          onSelectionChange={setTableSelected}
        />
      </Demo>

      <Demo
        title="DataTable — loading"
        hint="Built-in LoadingOverlay replaces the body while loading=true. Header stays in place."
        wide
        intensity="soft"
      >
        <DataTable
          rows={tableRows}
          columns={cols}
          rowId={(r) => r.id}
          loading
          loadingLabel="Fetching services…"
        />
      </Demo>
      <Demo title="Heatmap calendar" wide intensity="soft">
        <Col>
          <HeatmapCalendar data={heatData} weeks={24} />
          <span className="text-xs text-white/40">
            Contribution-style grid · hover to inspect
          </span>
        </Col>
      </Demo>
      <Demo title="Timeline" wide intensity="soft">
        <Timeline
          events={[
            { id: "1", title: "Deployed v2.3.0", description: "api-gateway · 0 rollbacks", time: "2m ago", tone: "success" },
            { id: "2", title: "CPU alert", description: "node-08 above 85%", time: "14m ago", tone: "warning" },
            { id: "3", title: "Invited Ana F.", time: "1h ago", tone: "info" },
            { id: "4", title: "Rotated credentials", description: "New tokens active", time: "yesterday", tone: "neutral" },
          ]}
        />
      </Demo>

      <Demo title="VirtualList — 10,000 rows" hint="Solo renderiza lo visible." wide intensity="soft">
        <VirtualList
          items={Array.from({ length: 10000 }, (_, i) => ({
            id: i,
            name: `event-${i.toString().padStart(5, "0")}`,
            ms: Math.round(Math.random() * 500),
          }))}
          itemHeight={36}
          height={260}
          className="w-full rounded-lg border border-white/8 bg-white/[0.02]"
          renderItem={(item) => (
            <div className="flex items-center gap-3 px-3 h-9 border-b border-white/5 text-sm">
              <span className="w-16 text-xs font-mono text-white/40 tabular-nums">
                #{item.id}
              </span>
              <span className="flex-1 truncate text-white/80">{item.name}</span>
              <span className="text-xs font-mono text-white/55 tabular-nums">
                {item.ms}ms
              </span>
            </div>
          )}
          keyFor={(i) => i.id}
        />
      </Demo>

      <Demo title="InfiniteScroll" hint="Observa el sentinel al final." wide intensity="soft">
        <InfiniteScrollDemo />
      </Demo>

      <Demo title="MasonryGrid" hint="Columnas balanceadas." wide intensity="soft">
        <MasonryGrid columns={3}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 p-4 text-sm text-white/75"
              style={{
                minHeight: 60 + (i % 4) * 40,
                background: `linear-gradient(135deg, ${
                  ["#a855f725", "#38bdf825", "#f472b625", "#34d39925"][i % 4]
                }, transparent)`,
              }}
            >
              Card #{i + 1}
            </div>
          ))}
        </MasonryGrid>
      </Demo>

      <Demo title="DiffViewer — unified" wide intensity="soft">
        <DiffViewer
          oldText={`function hello(name) {
  return "hi " + name;
}`}
          newText={`function hello(name, greeting = "hi") {
  return \`\${greeting} \${name}\`;
}`}
        />
      </Demo>

      <Demo title="DiffViewer — split" wide intensity="soft">
        <DiffViewer
          mode="split"
          oldLabel="main"
          newLabel="feature"
          oldText={`export const config = {
  retries: 1,
  timeout: 10,
  debug: false,
};`}
          newText={`export const config = {
  retries: 3,
  timeout: 30,
  debug: true,
  tracing: "otlp",
};`}
        />
      </Demo>

      <DataQueryPackDemo />
    </Group>
  );
}

// === Pack 10: data + query demos ================================

const FACET_GROUPS: FilterGroup[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { value: "running", label: "Running", count: 12 },
      { value: "degraded", label: "Degraded", count: 2 },
      { value: "failed", label: "Failed", count: 1 },
    ],
  },
  {
    id: "region",
    label: "Region",
    options: [
      { value: "eu-west-1", label: "eu-west-1", count: 8 },
      { value: "us-east-1", label: "us-east-1", count: 6 },
      { value: "ap-southeast-1", label: "ap-southeast-1", count: 1 },
    ],
  },
  {
    id: "tier",
    label: "Tier",
    type: "radio",
    options: [
      { value: "prod", label: "Production" },
      { value: "staging", label: "Staging" },
      { value: "dev", label: "Dev" },
    ],
  },
];

function DataQueryPackDemo() {
  const [filter, setFilter] = useState<Record<string, string[]>>({ status: ["running"] });
  const [query, setQuery] = useState<QueryNode>(() => ({
    ...emptyQueryGroup("and"),
    children: [
      { kind: "condition", id: "q1", field: "name", op: "contains", value: "gateway" },
      { kind: "condition", id: "q2", field: "cpu", op: ">", value: 70 },
    ],
  }));
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  return (
    <>
      <Demo
        title="FacetedSearch · active chips + saved views"
        hint="Extends FilterPanel — same `groups` schema"
        wide
        intensity="soft"
      >
        <FacetedSearch
          groups={FACET_GROUPS}
          value={filter}
          onChange={setFilter}
        />
      </Demo>

      <Demo
        title="QueryBuilder · nested AND/OR"
        hint="Caller defines `fields` · component emits a structured tree"
        wide
        intensity="soft"
      >
        <Col className="gap-3 w-full">
          <QueryBuilder
            value={query}
            onChange={setQuery}
            fields={[
              { id: "name", label: "Name", kind: "string" },
              { id: "status", label: "Status", kind: "enum", options: [
                { value: "running", label: "Running" },
                { value: "degraded", label: "Degraded" },
                { value: "failed", label: "Failed" },
              ] },
              { id: "cpu", label: "CPU %", kind: "number" },
              { id: "ram", label: "RAM %", kind: "number" },
              { id: "created_at", label: "Created at", kind: "date" },
            ]}
          />
          <pre className="text-[10px] text-white/50 bg-white/[0.03] rounded p-3 overflow-auto font-mono max-h-40">
            {JSON.stringify(query, null, 2)}
          </pre>
        </Col>
      </Demo>

      <Demo title="ExportMenu" hint="Format + options · emits onExport" wide intensity="soft">
        <Row className="gap-3 items-center">
          <ExportMenu
            onExport={(opts) =>
              setExportMsg(`exporting as ${opts.format.toUpperCase()} · headers=${opts.includeHeaders} · filterOnly=${opts.currentFilterOnly} · allCols=${opts.allColumns}`)
            }
          />
          {exportMsg ? (
            <span className="text-xs text-white/60 tabular-nums font-mono">{exportMsg}</span>
          ) : null}
        </Row>
      </Demo>

      <Demo title="PropertyList · AWS/GCP-style details pane" wide intensity="soft">
        <PropertyList
          items={[
            { key: "id", label: "ID", value: "vm-014a9b2", copyable: true, section: "Identity" },
            { key: "name", label: "Name", value: "api-gateway-01", editable: true, onChange: () => {}, section: "Identity" },
            { key: "region", label: "Region", value: "eu-west-1a", section: "Identity" },
            { key: "cpu", label: "CPU", value: "8 vCPU", section: "Compute" },
            { key: "ram", label: "RAM", value: "16 GiB", section: "Compute" },
            { key: "disk", label: "Disk", value: "500 GiB · NVMe", section: "Compute" },
            { key: "private", label: "Private IP", value: "10.0.12.42", copyable: true, section: "Network" },
            { key: "public", label: "Public IP", value: "54.201.144.7", copyable: true, section: "Network" },
            { key: "vpc", label: "VPC", value: "vpc-infinibay-prod", section: "Network" },
            { key: "created", label: "Created", value: "2026-01-12T08:34:00Z", section: "Metadata" },
            { key: "owner", label: "Owner", value: "ada@infinibay.com", section: "Metadata" },
          ]}
        />
      </Demo>
    </>
  );
}

function InfiniteScrollDemo() {
  const [items, setItems] = useState(() => Array.from({ length: 20 }, (_, i) => i));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => {
        const next = prev.length + 20;
        if (next >= 80) setHasMore(false);
        return [...prev, ...Array.from({ length: 20 }, (_, i) => prev.length + i)];
      });
      setLoading(false);
    }, 600);
  }

  return (
    <div className="w-full max-h-[280px] overflow-auto rounded-lg border border-white/8 bg-white/[0.02] p-2">
      <InfiniteScroll
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        endMessage="No more items · 80 loaded"
      >
        {items.map((i) => (
          <div key={i} className="px-3 py-2 text-sm text-white/75 border-b border-white/5">
            Item #{i + 1}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
