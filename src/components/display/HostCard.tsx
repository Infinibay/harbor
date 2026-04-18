import { type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ResourceMeter, type Resource } from "./ResourceMeter";

export type HostStatus = "online" | "degraded" | "offline" | "provisioning";

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
  className?: string;
  onClick?: () => void;
}

const STATUS: Record<
  HostStatus,
  { label: string; dot: string; text: string; glow: string; ping: boolean }
> = {
  online: {
    label: "Online",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    glow: "shadow-[0_0_10px_rgba(52,211,153,0.7)]",
    ping: true,
  },
  degraded: {
    label: "Degraded",
    dot: "bg-amber-400",
    text: "text-amber-300",
    glow: "shadow-[0_0_10px_rgba(251,191,36,0.7)]",
    ping: true,
  },
  offline: {
    label: "Offline",
    dot: "bg-rose-400",
    text: "text-rose-300",
    glow: "shadow-[0_0_10px_rgba(244,63,94,0.7)]",
    ping: false,
  },
  provisioning: {
    label: "Provisioning",
    dot: "bg-sky-400",
    text: "text-sky-300",
    glow: "shadow-[0_0_10px_rgba(56,189,248,0.7)]",
    ping: true,
  },
};

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
  className,
  onClick,
}: HostCardProps) {
  const s = STATUS[status];
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
        "rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3 transition-colors",
        onClick &&
          "cursor-pointer hover:bg-white/[0.06] hover:border-white/15 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40",
        status === "provisioning" && "animate-pulse",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative mt-1.5 shrink-0 w-2.5 h-2.5">
            <span
              className={cn(
                "absolute inset-0 rounded-full",
                s.dot,
                s.glow,
              )}
            />
            {s.ping ? (
              <span
                className={cn(
                  "absolute inset-0 rounded-full animate-ping",
                  s.dot,
                  "opacity-60",
                )}
              />
            ) : null}
          </div>
          <div className="min-w-0 flex flex-col gap-0.5">
            <div className="text-white font-semibold truncate">{name}</div>
            {subtitle ? (
              <div className="text-xs text-white/50 truncate">{subtitle}</div>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn("text-[11px] uppercase tracking-wider", s.text)}
          >
            {s.label}
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
