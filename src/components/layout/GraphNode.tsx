import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type GraphNodeStatus = "idle" | "queued" | "running" | "success" | "warning" | "error" | "disabled";
export type GraphPortSide = "left" | "right" | "top" | "bottom";
export type GraphPortStatus = "idle" | "active" | "success" | "warning" | "error" | "disabled";

export interface GraphPortSpec {
  id: string;
  label?: ReactNode;
  side?: GraphPortSide;
  color?: string;
  status?: GraphPortStatus;
  disabled?: boolean;
}

export interface GraphNodeProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  status?: GraphNodeStatus;
  selected?: boolean;
  disabled?: boolean;
  inputs?: ReactNode;
  outputs?: ReactNode;
  ports?: GraphPortSpec[];
  meta?: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const statusTone: Record<GraphNodeStatus, string> = {
  idle: "bg-[rgb(var(--harbor-text-subtle))]",
  queued: "bg-[rgb(var(--harbor-info))]",
  running: "bg-[rgb(var(--harbor-warning))]",
  success: "bg-[rgb(var(--harbor-success))]",
  warning: "bg-[rgb(var(--harbor-warning))]",
  error: "bg-[rgb(var(--harbor-danger))]",
  disabled: "bg-[rgb(var(--harbor-text-subtle))]",
};

const portStatusTone: Record<GraphPortStatus, string> = {
  idle: "var(--harbor-graph-port-bg)",
  active: "rgb(var(--harbor-accent))",
  success: "rgb(var(--harbor-success))",
  warning: "rgb(var(--harbor-warning))",
  error: "rgb(var(--harbor-danger))",
  disabled: "rgb(var(--harbor-text-subtle))",
};

export function GraphNode({
  title,
  subtitle,
  icon,
  status = "idle",
  selected,
  disabled,
  inputs,
  outputs,
  ports,
  meta,
  footer,
  actions,
  className,
  style,
}: GraphNodeProps) {
  const muted = disabled || status === "disabled";
  const leftPorts = ports?.filter((port) => (port.side ?? "left") === "left") ?? [];
  const rightPorts = ports?.filter((port) => port.side === "right") ?? [];
  const topPorts = ports?.filter((port) => port.side === "top") ?? [];
  const bottomPorts = ports?.filter((port) => port.side === "bottom") ?? [];
  return (
    <div
      className={cn(
        [
          "relative box-border w-[var(--harbor-graph-node-width)] rounded-[var(--harbor-graph-node-radius)] border p-[var(--harbor-graph-node-padding)]",
          "bg-[var(--harbor-graph-node-bg)] text-[color:var(--harbor-graph-node-fg)] shadow-[var(--harbor-graph-node-shadow)]",
          selected
            ? "border-[color:var(--harbor-graph-node-border-active)] bg-[var(--harbor-graph-node-bg-active)]"
            : "border-[color:var(--harbor-graph-node-border)]",
          muted ? "opacity-55" : "",
        ].join(" "),
        className,
      )}
      style={style}
    >
      {topPorts.length ? <GraphPortGroup side="top" ports={topPorts} /> : null}
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--harbor-radius-md)] bg-[rgb(var(--harbor-accent)/0.15)] text-[rgb(var(--harbor-accent-2))]">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 shrink-0 rounded-full", statusTone[muted ? "disabled" : status])} />
            <div className="min-w-0 truncate text-sm font-semibold">{title}</div>
          </div>
          {subtitle ? (
            <div className="mt-1 truncate text-xs text-[color:var(--harbor-graph-node-muted-fg)]">{subtitle}</div>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {meta ? <div className="mt-3 text-xs text-[color:var(--harbor-graph-node-subtle-fg)]">{meta}</div> : null}
      {footer ? <div className="mt-3 border-t border-[color:var(--harbor-graph-node-border)] pt-3">{footer}</div> : null}
      {leftPorts.length ? <GraphPortGroup side="left" ports={leftPorts} /> : inputs ? <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">{inputs}</div> : null}
      {rightPorts.length ? <GraphPortGroup side="right" ports={rightPorts} /> : outputs ? <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">{outputs}</div> : null}
      {bottomPorts.length ? <GraphPortGroup side="bottom" ports={bottomPorts} /> : null}
    </div>
  );
}

export interface GraphPortProps {
  id?: string;
  side?: "input" | "output" | GraphPortSide;
  active?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  color?: string;
  status?: GraphPortStatus;
  label?: string;
  className?: string;
}

export function GraphPort({
  id,
  side = "output",
  active,
  invalid,
  disabled,
  color,
  status = "idle",
  label,
  className,
}: GraphPortProps) {
  const visualSide = side === "input" ? "left" : side === "output" ? "right" : side;
  const portColor = color ?? portStatusTone[invalid ? "error" : disabled ? "disabled" : active ? "active" : status];
  return (
    <span
      title={label}
      aria-label={label}
      data-graph-port=""
      data-graph-port-side={visualSide}
      data-graph-port-id={id ?? label}
      className={cn(
        [
          "block h-[var(--harbor-graph-port-size)] w-[var(--harbor-graph-port-size)] rounded-full border-2",
          "border-[color:var(--harbor-graph-port-border)]",
          active ? "ring-4 ring-[color:var(--harbor-graph-port-ring)]" : "",
          disabled ? "opacity-50" : "",
          visualSide === "left" ? "shadow-[-4px_0_14px_-8px_currentColor]" : "",
          visualSide === "right" ? "shadow-[4px_0_14px_-8px_currentColor]" : "",
          visualSide === "top" ? "shadow-[0_-4px_14px_-8px_currentColor]" : "",
          visualSide === "bottom" ? "shadow-[0_4px_14px_-8px_currentColor]" : "",
        ].join(" "),
        className,
      )}
      style={{ background: portColor, color: portColor }}
    />
  );
}

export function GraphPortGroup({
  ports,
  side = "left",
  className,
}: {
  ports: GraphPortSpec[];
  side?: GraphPortSide;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute flex gap-2",
        side === "left" ? "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col" : "",
        side === "right" ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex-col" : "",
        side === "top" ? "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" : "",
        side === "bottom" ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" : "",
        className,
      )}
    >
      {ports.map((port) => (
        <GraphPort
          key={port.id}
          id={port.id}
          side={side}
          label={typeof port.label === "string" ? port.label : port.id}
          color={port.color}
          status={port.status}
          disabled={port.disabled}
        />
      ))}
    </div>
  );
}

export interface GraphPaletteItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: ReactNode;
}

export interface GraphNodePaletteProps {
  items: GraphPaletteItem[];
  query?: string;
  onQueryChange?: (query: string) => void;
  onAdd: (item: GraphPaletteItem) => void;
  draggableItems?: boolean;
  dragMimeType?: string;
  className?: string;
}

export function GraphNodePalette({
  items,
  query = "",
  onQueryChange,
  onAdd,
  draggableItems,
  dragMimeType = "application/x-harbor-graph-palette-item",
  className,
}: GraphNodePaletteProps) {
  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? items.filter((item) => `${item.label} ${item.description ?? ""} ${item.category ?? ""}`.toLowerCase().includes(needle))
    : items;
  const groups = new Map<string, GraphPaletteItem[]>();
  for (const item of filtered) groups.set(item.category ?? "General", [...(groups.get(item.category ?? "General") ?? []), item]);

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <input
        value={query}
        onChange={(event) => onQueryChange?.(event.target.value)}
        className="h-9 rounded-[var(--harbor-workbench-radius,var(--harbor-radius-md))] border border-[color:var(--harbor-graph-panel-border)] bg-black/20 px-3 text-sm outline-none focus:border-[rgb(var(--harbor-accent))]"
        placeholder="Search nodes..."
      />
      <div className="mt-3 min-h-0 overflow-auto">
        {Array.from(groups.entries()).map(([category, group]) => (
          <section key={category} className="mb-4">
            <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[rgb(var(--harbor-text-subtle))]">{category}</div>
            <div className="grid gap-2">
              {group.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  draggable={draggableItems}
                  onDragStart={(event) => {
                    if (!draggableItems) return;
                    event.dataTransfer.effectAllowed = "copy";
                    event.dataTransfer.setData(dragMimeType, JSON.stringify(item));
                    event.dataTransfer.setData("text/plain", item.label);
                  }}
                  onClick={() => onAdd(item)}
                  className="flex items-center gap-3 rounded-[var(--harbor-workbench-radius,var(--harbor-radius-md))] border border-[color:var(--harbor-graph-panel-border)] bg-white/[0.035] p-3 text-left hover:bg-white/[0.07]"
                >
                  {item.icon ? <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[rgb(var(--harbor-accent)/0.14)]">{item.icon}</span> : null}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{item.label}</span>
                    {item.description ? <span className="block truncate text-xs text-[rgb(var(--harbor-text-muted))]">{item.description}</span> : null}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export interface ExecutionTraceItem {
  id: string;
  label: ReactNode;
  detail?: ReactNode;
  status?: GraphNodeStatus;
}

export function ExecutionTrace({ items, className }: { items: ExecutionTraceItem[]; className?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[14px_minmax(0,1fr)] gap-2 text-xs">
          <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", statusTone[item.status ?? "idle"])} />
          <span className="min-w-0">
            <span className="block truncate text-[color:var(--harbor-graph-node-fg)]">{item.label}</span>
            {item.detail ? <span className="block truncate text-[color:var(--harbor-graph-node-muted-fg)]">{item.detail}</span> : null}
          </span>
        </div>
      ))}
    </div>
  );
}
