import { type MouseEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ResourceMeter, type Resource } from "./ResourceMeter";
import { StatusDot, STATUS_META, type Status } from "./StatusDot";

/** Re-export for backwards compat — HostStatus is now a subset of the
 *  shared `Status` type from StatusDot. */
export type HostStatus = Extract<
  Status,
  "online" | "degraded" | "offline" | "provisioning"
>;

export interface HostCardProps {
  name: string;
  /** Address / OS / type shown under the name. */
  subtitle?: string;
  status: HostStatus;
  /** CPU usage, 0..100. */
  cpu?: number;
  /** RAM usage. */
  ram?: { used: number; total: number; unit?: string };
  /** Disk usage. */
  disk?: { used: number; total: number; unit?: string };
  /** Small labels (e.g. "us-east-1", "prod"). */
  tags?: string[];
  /** Top-right slot for buttons / menu. */
  actions?: ReactNode;
  /** Small leading icon (e.g. OS logo) shown next to the status dot. */
  leadingIcon?: ReactNode;
  className?: string;
  onClick?: () => void;
  onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
}

/** Summary card for a VM / server / compute host. Combines status dot,
 *  name, subtitle, resource bars, tags and an actions slot. */
export function HostCard({
  name,
  subtitle,
  status,
  cpu,
  ram,
  disk,
  tags,
  actions,
  leadingIcon,
  className,
  onClick,
  onContextMenu,
}: HostCardProps) {
  const meta = STATUS_META[status];
  const resources: Resource[] = [];
  if (cpu !== undefined) {
    resources.push({ label: "CPU", value: cpu, detail: `${cpu.toFixed(0)}%` });
  }
  if (ram) {
    const pct = ram.total > 0 ? (ram.used / ram.total) * 100 : 0;
    resources.push({
      label: "RAM",
      value: pct,
      detail: `${ram.used.toFixed(1)} / ${ram.total} ${ram.unit ?? "GB"}`,
    });
  }
  if (disk) {
    const pct = disk.total > 0 ? (disk.used / disk.total) * 100 : 0;
    resources.push({
      label: "Disk",
      value: pct,
      detail: `${disk.used.toFixed(0)} / ${disk.total} ${disk.unit ?? "GB"}`,
    });
  }

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "rounded-2xl border border-white/10 bg-surface-2 p-4 flex flex-col gap-3 transition-colors",
        onClick &&
          "cursor-pointer hover:bg-surface-3 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40",
        status === "provisioning" && "animate-pulse",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-1.5">
            <StatusDot status={status} label={null} size={10} />
          </div>
          {leadingIcon ? (
            <div className="mt-0.5 shrink-0 flex items-center justify-center h-5 w-5 text-white/80">
              {leadingIcon}
            </div>
          ) : null}
          <div className="min-w-0 flex flex-col gap-0.5">
            <div className="text-white font-semibold truncate">{name}</div>
            {subtitle ? (
              <div className="text-xs text-white/50 truncate">{subtitle}</div>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn("text-[11px] uppercase tracking-wider", meta.text)}
          >
            {meta.label}
          </span>
          {actions}
        </div>
      </div>

      {resources.length > 0 ? <ResourceMeter resources={resources} /> : null}

      {tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-wider text-white/60 px-1.5 py-0.5 rounded bg-white/5 border border-white/10"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
