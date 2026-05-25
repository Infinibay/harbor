import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface PaginationProps {
  page: number;
  total: number;
  onChange: (p: number) => void;
  className?: string;
}

export function Pagination({
  page,
  total,
  onChange,
  className,
}: PaginationProps) {
  const pages = buildRange(page, total);
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <PagBtn disabled={page === 1} onClick={() => onChange(page - 1)}>
        ‹
      </PagBtn>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={i} className="px-2 text-[rgb(var(--harbor-text-subtle))]">
            …
          </span>
        ) : (
          <PagBtn
            key={i}
            active={p === page}
            onClick={() => onChange(p as number)}
          >
            {p}
          </PagBtn>
        ),
      )}
      <PagBtn disabled={page === total} onClick={() => onChange(page + 1)}>
        ›
      </PagBtn>
    </div>
  );
}

function PagBtn({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.92 } : undefined}
      data-cursor="button"
      className={cn(
        "relative min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium grid place-items-center transition-colors outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
        active
          ? "border border-[color:var(--harbor-focus-ring)] bg-[var(--harbor-state-selected)] text-[var(--harbor-state-selected-fg)]"
          : "text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))]",
        disabled && "opacity-30 cursor-not-allowed",
      )}
    >
      {children}
    </motion.button>
  );
}

function buildRange(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const left = Math.max(2, page - 1);
  const right = Math.min(total - 1, page + 1);
  if (left > 2) out.push("…");
  for (let i = left; i <= right; i++) out.push(i);
  if (right < total - 1) out.push("…");
  out.push(total);
  return out;
}
