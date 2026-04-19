import { type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { QuotaBar, type QuotaSegment } from "./QuotaBar";
import { Timestamp } from "./Timestamp";

export interface BillingCardProps {
  /** Plan name ("Free", "Team", "Enterprise"). */
  plan: string;
  /** Price label ("$49/mo", "Custom"). */
  price?: string;
  /** Period start / end — typically a billing cycle. */
  period?: { start: Date | string | number; end: Date | string | number };
  /** Next invoice amount, formatted (e.g. "$64.12"). */
  nextInvoice?: string;
  /** Segments of current-period usage for the quota bar. */
  usage?: { segments: QuotaSegment[]; total: number; label?: string };
  /** Top-right slot for the upgrade CTA. */
  cta?: ReactNode;
  /** Bottom slot for extra content (links, invoices list…). */
  footer?: ReactNode;
  className?: string;
}

/** Plan + current usage + next invoice tile — the "your plan" card you
 *  drop on any billing page. Composes `QuotaBar` and `Timestamp`. */
export function BillingCard({
  plan,
  price,
  period,
  nextInvoice,
  usage,
  cta,
  footer,
  className,
}: BillingCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col gap-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            Current plan
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white text-xl font-semibold">{plan}</span>
            {price ? (
              <span className="text-white/50 text-sm tabular-nums font-mono">
                {price}
              </span>
            ) : null}
          </div>
          {period ? (
            <div className="text-xs text-white/50 tabular-nums font-mono mt-1">
              <Timestamp
                value={period.start}
                relative={false}
                absoluteOptions={{ preset: "date" }}
                noTooltip
              />
              <span className="mx-1.5 text-white/30">→</span>
              <Timestamp
                value={period.end}
                relative={false}
                absoluteOptions={{ preset: "date" }}
                noTooltip
              />
            </div>
          ) : null}
        </div>
        {cta}
      </div>

      {usage ? (
        <QuotaBar
          segments={usage.segments}
          total={usage.total}
          label={usage.label}
        />
      ) : null}

      {nextInvoice ? (
        <div className="flex items-center justify-between border-t border-white/8 pt-3">
          <span className="text-xs text-white/60">Next invoice</span>
          <span className="text-white text-base font-semibold tabular-nums font-mono">
            {nextInvoice}
          </span>
        </div>
      ) : null}

      {footer}
    </div>
  );
}
