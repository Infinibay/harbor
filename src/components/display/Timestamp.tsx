import { useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import {
  formatAbsolute,
  formatRelative,
  type FormatAbsoluteOptions,
  type FormatRelativeOptions,
} from "../../lib/format";
import { Tooltip } from "../overlays/Tooltip";

export interface TimestampProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  value: Date | string | number | null | undefined;
  /** Render relative ("2m ago") instead of absolute. Default true. */
  relative?: boolean;
  /** Re-render cadence (ms) for live relative text. Default 15_000. Set 0 to disable. */
  refreshMs?: number;
  /** Hide the on-hover tooltip with the other form. Default false. */
  noTooltip?: boolean;
  relativeOptions?: FormatRelativeOptions;
  absoluteOptions?: FormatAbsoluteOptions;
}

/** Renders a timestamp as either relative ("2m ago") or absolute, with
 *  a hover tooltip showing the other form. Auto-ticks so live views
 *  ("last seen N ago") stay accurate without the caller managing it. */
export function Timestamp({
  value,
  relative = true,
  refreshMs = 15_000,
  noTooltip,
  relativeOptions,
  absoluteOptions,
  className,
  ...rest
}: TimestampProps) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!relative || !refreshMs) return;
    const id = window.setInterval(() => tick((n) => n + 1), refreshMs);
    return () => window.clearInterval(id);
  }, [relative, refreshMs]);

  const primary = relative
    ? formatRelative(value, relativeOptions)
    : formatAbsolute(value, absoluteOptions);
  const alternate = relative
    ? formatAbsolute(value, absoluteOptions)
    : formatRelative(value, relativeOptions);

  const node = (
    <span
      className={cn("tabular-nums", className)}
      {...rest}
    >
      {primary}
    </span>
  );

  if (noTooltip || primary === "—") return node;
  return <Tooltip content={alternate}>{node}</Tooltip>;
}
