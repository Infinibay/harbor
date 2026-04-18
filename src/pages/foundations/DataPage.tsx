import { useState, useMemo } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import { DataTable, type Column } from "../../components";
import { HeatmapCalendar } from "../../components";
import { Timeline } from "../../components";
import { Badge } from "../../components";
import { VirtualList } from "../../components";
import { InfiniteScroll } from "../../components";
import { MasonryGrid } from "../../components";
import { DiffViewer } from "../../components";

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
  const cols: Column<Row>[] = [
    { key: "name", label: "Service", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <Badge
          pulse
          tone={
            r.status === "healthy"
              ? "success"
              : r.status === "degraded"
                ? "warning"
                : "danger"
          }
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: "cpu",
      label: "CPU",
      sortable: true,
      align: "right",
      render: (r) => (
        <div className="inline-flex items-center gap-2 font-mono tabular-nums">
          {r.cpu}%
          <span className="w-12 h-1 rounded-full bg-white/5 overflow-hidden">
            <span
              className="block h-full"
              style={{
                width: `${r.cpu}%`,
                background:
                  r.cpu > 80
                    ? "rgb(244, 63, 94)"
                    : "linear-gradient(90deg,#a855f7,#38bdf8)",
              }}
            />
          </span>
        </div>
      ),
    },
    {
      key: "req",
      label: "Requests",
      sortable: true,
      align: "right",
      render: (r) => (
        <span className="font-mono tabular-nums">{r.req.toLocaleString()}</span>
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
      <Demo title="DataTable" hint="Click headers para ordenar." wide intensity="soft">
        <DataTable
          rows={tableRows}
          columns={cols}
          rowKey={(r) => r.id}
          selectable
          selected={tableSelected}
          onSelectionChange={setTableSelected}
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
    </Group>
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
