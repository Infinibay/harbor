import { type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import {
  formatBytes,
  formatNumber,
  formatPercent,
  formatRate,
  type FormatBytesOptions,
  type FormatNumberOptions,
} from "../../lib/format";

type BaseProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Show the raw numeric value in the native `title` tooltip. Default true. */
  showTitle?: boolean;
};

// =====================================================================
// FormattedBytes
// =====================================================================

export interface FormattedBytesProps extends BaseProps, FormatBytesOptions {
  value: number | null | undefined;
}

/** `<FormattedBytes value={12400000} />` → `<span>12.4 MB</span>` with
 *  `tabular-nums font-mono` styling and a native tooltip showing the raw
 *  value. Works the same as `formatBytes` but packaged as a consistent
 *  visual atom. */
export function FormattedBytes({
  value,
  decimals,
  binary,
  unit,
  showTitle = true,
  className,
  ...rest
}: FormattedBytesProps) {
  return (
    <span
      title={showTitle && typeof value === "number" ? `${value} bytes` : undefined}
      className={cn("tabular-nums font-mono", className)}
      {...rest}
    >
      {formatBytes(value, { decimals, binary, unit })}
    </span>
  );
}

// =====================================================================
// FormattedRate
// =====================================================================

export interface FormattedRateProps extends BaseProps, FormatBytesOptions {
  /** Bytes per second. */
  value: number | null | undefined;
}

export function FormattedRate({
  value,
  decimals,
  binary,
  unit,
  showTitle = true,
  className,
  ...rest
}: FormattedRateProps) {
  return (
    <span
      title={showTitle && typeof value === "number" ? `${value} bytes/s` : undefined}
      className={cn("tabular-nums font-mono", className)}
      {...rest}
    >
      {formatRate(value, { decimals, binary, unit })}
    </span>
  );
}

// =====================================================================
// FormattedNumber
// =====================================================================

export interface FormattedNumberProps extends BaseProps, FormatNumberOptions {
  value: number | null | undefined;
}

export function FormattedNumber({
  value,
  compact,
  decimals,
  locale,
  showTitle = true,
  className,
  ...rest
}: FormattedNumberProps) {
  return (
    <span
      title={showTitle && typeof value === "number" ? String(value) : undefined}
      className={cn("tabular-nums font-mono", className)}
      {...rest}
    >
      {formatNumber(value, { compact, decimals, locale })}
    </span>
  );
}

// =====================================================================
// FormattedPercent (bonus — plan implied it via the formatter)
// =====================================================================

export interface FormattedPercentProps extends BaseProps {
  /** Fraction between 0 and 1 (e.g. 0.424 renders as "42.4%"). */
  value: number | null | undefined;
  decimals?: number;
  locale?: string;
}

export function FormattedPercent({
  value,
  decimals = 1,
  locale,
  showTitle = true,
  className,
  ...rest
}: FormattedPercentProps) {
  return (
    <span
      title={showTitle && typeof value === "number" ? String(value) : undefined}
      className={cn("tabular-nums font-mono", className)}
      {...rest}
    >
      {formatPercent(value, decimals, { locale })}
    </span>
  );
}
