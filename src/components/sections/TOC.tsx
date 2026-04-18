import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

export interface TOCItem {
  id: string;
  label: string;
  level?: 1 | 2 | 3;
}

export interface TOCProps {
  items: TOCItem[];
  className?: string;
  title?: string;
}

/** Table of contents with scroll-spy.
 *
 * Each item's `id` must match an element on the page. The component uses
 * an IntersectionObserver to highlight the active heading as you scroll. */
export function TOC({ items, className, title = "On this page" }: TOCProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: [0, 0.5, 1] },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav
      className={cn("text-sm sticky top-6 self-start", className)}
      aria-label="Table of contents"
    >
      <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3">
        {title}
      </div>
      <ul className="flex flex-col gap-1.5 border-l border-white/10">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn(
                "block -ml-px pl-3 py-0.5 border-l-2 transition-colors",
                it.level === 2 && "pl-5",
                it.level === 3 && "pl-7",
                active === it.id
                  ? "border-fuchsia-400 text-white"
                  : "border-transparent text-white/55 hover:text-white",
              )}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
