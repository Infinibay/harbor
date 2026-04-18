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
          <span key={i} className="px-2 text-white/40">
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
        "relative min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium grid place-items-center transition-colors",
        active
          ? "bg-white text-black"
          : "text-white/70 hover:bg-white/5 hover:text-white",
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
