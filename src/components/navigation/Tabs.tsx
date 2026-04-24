import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

const TabsCtx = createContext<{
  value: string;
  onChange: (v: string) => void;
  layoutId: string;
  variant: "pill" | "underline" | "card";
} | null>(null);

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  variant?: "pill" | "underline" | "card";
  children: ReactNode;
  className?: string;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  variant = "pill",
  children,
  className,
}: TabsProps) {
  const layoutId = useId();
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = value ?? internal;
  function onChange(v: string) {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  }
  return (
    <TabsCtx.Provider value={{ value: current, onChange, layoutId, variant }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error();
  if (ctx.variant === "pill")
    return (
      <div
        className={cn(
          "relative inline-flex items-center gap-1 bg-black/30 border border-white/8 rounded-xl p-1",
          className,
        )}
      >
        {children}
      </div>
    );
  if (ctx.variant === "underline")
    return (
      <div
        className={cn(
          "relative inline-flex items-center gap-6 border-b border-white/8",
          className,
        )}
      >
        {children}
      </div>
    );
  return (
    <div className={cn("relative inline-flex items-end gap-1", className)}>
      {children}
    </div>
  );
}

export interface TabProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export function Tab({ value, children, icon, disabled }: TabProps) {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error();
  const active = ctx.value === value;

  if (ctx.variant === "pill")
    return (
      <button type="button"
        onClick={() => !disabled && ctx.onChange(value)}
        disabled={disabled}
        data-cursor="button"
        className={cn(
          "relative px-3.5 py-1.5 text-sm font-medium rounded-lg inline-flex items-center gap-2 transition-colors",
          active ? "text-white" : "text-white/60 hover:text-white/80",
          disabled && "opacity-40 cursor-not-allowed",
        )}
      >
        {active ? (
          <motion.span
            layoutId={`${ctx.layoutId}-pill`}
            className="absolute inset-0 rounded-lg bg-[#0d0d14]/90 border border-fuchsia-400/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        ) : null}
        <span className="relative inline-flex items-center gap-2">
          {icon}
          {children}
        </span>
      </button>
    );

  if (ctx.variant === "underline")
    return (
      <button type="button"
        onClick={() => !disabled && ctx.onChange(value)}
        disabled={disabled}
        data-cursor="button"
        className={cn(
          "relative pb-2.5 text-sm font-medium inline-flex items-center gap-2",
          active ? "text-white" : "text-white/55 hover:text-white/80",
          disabled && "opacity-40 cursor-not-allowed",
        )}
      >
        {icon}
        {children}
        {active ? (
          <motion.span
            layoutId={`${ctx.layoutId}-underline`}
            className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full"
            style={{
              background: "linear-gradient(90deg,#a855f7,#38bdf8)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        ) : null}
      </button>
    );

  return (
    <button type="button"
      onClick={() => !disabled && ctx.onChange(value)}
      disabled={disabled}
      data-cursor="button"
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-t-lg inline-flex items-center gap-2 border border-b-0 transition-colors",
        active
          ? "bg-[#14141c] border-white/10 text-white"
          : "border-transparent text-white/50 hover:text-white/80",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function TabPanel({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error();
  if (ctx.value !== value) return null;

  // No per-panel AnimatePresence. Each TabPanel is a React sibling, so
  // wrapping each in its own AnimatePresence means the outgoing panel
  // exits in one tree while the incoming panel enters in another —
  // both render simultaneously and the content visibly stacks during
  // the transition. Rendering only the active panel and letting it
  // fade/translate in on mount keeps the transition clean: the old
  // panel unmounts synchronously, the new one animates in.
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn("mt-4", className)}
    >
      {children}
    </motion.div>
  );
}
