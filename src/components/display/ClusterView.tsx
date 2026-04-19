import { useMemo, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { FluidGrid } from "../layout/FluidGrid";
import { HostCard, type HostStatus } from "./HostCard";

export interface ClusterHost {
  id: string;
  name: string;
  status: HostStatus;
  subtitle?: string;
  cpu?: number;
  ram?: { used: number; total: number; unit?: string };
  disk?: { used: number; total: number; unit?: string };
  tags?: string[];
  region?: string;
}

export interface ClusterViewProps {
  hosts: readonly ClusterHost[];
  /** Slot above the grid — e.g. page title + actions. */
  header?: ReactNode;
  /** Called when the user clicks a host card. */
  onHostClick?: (host: ClusterHost) => void;
  /** Minimum card width for the FluidGrid. Default 280. */
  minCardWidth?: number;
  className?: string;
}

type Density = "comfortable" | "compact";

/** Aerial cluster view: filter chips by status / region / tag + responsive
 *  grid of `HostCard`s. Pure DOM; no Canvas. */
export function ClusterView({
  hosts,
  header,
  onHostClick,
  minCardWidth = 280,
  className,
}: ClusterViewProps) {
  const [statusFilter, setStatusFilter] = useState<HostStatus | "all">("all");
  const [regionFilter, setRegionFilter] = useState<string | "all">("all");
  const [tagFilter, setTagFilter] = useState<string | "all">("all");
  const [density, setDensity] = useState<Density>("comfortable");

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const h of hosts) if (h.region) set.add(h.region);
    return Array.from(set);
  }, [hosts]);
  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const h of hosts) for (const t of h.tags ?? []) set.add(t);
    return Array.from(set);
  }, [hosts]);

  const filtered = useMemo(() => {
    return hosts.filter((h) => {
      if (statusFilter !== "all" && h.status !== statusFilter) return false;
      if (regionFilter !== "all" && h.region !== regionFilter) return false;
      if (tagFilter !== "all" && !(h.tags ?? []).includes(tagFilter)) return false;
      return true;
    });
  }, [hosts, statusFilter, regionFilter, tagFilter]);

  const countsByStatus = useMemo(() => {
    const c: Record<HostStatus, number> = {
      online: 0,
      degraded: 0,
      offline: 0,
      provisioning: 0,
    };
    for (const h of hosts) c[h.status] += 1;
    return c;
  }, [hosts]);

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      {header}
      <div className="flex flex-wrap gap-2 items-center">
        <FilterGroup
          label="Status"
          options={[
            { value: "all", label: `All · ${hosts.length}` },
            { value: "online", label: `Online · ${countsByStatus.online}` },
            { value: "degraded", label: `Degraded · ${countsByStatus.degraded}` },
            { value: "offline", label: `Offline · ${countsByStatus.offline}` },
            { value: "provisioning", label: `Provisioning · ${countsByStatus.provisioning}` },
          ]}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as HostStatus | "all")}
        />
        {regions.length > 0 ? (
          <FilterGroup
            label="Region"
            options={[
              { value: "all", label: "All regions" },
              ...regions.map((r) => ({ value: r, label: r })),
            ]}
            value={regionFilter}
            onChange={(v) => setRegionFilter(v)}
          />
        ) : null}
        {tags.length > 0 ? (
          <FilterGroup
            label="Tag"
            options={[
              { value: "all", label: "All" },
              ...tags.map((t) => ({ value: t, label: t })),
            ]}
            value={tagFilter}
            onChange={(v) => setTagFilter(v)}
          />
        ) : null}
        <span className="flex-1" />
        <div className="inline-flex gap-0.5 p-0.5 rounded-md bg-white/[0.03] border border-white/10 text-[11px]">
          <button
            onClick={() => setDensity("comfortable")}
            className={cn(
              "px-2 py-0.5 rounded",
              density === "comfortable" ? "bg-white/10 text-white" : "text-white/50",
            )}
          >
            Comfortable
          </button>
          <button
            onClick={() => setDensity("compact")}
            className={cn(
              "px-2 py-0.5 rounded",
              density === "compact" ? "bg-white/10 text-white" : "text-white/50",
            )}
          >
            Compact
          </button>
        </div>
      </div>
      <FluidGrid minItemWidth={density === "compact" ? 200 : minCardWidth} gap={12}>
        {filtered.map((h) => (
          <HostCard
            key={h.id}
            name={h.name}
            subtitle={h.subtitle}
            status={h.status}
            cpu={density === "compact" ? undefined : h.cpu}
            ram={density === "compact" ? undefined : h.ram}
            disk={density === "compact" ? undefined : h.disk}
            tags={h.tags}
            onClick={onHostClick ? () => onHostClick(h) : undefined}
          />
        ))}
      </FluidGrid>
      {filtered.length === 0 ? (
        <div className="text-sm text-white/40 py-10 text-center border border-dashed border-white/10 rounded-xl">
          No hosts match the current filters.
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex gap-0.5 p-0.5 rounded-md bg-white/[0.03] border border-white/10 text-xs items-center">
      <span className="px-2 text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "px-2 py-0.5 rounded transition-colors",
            value === o.value
              ? "bg-white/10 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
