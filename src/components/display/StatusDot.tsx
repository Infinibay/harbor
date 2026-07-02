import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type Status =
  | "online"
  | "degraded"
  | "offline"
  | "provisioning"
  | "maintenance"
  | "warning"
  | "unknown";

export interface StatusDotProps {
  status: Status;
  /** Enable the pulsing "ping" ring. Default: true for online/degraded/provisioning. */
  pulse?: boolean;
  /** Size in pixels. Default 10. */
  size?: number;
  /** Optional label rendered to the right of the dot. */
  label?: ReactNode;
  /** Force a fixed label instead of the status-derived one. */
  labelOverride?: string;
  className?: string;
}

interface StatusMeta {
  label: string;
  dot: string;
  text: string;
  glow: string;
  defaultPulse: boolean;
}

export const STATUS_META: Record<Status, StatusMeta> = {
  online: {
    label: "Online",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    glow: "shadow-[0_0_10px_rgba(52,211,153,0.7)]",
    defaultPulse: true,
  },
  degraded: {
    label: "Degraded",
    dot: "bg-amber-400",
    text: "text-amber-300",
    glow: "shadow-[0_0_10px_rgba(251,191,36,0.7)]",
    defaultPulse: true,
  },
  offline: {
    label: "Offline",
    dot: "bg-rose-400",
    text: "text-rose-300",
    glow: "shadow-[0_0_10px_rgba(244,63,94,0.7)]",
    defaultPulse: false,
  },
  provisioning: {
    label: "Provisioning",
    dot: "bg-sky-400",
    text: "text-sky-300",
    glow: "shadow-[0_0_10px_rgba(56,189,248,0.7)]",
    defaultPulse: true,
  },
  maintenance: {
    label: "Maintenance",
    dot: "bg-violet-400",
    text: "text-violet-300",
    glow: "shadow-[0_0_10px_rgba(167,139,250,0.7)]",
    defaultPulse: false,
  },
  warning: {
    label: "Warning",
    dot: "bg-amber-400",
    text: "text-amber-300",
    glow: "shadow-[0_0_10px_rgba(251,191,36,0.7)]",
    defaultPulse: false,
  },
  unknown: {
    label: "Unknown",
    dot: "bg-white/30",
    text: "text-white/40",
    glow: "",
    defaultPulse: false,
  },
};

/** A small colored dot with optional pulse ring + label. Shared
 *  primitive used by `HostCard`, lists, status pages and anywhere else
 *  a service / VM / job state needs to be indicated. */
export function StatusDot({
  status,
  pulse,
  size = 10,
  label,
  labelOverride,
  className,
}: StatusDotProps) {
  // Defensive fallback: the app is consumed from untyped JSX, so an
  // unexpected status string (e.g. a raw backend enum) must never throw
  // during render — degrade to the neutral "unknown" meta instead.
  const meta = STATUS_META[status] ?? STATUS_META.unknown;
  const showPulse = pulse ?? meta.defaultPulse;
  const displayLabel =
    labelOverride ?? (label === undefined ? meta.label : undefined);
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="relative inline-block shrink-0"
        style={{ width: size, height: size }}
      >
        <span
          className={cn("absolute inset-0 rounded-full", meta.dot, meta.glow)}
        />
        {showPulse ? (
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-60",
              meta.dot,
            )}
          />
        ) : null}
      </span>
      {label !== undefined ? (
        label
      ) : displayLabel ? (
        <span
          className={cn(
            "text-[11px] uppercase tracking-wider font-medium",
            meta.text,
          )}
        >
          {displayLabel}
        </span>
      ) : null}
    </span>
  );
}
