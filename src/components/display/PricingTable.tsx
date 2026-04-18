import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface PricingFeature {
  label: ReactNode;
  included: boolean;
  hint?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  tagline?: ReactNode;
  price: number | string;
  period?: string;
  features: PricingFeature[];
  cta?: ReactNode;
  highlighted?: boolean;
  badge?: ReactNode;
}

export interface PricingTableProps {
  tiers: PricingTier[];
  className?: string;
}

export function PricingTable({ tiers, className }: PricingTableProps) {
  return (
    <div
      className={cn(
        "w-full grid gap-4",
        tiers.length === 3 ? "md:grid-cols-3" : tiers.length === 2 ? "md:grid-cols-2" : "",
        className,
      )}
    >
      {tiers.map((t) => (
        <div
          key={t.id}
          className={cn(
            "relative rounded-2xl p-6 border flex flex-col gap-5",
            t.highlighted
              ? "border-fuchsia-400/40 bg-gradient-to-b from-fuchsia-500/10 to-transparent"
              : "border-white/10 bg-white/[0.03]",
          )}
        >
          {t.badge ? (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-fuchsia-500 text-white shadow-lg">
              {t.badge}
            </span>
          ) : null}

          <div>
            <div className="text-sm uppercase tracking-wider text-white/55">
              {t.name}
            </div>
            {t.tagline ? (
              <div className="text-xs text-white/45 mt-0.5">{t.tagline}</div>
            ) : null}
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white font-mono">
                {typeof t.price === "number" ? `$${t.price}` : t.price}
              </span>
              {t.period ? (
                <span className="text-sm text-white/50">/{t.period}</span>
              ) : null}
            </div>
          </div>

          {t.cta ? <div>{t.cta}</div> : null}

          <ul className="flex flex-col gap-2 text-sm">
            {t.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                {f.included ? (
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 grid place-items-center text-[10px] shrink-0">
                    ✓
                  </span>
                ) : (
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-white/5 text-white/30 grid place-items-center text-[10px] shrink-0">
                    ×
                  </span>
                )}
                <span
                  className={cn(
                    "flex-1",
                    f.included ? "text-white/80" : "text-white/35 line-through",
                  )}
                >
                  {f.label}
                  {f.hint ? (
                    <span className="block text-xs text-white/40 mt-0.5">
                      {f.hint}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
