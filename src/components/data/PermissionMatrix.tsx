import { useMemo, useState } from "react";
import { cn } from "../../lib/cn";

export type PermissionCell = "allow" | "deny" | "inherit";

export interface PermissionPrincipal {
  id: string;
  label: string;
  /** Optional sublabel ("admin role", "user"). */
  kind?: string;
  /** Avatar/initials fallback. */
  avatar?: string;
}

export interface PermissionResource {
  id: string;
  label: string;
  group?: string;
}

export interface PermissionMatrixProps {
  principals: readonly PermissionPrincipal[];
  resources: readonly PermissionResource[];
  /** Cell values keyed by `"principalId:resourceId"`. Missing = inherit. */
  value: Record<string, PermissionCell>;
  onChange: (principalId: string, resourceId: string, next: PermissionCell) => void;
  /** Called when the user toggles all cells in a row/column. Receives the
   *  target state that should be applied. */
  onBulkChange?: (
    changes: { principalId: string; resourceId: string; value: PermissionCell }[],
  ) => void;
  /** Compact = 22px rows; Expanded = 32px. Default expanded. */
  density?: "compact" | "expanded";
  className?: string;
}

const CELL_META: Record<
  PermissionCell,
  { label: string; color: string; bg: string; symbol: string }
> = {
  allow: { label: "Allow", color: "text-emerald-200", bg: "bg-emerald-500/20", symbol: "✓" },
  deny: { label: "Deny", color: "text-rose-200", bg: "bg-rose-500/20", symbol: "✗" },
  inherit: { label: "Inherit", color: "text-white/35", bg: "bg-white/[0.03]", symbol: "·" },
};

const NEXT_STATE: Record<PermissionCell, PermissionCell> = {
  inherit: "allow",
  allow: "deny",
  deny: "inherit",
};

function cellKey(p: string, r: string) {
  return `${p}:${r}`;
}

/** Users / roles × resources grid with tri-state cells. Click cycles
 *  allow → deny → inherit. Row / column headers are sticky when the
 *  matrix overflows; clicking a header toggles the whole row / column
 *  via `onBulkChange`. */
export function PermissionMatrix({
  principals,
  resources,
  value,
  onChange,
  onBulkChange,
  density = "expanded",
  className,
}: PermissionMatrixProps) {
  const rowH = density === "compact" ? 22 : 32;
  const [hover, setHover] = useState<{ p: string; r: string } | null>(null);

  const grouped = useMemo(() => {
    const m = new Map<string, PermissionResource[]>();
    for (const r of resources) {
      const g = r.group ?? "";
      const list = m.get(g) ?? [];
      list.push(r);
      m.set(g, list);
    }
    return Array.from(m.entries());
  }, [resources]);

  function toggle(principalId: string, resourceId: string) {
    const cur = value[cellKey(principalId, resourceId)] ?? "inherit";
    onChange(principalId, resourceId, NEXT_STATE[cur]);
  }

  function bulkRow(principalId: string) {
    // If all non-inherit match a single value, cycle; else set all to allow.
    const changes = resources.map((r) => ({
      principalId,
      resourceId: r.id,
      value: "allow" as PermissionCell,
    }));
    const cur = resources.map((r) => value[cellKey(principalId, r.id)] ?? "inherit");
    if (cur.every((c) => c === "allow")) {
      for (const ch of changes) ch.value = "deny";
    } else if (cur.every((c) => c === "deny")) {
      for (const ch of changes) ch.value = "inherit";
    }
    onBulkChange?.(changes);
  }

  function bulkCol(resourceId: string) {
    const changes = principals.map((p) => ({
      principalId: p.id,
      resourceId,
      value: "allow" as PermissionCell,
    }));
    const cur = principals.map((p) => value[cellKey(p.id, resourceId)] ?? "inherit");
    if (cur.every((c) => c === "allow")) {
      for (const ch of changes) ch.value = "deny";
    } else if (cur.every((c) => c === "deny")) {
      for (const ch of changes) ch.value = "inherit";
    }
    onBulkChange?.(changes);
  }

  const totalCols = resources.length;
  return (
    <div className={cn("w-full overflow-auto rounded-xl border border-white/10", className)}>
      <table className="text-xs w-full border-collapse">
        <thead>
          <tr>
            <th
              className="sticky left-0 top-0 z-20 bg-[#14141c] border-b border-r border-white/10 px-3 py-2 text-left text-[10px] uppercase tracking-widest text-white/40"
              style={{ minWidth: 180 }}
            >
              Principal
            </th>
            {grouped.map(([group, items]) => (
              <th
                key={`grp-${group}`}
                colSpan={items.length}
                className="sticky top-0 z-10 bg-[#14141c] border-b border-white/10 px-2 py-1 text-[10px] uppercase tracking-widest text-white/35"
              >
                {group || "\u00A0"}
              </th>
            ))}
          </tr>
          <tr>
            <th
              className="sticky left-0 top-8 z-20 bg-[#14141c] border-b border-r border-white/10 px-3 py-1"
            />
            {resources.map((r) => (
              <th
                key={`rh-${r.id}`}
                className="sticky top-8 z-10 bg-[#14141c] border-b border-r border-white/5 px-2 py-1 text-[10px] text-white/60 text-center whitespace-nowrap cursor-pointer hover:bg-white/[0.04]"
                onClick={() => bulkCol(r.id)}
                title="Click to toggle entire column"
              >
                {r.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {principals.map((p) => (
            <tr key={p.id} style={{ height: rowH }}>
              <th
                onClick={() => bulkRow(p.id)}
                className="sticky left-0 z-10 bg-[#0d0d14] border-r border-white/10 text-left px-3 cursor-pointer hover:bg-white/[0.04]"
                style={{ minWidth: 180 }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white/10 grid place-items-center text-[10px] uppercase font-bold">
                    {p.avatar ?? p.label.slice(0, 2)}
                  </span>
                  <span className="flex flex-col gap-0">
                    <span className="text-white/90 font-medium">{p.label}</span>
                    {p.kind ? (
                      <span className="text-[9px] text-white/40 uppercase tracking-widest">
                        {p.kind}
                      </span>
                    ) : null}
                  </span>
                </div>
              </th>
              {resources.map((r) => {
                const state = value[cellKey(p.id, r.id)] ?? "inherit";
                const meta = CELL_META[state];
                const isHover =
                  hover && (hover.p === p.id || hover.r === r.id);
                return (
                  <td
                    key={r.id}
                    className={cn(
                      "text-center cursor-pointer border-r border-b border-white/5",
                      meta.bg,
                      meta.color,
                      isHover && "brightness-110",
                    )}
                    onClick={() => toggle(p.id, r.id)}
                    onMouseEnter={() => setHover({ p: p.id, r: r.id })}
                    onMouseLeave={() => setHover(null)}
                    title={`${p.label} → ${r.label}: ${meta.label}`}
                  >
                    <span className="text-sm leading-none">{meta.symbol}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 border-t border-white/5 bg-[#0d0d14] text-[10px] text-white/40 flex items-center gap-3">
        <span>
          {principals.length} principals × {totalCols} resources
        </span>
        <span>Click a cell to cycle · click header to bulk-toggle</span>
      </div>
    </div>
  );
}
