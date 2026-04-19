import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { InlineEdit } from "../inputs/InlineEdit";

export interface PropertyItem {
  key: string;
  label: ReactNode;
  value: ReactNode;
  /** When true, render the value via InlineEdit. `onChange` is called
   *  with the new string. */
  editable?: boolean;
  /** Called when an editable value changes. */
  onChange?: (next: string) => void;
  /** Show a copy button next to the value. */
  copyable?: boolean;
  /** Group this property under a section header. */
  section?: string;
}

export interface PropertyListProps {
  items: readonly PropertyItem[];
  /** Two-column label+value layout (default) or single-column "card" layout. */
  variant?: "two-col" | "cards";
  className?: string;
}

/** Vertical "key: value" layout in the style of AWS / GCP details
 *  panes. Sticky section headers; copyable values; optional inline
 *  editing per row. */
export function PropertyList({
  items,
  variant = "two-col",
  className,
}: PropertyListProps) {
  const grouped = new Map<string, PropertyItem[]>();
  for (const it of items) {
    const g = it.section ?? "";
    const list = grouped.get(g) ?? [];
    list.push(it);
    grouped.set(g, list);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {Array.from(grouped.entries()).map(([section, rows]) => (
        <section key={section} className="flex flex-col">
          {section ? (
            <div className="sticky top-0 z-10 text-[10px] uppercase tracking-widest text-white/40 px-1 py-1 bg-[#0d0d14]">
              {section}
            </div>
          ) : null}
          {variant === "two-col" ? (
            <dl className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-4 gap-y-0">
              {rows.map((r) => (
                <PropertyRow key={r.key} item={r} />
              ))}
            </dl>
          ) : (
            <div className="flex flex-col gap-2">
              {rows.map((r) => (
                <div
                  key={r.key}
                  className="rounded-md border border-white/8 bg-white/[0.02] p-2"
                >
                  <div className="text-[10px] uppercase tracking-widest text-white/40">
                    {r.label}
                  </div>
                  <PropertyValue item={r} />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function PropertyRow({ item }: { item: PropertyItem }) {
  return (
    <>
      <dt className="py-1.5 text-xs text-white/55 border-b border-white/5 font-medium">
        {item.label}
      </dt>
      <dd className="py-1.5 text-xs text-white/90 border-b border-white/5 flex items-center gap-2">
        <PropertyValue item={item} />
      </dd>
    </>
  );
}

function PropertyValue({ item }: { item: PropertyItem }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    if (typeof item.value !== "string") return;
    navigator.clipboard?.writeText(item.value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }
  return (
    <span className="flex items-center gap-2 min-w-0 w-full">
      {item.editable && typeof item.value === "string" && item.onChange ? (
        <InlineEdit value={item.value} onChange={item.onChange} />
      ) : (
        <span className="truncate tabular-nums font-mono">{item.value}</span>
      )}
      {item.copyable && typeof item.value === "string" ? (
        <button
          onClick={copy}
          className="text-[10px] text-white/40 hover:text-white shrink-0"
        >
          {copied ? "✓" : "copy"}
        </button>
      ) : null}
    </span>
  );
}
