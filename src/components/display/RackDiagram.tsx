import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { StatusDot, type Status } from "./StatusDot";

export interface RackHost {
  /** Starting rack unit (1-based, from the bottom). */
  u: number;
  /** Height in rack units. Default 1. */
  height?: number;
  name: string;
  status?: Status;
  /** Extra label shown below the name when there's room. */
  subtitle?: string;
  /** Slot color override. */
  color?: string;
}

export interface RackDiagramProps {
  /** Total rack units (top to bottom numbering). Default 42. */
  units?: number;
  hosts: readonly RackHost[];
  /** Title above the rack. */
  name?: string;
  /** px per unit. Default 14. */
  unitHeight?: number;
  /** Called on host click. */
  onHostClick?: (host: RackHost) => void;
  /** Render U-counting bottom-to-top (true, default) or top-to-bottom. */
  bottomUp?: boolean;
  className?: string;
}

/** Vertical rack visualization with numbered units and host blocks.
 *  Hover highlights the slot; click emits `onHostClick`. */
export function RackDiagram({
  units = 42,
  hosts,
  name,
  unitHeight = 14,
  onHostClick,
  bottomUp = true,
  className,
}: RackDiagramProps) {
  const [hover, setHover] = useState<string | null>(null);

  // Build slot lookup.
  const byStart = new Map<number, RackHost>();
  for (const h of hosts) byStart.set(h.u, h);

  const rows = Array.from({ length: units }, (_, i) => {
    const u = bottomUp ? units - i : i + 1;
    return u;
  });

  return (
    <div
      className={cn(
        "inline-flex flex-col gap-2 p-3 rounded-xl border border-white/10 bg-[#0d0d14]/80",
        className,
      )}
    >
      {name ? (
        <div className="text-[10px] uppercase tracking-widest text-white/50 px-1">
          {name}
        </div>
      ) : null}
      <div
        className="relative border border-white/10 rounded-md bg-black/40"
        style={{ width: 184 }}
      >
        {rows.map((u) => {
          const host = byStart.get(u);
          if (!host) {
            // Empty slot
            return (
              <div
                key={u}
                className="flex items-center border-t border-white/5 first:border-t-0 text-[9px] text-white/20 tabular-nums font-mono px-1"
                style={{ height: unitHeight }}
              >
                {u}
              </div>
            );
          }
          const h = host.height ?? 1;
          const isHover = hover === host.name;
          return (
            <div
              key={u}
              onClick={() => onHostClick?.(host)}
              onMouseEnter={() => setHover(host.name)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                "flex items-center gap-1.5 border-t border-white/10 first:border-t-0 px-1.5 rounded-sm relative overflow-hidden",
                onHostClick && "cursor-pointer",
                isHover && "ring-1 ring-fuchsia-400/60",
              )}
              style={{
                height: unitHeight * h,
                background:
                  host.color ?? "linear-gradient(90deg, rgba(168,85,247,0.1), rgba(56,189,248,0.1))",
              }}
            >
              <span className="text-[9px] text-white/40 tabular-nums font-mono shrink-0 w-5">
                {u}
              </span>
              {host.status ? (
                <StatusDot status={host.status} size={6} label={null} pulse={false} />
              ) : null}
              <span className="text-[11px] text-white/90 truncate flex-1">
                {host.name}
              </span>
              {host.subtitle && h >= 2 ? (
                <span className="text-[10px] text-white/50 truncate">{host.subtitle}</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================================
// DatacenterRow — multiple racks side by side
// =====================================================================

export interface DatacenterRowProps {
  racks: readonly {
    name: string;
    units?: number;
    hosts: readonly RackHost[];
  }[];
  unitHeight?: number;
  onHostClick?: (rackName: string, host: RackHost) => void;
  className?: string;
}

/** Row of racks — useful for a data-center aisle overview. Each rack
 *  gets its own `RackDiagram`; the `name` is rendered as a title. */
export function DatacenterRow({
  racks,
  unitHeight,
  onHostClick,
  className,
}: DatacenterRowProps) {
  return (
    <div className={cn("inline-flex gap-3 overflow-x-auto pb-2", className)}>
      {racks.map((r) => (
        <RackDiagram
          key={r.name}
          name={r.name}
          units={r.units}
          hosts={r.hosts}
          unitHeight={unitHeight}
          onHostClick={(h) => onHostClick?.(r.name, h)}
        />
      ))}
    </div>
  );
}

/** ReactNode re-export for convenience. */
export type { ReactNode };
