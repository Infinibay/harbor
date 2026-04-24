import { useEffect, useMemo, useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import {
  Badge,
  Button,
  DataTable,
  type ColumnDef,
  type PaginationState,
  type SortState,
} from "../../components";

/* Synthetic dataset: 10,000 rows of "services" so virtualization has
 * something to chew on. */
type Service = {
  id: string;
  name: string;
  owner: string;
  region: string;
  env: "prod" | "staging" | "dev";
  cpu: number;
  memory: number;
  requests: number;
  uptime: number;
  status: "healthy" | "degraded" | "failing";
  lastDeploy: string;
};

const REGIONS = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", "sa-east-1"];
const OWNERS = ["platform", "growth", "payments", "identity", "search", "data", "infra"];
const ENVS: Service["env"][] = ["prod", "staging", "dev"];
const STATUSES: Service["status"][] = ["healthy", "degraded", "failing"];

function seed(n: number): Service[] {
  const rows: Service[] = [];
  for (let i = 0; i < n; i++) {
    const owner = OWNERS[i % OWNERS.length];
    const region = REGIONS[i % REGIONS.length];
    const env = ENVS[i % ENVS.length];
    const status = STATUSES[i % STATUSES.length];
    rows.push({
      id: `svc-${i}`,
      name: `${owner}-${env}-${i.toString(36).padStart(3, "0")}`,
      owner,
      region,
      env,
      cpu: (i * 37) % 101,
      memory: (i * 53) % 101,
      requests: ((i * 971) % 100000) + 100,
      uptime: 99 + ((i * 0.0123) % 1),
      status,
      lastDeploy: `${Math.max(1, (i * 7) % 72)}h ago`,
    });
  }
  return rows;
}

function statusTone(s: Service["status"]) {
  return s === "healthy" ? "success" : s === "degraded" ? "warning" : "danger";
}

export function DataTablePage() {
  const small = useMemo(() => seed(25), []);
  const medium = useMemo(() => seed(500), []);
  const large = useMemo(() => seed(10000), []);

  const baseColumns: ColumnDef<Service>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Service",
        sortable: true,
        filterable: { type: "text" },
        width: 220,
        cell: ({ row }) => (
          <span className="font-medium text-white">{row.name}</span>
        ),
      },
      {
        id: "owner",
        header: "Owner",
        sortable: true,
        filterable: {
          type: "select",
          options: OWNERS.map((o) => ({ value: o, label: o })),
        },
        width: 140,
      },
      {
        id: "region",
        header: "Region",
        sortable: true,
        width: 160,
      },
      {
        id: "env",
        header: "Env",
        sortable: true,
        width: 100,
        cell: ({ row }) => (
          <Badge
            tone={
              row.env === "prod"
                ? "danger"
                : row.env === "staging"
                  ? "warning"
                  : "neutral"
            }
          >
            {row.env}
          </Badge>
        ),
      },
      {
        id: "cpu",
        header: "CPU %",
        sortable: true,
        align: "end",
        width: 110,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">{row.cpu}</span>
        ),
      },
      {
        id: "memory",
        header: "Memory %",
        sortable: true,
        align: "end",
        width: 120,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">{row.memory}</span>
        ),
      },
      {
        id: "requests",
        header: "Requests",
        sortable: true,
        align: "end",
        width: 130,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {row.requests.toLocaleString()}
          </span>
        ),
      },
      {
        id: "uptime",
        header: "Uptime",
        sortable: true,
        align: "end",
        width: 110,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {row.uptime.toFixed(2)}%
          </span>
        ),
      },
      {
        id: "lastDeploy",
        header: "Deploy",
        width: 120,
      },
      {
        id: "status",
        header: "Status",
        sortable: true,
        width: 130,
        cell: ({ row }) => (
          <Badge pulse tone={statusTone(row.status)}>
            {row.status}
          </Badge>
        ),
      },
    ],
    [],
  );

  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Group
      id="datatable"
      title="DataTable · enterprise"
      desc="Sort (multi-column with Shift · per-column menu), filter, paginate, select (single · multi · Shift-range), virtualize up to 100k rows, column resize (drag right edge · double-click auto-sizes), column pin start / end, column hide / reorder via header ⋯ menu or the Columns picker, full keyboard navigation (arrows · Space · Enter · Esc · Cmd/Ctrl+A)."
    >
      <Demo
        title="Baseline — 25 rows"
        hint="All features enabled except virtualization. Click headers to sort; drag a header's right edge to resize."
        intensity="soft"
        wide
      >
        <DataTable
          rows={small}
          columns={baseColumns}
          rowId={(r) => r.id}
          selectable
          selected={selected}
          onSelectionChange={setSelected}
          defaultPagination={{ pageSize: 10 }}
        />
      </Demo>

      <Demo
        title="Pinned columns — `Service` pinned start, `Status` pinned end"
        hint="Scroll horizontally — pinned columns stay stuck. Selection column is always start-pinned."
        intensity="soft"
        wide
      >
        <DataTable
          rows={small}
          columns={baseColumns.map((c) =>
            c.id === "name"
              ? { ...c, pinned: "start" as const }
              : c.id === "status"
                ? { ...c, pinned: "end" as const }
                : c,
          )}
          rowId={(r) => r.id}
          selectable
          defaultPagination={{ pageSize: 10 }}
        />
      </Demo>

      <Demo
        title="Virtualized — 10,000 rows"
        hint="maxHeight triggers row virtualization. Scroll the body — only ~20 rows live in the DOM at any moment."
        intensity="soft"
        wide
      >
        <Col>
          <div className="text-xs text-white/50">
            Pagination is off (pageSize = 10000). Only the viewport window
            is rendered; the rest is padding-top / padding-bottom spacers.
            Smooth scroll at 60fps on a mid laptop.
          </div>
          <DataTable
            rows={large}
            columns={baseColumns.map((c) =>
              c.id === "name"
                ? { ...c, pinned: "start" as const }
                : c.id === "status"
                  ? { ...c, pinned: "end" as const }
                  : c,
            )}
            rowId={(r) => r.id}
            defaultPagination={{ pageSize: 10000 }}
            hidePagination
            maxHeight={520}
          />
        </Col>
      </Demo>

      <Demo
        title="Medium — 500 rows, filter + paginate"
        hint="Flip to larger page sizes to stress sort; filter logic cross-checks filter types."
        intensity="soft"
        wide
      >
        <DataTable
          rows={medium}
          columns={baseColumns}
          rowId={(r) => r.id}
          defaultPagination={{ pageSize: 50 }}
          defaultSort={[{ id: "cpu", direction: "desc" }]}
        />
      </Demo>

      <Demo
        title="Column menu + visibility picker + keyboard nav"
        hint="Hover any header for the ⋯ menu (sort · pin · hide · move). Toolbar 'Columns' re-shows hidden ones. Click the grid and use arrow keys / Space / Cmd-A."
        intensity="soft"
        wide
      >
        <DataTable
          rows={small}
          columns={baseColumns}
          rowId={(r) => r.id}
          selectable
          showColumnPicker
          defaultPagination={{ pageSize: 10 }}
        />
      </Demo>

      <Demo
        title="Loading skeletons"
        hint="Flip the toggle — while loading, N skeleton rows shimmer in place of the body. Header + toolbar stay put."
        intensity="soft"
        wide
      >
        <LoadingDemo rows={small} columns={baseColumns} />
      </Demo>

      <Demo
        title="Error state + retry"
        hint="When error is set, the body is replaced by an error panel with a Retry button."
        intensity="soft"
        wide
      >
        <ErrorDemo rows={small} columns={baseColumns} />
      </Demo>

      <Demo
        title="Server mode — debounced search, remote sort + paginate"
        hint="mode='server' stops local processing. Sort / search / page edits fire onXChange callbacks; the consumer fetches + re-supplies rows + totalCount. 500ms artificial latency so you see the skeleton."
        intensity="soft"
        wide
      >
        <ServerModeDemo pool={medium} columns={baseColumns} />
      </Demo>
    </Group>
  );
}

function LoadingDemo({
  rows,
  columns,
}: {
  rows: Service[];
  columns: ColumnDef<Service>[];
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Col>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setLoading((v) => !v)}>
          {loading ? "Stop loading" : "Start loading"}
        </Button>
      </div>
      <DataTable
        rows={rows}
        columns={columns}
        rowId={(r) => r.id}
        loading={loading}
        skeletonRows={6}
        defaultPagination={{ pageSize: 10 }}
      />
    </Col>
  );
}

function ErrorDemo({
  rows,
  columns,
}: {
  rows: Service[];
  columns: ColumnDef<Service>[];
}) {
  const [error, setError] = useState<string | null>(
    "Couldn't reach the services API (503 Service Unavailable).",
  );
  return (
    <DataTable
      rows={rows}
      columns={columns}
      rowId={(r) => r.id}
      error={error ?? undefined}
      onRetry={() => setError(null)}
      defaultPagination={{ pageSize: 10 }}
    />
  );
}

/** Simulated server adapter — filters + sorts + paginates against an
 *  in-memory pool, with artificial latency so the skeleton state is
 *  visible during interaction. A real consumer would call its own fetch
 *  here and pass the response rows + totalCount straight to DataTable. */
function ServerModeDemo({
  pool,
  columns,
}: {
  pool: Service[];
  columns: ColumnDef<Service>[];
}) {
  const [sort, setSort] = useState<SortState[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: 25,
  });
  const [rows, setRows] = useState<Service[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const h = window.setTimeout(() => {
      const q = globalFilter.trim().toLowerCase();
      let filtered = q
        ? pool.filter((r) =>
            [r.name, r.owner, r.region, r.env, r.status].some((v) =>
              String(v).toLowerCase().includes(q),
            ),
          )
        : pool;
      if (sort.length > 0) {
        filtered = [...filtered].sort((a, b) => {
          for (const s of sort) {
            const av = (a as unknown as Record<string, unknown>)[s.id];
            const bv = (b as unknown as Record<string, unknown>)[s.id];
            const cmp =
              typeof av === "number" && typeof bv === "number"
                ? av - bv
                : String(av).localeCompare(String(bv), undefined, {
                    numeric: true,
                  });
            if (cmp !== 0) return s.direction === "asc" ? cmp : -cmp;
          }
          return 0;
        });
      }
      const start = pagination.page * pagination.pageSize;
      setRows(filtered.slice(start, start + pagination.pageSize));
      setTotalCount(filtered.length);
      setLoading(false);
    }, 500);
    return () => window.clearTimeout(h);
  }, [sort, globalFilter, pagination, pool]);

  return (
    <DataTable
      mode="server"
      rows={rows}
      totalCount={totalCount}
      columns={columns}
      rowId={(r) => r.id}
      sort={sort}
      onSortChange={setSort}
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      pagination={pagination}
      onPaginationChange={setPagination}
      loading={loading}
      showGlobalSearch
      globalSearchDebounce={300}
    />
  );
}
