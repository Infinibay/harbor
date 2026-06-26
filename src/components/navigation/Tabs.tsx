import {
  createContext,
  useContext,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { ContentSwap } from "../motion/ContentSwap";

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
        role="tablist"
        className={cn(
          // inline-flex keeps the pill content-sized on desktop; max-w-full +
          // overflow-x-auto only kick in once the tab row exceeds its
          // container (narrow viewports / 240px sidebar), turning the spill
          // into a self-contained thin, snap-aligned horizontal scroll
          // instead of a page-level scrollbar or clipped tabs.
          "relative inline-flex items-center gap-1 bg-[var(--harbor-surface-panel-muted)] border border-[color:var(--harbor-border-default)] rounded-xl p-1",
          "max-w-full overflow-x-auto snap-x snap-mandatory [&>*]:snap-start [scrollbar-width:thin]",
          className,
        )}
      >
        {children}
      </div>
    );
  if (ctx.variant === "underline")
    return (
      <div
        role="tablist"
        className={cn(
          // The underline variant wraps instead of scrolling: extra tabs
          // flow onto a second row rather than spilling past the container.
          "relative inline-flex flex-wrap items-center gap-6 border-b border-[color:var(--harbor-border-default)] max-w-full",
          className,
        )}
      >
        {children}
      </div>
    );
  return (
    <div
      role="tablist"
      className={cn(
        // Same content-sized-then-scroll behaviour as the pill variant so
        // a long card-tab row stays reachable on narrow widths.
        "relative inline-flex items-end gap-1",
        "max-w-full overflow-x-auto snap-x snap-mandatory [&>*]:snap-start [scrollbar-width:thin]",
        className,
      )}
    >
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

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;

    const list = e.currentTarget.closest("[role='tablist']");
    const tabs = Array.from(
      list?.querySelectorAll<HTMLButtonElement>("[role='tab']:not(:disabled)") ?? [],
    );
    if (tabs.length === 0) return;

    e.preventDefault();
    const current = Math.max(0, tabs.indexOf(e.currentTarget));
    let next = current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (current + 1) % tabs.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;

    tabs[next]?.focus();
    tabs[next]?.click();
  }

  if (ctx.variant === "pill")
    return (
      <button type="button"
        role="tab"
        onClick={() => !disabled && ctx.onChange(value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-selected={active}
        tabIndex={active ? 0 : -1}
        aria-controls={`${ctx.layoutId}-${value}-panel`}
        id={`${ctx.layoutId}-${value}-tab`}
        data-cursor="button"
        className={cn(
          "relative px-3.5 py-1.5 text-sm font-medium rounded-lg inline-flex items-center gap-2 transition-colors outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
          active
            ? "text-[var(--harbor-state-selected-fg)]"
            : "text-[rgb(var(--harbor-text-muted))] hover:text-[rgb(var(--harbor-text))]",
          disabled && "opacity-40 cursor-not-allowed",
        )}
      >
        {active ? (
          <motion.span
            layoutId={`${ctx.layoutId}-pill`}
            className="absolute inset-0 rounded-lg bg-[var(--harbor-state-selected)] border border-[color:var(--harbor-focus-ring)]"
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
        role="tab"
        onClick={() => !disabled && ctx.onChange(value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-selected={active}
        tabIndex={active ? 0 : -1}
        aria-controls={`${ctx.layoutId}-${value}-panel`}
        id={`${ctx.layoutId}-${value}-tab`}
        data-cursor="button"
        className={cn(
          "relative pb-2.5 text-sm font-medium inline-flex items-center gap-2 outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
          active
            ? "text-[rgb(var(--harbor-text))]"
            : "text-[rgb(var(--harbor-text-muted))] hover:text-[rgb(var(--harbor-text))]",
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
              background: "var(--harbor-focus-ring)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        ) : null}
      </button>
    );

  return (
    <button type="button"
      role="tab"
      onClick={() => !disabled && ctx.onChange(value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      aria-controls={`${ctx.layoutId}-${value}-panel`}
      id={`${ctx.layoutId}-${value}-tab`}
      data-cursor="button"
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-t-lg inline-flex items-center gap-2 border border-b-0 transition-colors outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
        active
          ? "bg-[var(--harbor-surface-panel)] border-[color:var(--harbor-border-default)] text-[rgb(var(--harbor-text))]"
          : "border-transparent text-[rgb(var(--harbor-text-muted))] hover:text-[rgb(var(--harbor-text))]",
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

  // The active panel mounts on tab change; the previous panel unmounts
  // synchronously (React sibling). ContentSwap here drives a fade-up on
  // mount — we pass animateInitial so every activation animates, and we
  // skip `exit` work because siblings mean the old panel is already
  // gone by the time we render.
  return (
    <div
      role="tabpanel"
      id={`${ctx.layoutId}-${value}-panel`}
      aria-labelledby={`${ctx.layoutId}-${value}-tab`}
    >
      <ContentSwap
        id={value}
        variant="fade-up"
        duration={180}
        className={cn("mt-4", className)}
      >
        {children}
      </ContentSwap>
    </div>
  );
}
