import {
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Avatar } from "../display/Avatar";
import { Timestamp } from "../display/Timestamp";

/* ------------------------------------------------------------------ *
 *  AuditLog — composable.
 *
 *    <AuditLog>
 *      <AuditEntry
 *        actor={{ name: "Ana" }}
 *        verb="deleted"
 *        target="auth-service"
 *        at={Date.now()}
 *        severity="warn"
 *        kind="security"
 *        onClick={() => navigate(`/audit/${id}`)}
 *      >
 *        <AuditDiff from="enabled" to="disabled" />
 *        <p>Reason: rotation policy</p>
 *      </AuditEntry>
 *    </AuditLog>
 *
 *  `<AuditLog>` is a stacked container. `<AuditEntry>` is one row —
 *  it accepts standard HTML attributes (onClick, onMouseEnter, etc.)
 *  so consumers wire whatever events they want. Children of an entry
 *  become the expanded detail panel.
 * ------------------------------------------------------------------ */

export type AuditSeverity = "info" | "warn" | "critical";

export interface AuditLogProps extends HTMLAttributes<HTMLDivElement> {
  empty?: ReactNode;
  children?: ReactNode;
}

export function AuditLog({
  empty,
  children,
  className,
  ...rest
}: AuditLogProps) {
  // Treat zero rendered children as the empty state.
  const hasChildren = Array.isArray(children)
    ? children.some(Boolean)
    : Boolean(children);

  return (
    <div className={cn("flex flex-col gap-1", className)} {...rest}>
      {hasChildren ? (
        children
      ) : (
        <div className="text-sm text-white/40 py-6 text-center border border-dashed border-white/10 rounded-xl">
          {empty ?? "No entries."}
        </div>
      )}
    </div>
  );
}

const SEV_META: Record<AuditSeverity, { color: string; bg: string }> = {
  info: { color: "text-white/50", bg: "bg-white/[0.02]" },
  warn: { color: "text-amber-300", bg: "bg-amber-500/[0.06]" },
  critical: { color: "text-rose-300", bg: "bg-rose-500/[0.06]" },
};

export interface AuditEntryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  actor: { id?: string; name: string; avatarUrl?: string };
  /** Short imperative verb — "deleted", "created", "enabled". */
  verb: string;
  /** The object the action was performed on. */
  target: ReactNode;
  at: Date | string | number;
  severity?: AuditSeverity;
  /** Category — rendered as a small uppercase tag in the header. */
  kind?: string;
  /** When `true`, the row toggles expanded state on click and shows a
   *  caret indicator. Defaults to `true` when there are children. */
  expandable?: boolean;
  /** Detail panel revealed when the row is expanded. */
  children?: ReactNode;
}

export function AuditEntry({
  actor,
  verb,
  target,
  at,
  severity = "info",
  kind,
  expandable,
  children,
  className,
  onClick,
  ...rest
}: AuditEntryProps) {
  const [open, setOpen] = useState(false);
  const meta = SEV_META[severity];
  const canExpand = expandable ?? Boolean(children);

  const handleClick: HTMLAttributes<HTMLDivElement>["onClick"] = (e) => {
    if (canExpand) setOpen((o) => !o);
    onClick?.(e);
  };

  return (
    <div
      role={onClick || canExpand ? "button" : undefined}
      tabIndex={onClick || canExpand ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if ((onClick || canExpand) && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick(
            e as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>,
          );
        }
      }}
      className={cn(
        "flex flex-col rounded-lg px-3 py-2 transition-colors outline-none",
        meta.bg,
        (canExpand || onClick) && "cursor-pointer hover:bg-white/[0.05] focus-visible:ring-1 focus-visible:ring-fuchsia-400/60",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-3 text-xs">
        <Avatar name={actor.name} size="sm" />
        <span className="text-white/85">{actor.name}</span>
        <span className={cn("font-semibold", meta.color)}>{verb}</span>
        <span className="text-white/80 truncate">{target}</span>
        <span className="flex-1" />
        {kind ? (
          <span className="text-[10px] uppercase tracking-widest text-white/35">
            {kind}
          </span>
        ) : null}
        <Timestamp value={at} className="text-white/40" />
        {canExpand ? (
          <span className="text-white/40 text-xs w-3 text-right">
            {open ? "▾" : "▸"}
          </span>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {canExpand && open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2 pl-10 text-xs text-white/65 flex flex-col gap-2">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export interface AuditDiffProps {
  from?: ReactNode;
  to?: ReactNode;
  className?: string;
}

/** Standardized from→to chip pair for diff-style audit entries. */
export function AuditDiff({ from, to, className }: AuditDiffProps) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {from !== undefined ? (
        <code className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-200 border border-rose-400/20 font-mono">
          {from}
        </code>
      ) : null}
      <span className="text-white/30">→</span>
      {to !== undefined ? (
        <code className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-200 border border-emerald-400/20 font-mono">
          {to}
        </code>
      ) : null}
    </div>
  );
}
