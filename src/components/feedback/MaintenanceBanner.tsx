import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Banner } from "./Banner";
import { formatAbsolute, formatDuration } from "../../lib/format";

export interface MaintenanceBannerProps {
  scheduledAt: Date | string | number;
  /** Duration in ms. */
  duration?: number;
  /** Affected systems / components text. */
  scope?: string;
  /** Override the banner title. Default auto-formatted. */
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
  /** Start sticky immediately, regardless of time until start. */
  forceSticky?: boolean;
  actions?: ReactNode;
  className?: string;
}

function toDate(v: Date | string | number): Date {
  return v instanceof Date ? v : new Date(v);
}

/** Preset over `Banner` with a live countdown toward `scheduledAt`.
 *  Auto-promotes to `sticky` when the window is within 1 hour. */
export function MaintenanceBanner({
  scheduledAt,
  duration,
  scope,
  title,
  children,
  onClose,
  forceSticky,
  actions,
  className,
}: MaintenanceBannerProps) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const start = toDate(scheduledAt);
  const now = Date.now();
  const msUntil = start.getTime() - now;
  const inWindow = msUntil <= 0 && (!duration || msUntil + duration > 0);
  const sticky = forceSticky || inWindow || (msUntil > 0 && msUntil < 60 * 60_000);

  const header =
    title ??
    (inWindow
      ? "Maintenance in progress"
      : msUntil > 0
        ? `Maintenance starts in ${formatDuration(msUntil, { parts: 2 })}`
        : "Maintenance window complete");

  const detail = (() => {
    const startStr = formatAbsolute(start, { preset: "datetime" });
    const endStr =
      duration != null
        ? formatAbsolute(new Date(start.getTime() + duration), {
            preset: "datetime",
          })
        : null;
    const window = endStr ? `${startStr} → ${endStr}` : startStr;
    return (
      <span className="text-xs text-white/70">
        {window}
        {scope ? <span className="text-white/40"> · affects {scope}</span> : null}
      </span>
    );
  })();

  return (
    <Banner
      open={true}
      tone={inWindow ? "warning" : "info"}
      title={header}
      sticky={sticky}
      onClose={onClose}
      actions={actions}
      className={cn(className)}
    >
      {detail}
      {children ? <div className="mt-1 text-sm text-white/75">{children}</div> : null}
    </Banner>
  );
}
