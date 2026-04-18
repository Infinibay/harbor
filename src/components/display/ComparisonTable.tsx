import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ComparisonRow {
  label: ReactNode;
  values: (boolean | string | ReactNode)[];
  hint?: string;
}

export interface ComparisonGroup {
  label: string;
  rows: ComparisonRow[];
}

export interface ComparisonTableProps {
  plans: { id: string; name: string; highlighted?: boolean }[];
  groups: ComparisonGroup[];
  className?: string;
}

function renderVal(v: boolean | string | ReactNode) {
  if (v === true) return <span className="text-emerald-300">✓</span>;
  if (v === false) return <span className="text-white/25">—</span>;
  return <span className="text-white/80">{v}</span>;
}

export function ComparisonTable({ plans, groups, className }: ComparisonTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-[1]">
          <tr className="border-b border-white/10">
            <th className="text-left py-3 pr-4 text-white/50 font-normal"></th>
            {plans.map((p) => (
              <th
                key={p.id}
                className={cn(
                  "px-4 py-3 font-semibold text-center",
                  p.highlighted ? "text-fuchsia-200" : "text-white/85",
                )}
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <>
              <tr key={`g-${g.label}`}>
                <td
                  colSpan={plans.length + 1}
                  className="pt-5 pb-1 text-xs uppercase tracking-wider text-fuchsia-300/70"
                >
                  {g.label}
                </td>
              </tr>
              {g.rows.map((r, i) => (
                <tr
                  key={`r-${g.label}-${i}`}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="py-2.5 pr-4 text-white/75">
                    {r.label}
                    {r.hint ? (
                      <span className="block text-xs text-white/40 mt-0.5">
                        {r.hint}
                      </span>
                    ) : null}
                  </td>
                  {r.values.map((v, ci) => (
                    <td
                      key={ci}
                      className={cn(
                        "px-4 py-2.5 text-center",
                        plans[ci]?.highlighted && "bg-fuchsia-500/[0.04]",
                      )}
                    >
                      {renderVal(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
