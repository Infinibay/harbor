import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FlyoutToolbarItem {
  id: string;
  icon: ReactNode;
  label?: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Render a thin divider *after* this item. */
  divider?: boolean;
}

export interface FlyoutToolbarGroup {
  id: string;
  /** Header label shown inside the submenu. */
  label: string;
  items: FlyoutToolbarItem[];
  /** Render a thin divider *after* this group. */
  divider?: boolean;
  /** Explicit icon for the group button. Default: icon of the active item,
   *  falling back to the first item. */
  icon?: ReactNode;
  /** Explicit tooltip. Default: group label + active item's shortcut. */
  title?: string;
}

export type FlyoutToolbarEntry =
  | { kind: "item"; item: FlyoutToolbarItem }
  | { kind: "group"; group: FlyoutToolbarGroup };

export interface FlyoutToolbarProps {
  entries: FlyoutToolbarEntry[];
  orientation?: "vertical" | "horizontal";
  /** Float inside a Canvas `overlay` slot, pinned to one side. Set
   *  `floating={false}` to render inline. */
  floating?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  /** Title block rendered above (vertical) / before (horizontal) the tools. */
  title?: ReactNode;
  /** Extra trailing node — e.g. a settings gear or "more" button. */
  trailing?: ReactNode;
  className?: string;
  /** Delay in ms before a hovered group closes after the pointer leaves.
   *  Defaults to 120. */
  flyoutCloseDelay?: number;
}

/**
 * Floating tool rail with flyout groups. Related tools collapse into a
 * single group button that shows the last-used (or first) member; hovering
 * (or right-clicking) the group opens a perpendicular submenu from which
 * any member can be chosen. Keeps the rail compact on small viewports.
 */
export function FlyoutToolbar({
  entries,
  orientation = "vertical",
  floating = true,
  position = "left",
  title,
  trailing,
  className,
  flyoutCloseDelay = 120,
}: FlyoutToolbarProps) {
  const posCls = floating
    ? {
        left: "absolute top-4 left-4",
        right: "absolute top-4 right-4",
        top: "absolute top-4 left-1/2 -translate-x-1/2",
        bottom: "absolute bottom-4 left-1/2 -translate-x-1/2",
      }[position]
    : "";

  return (
    <div
      className={cn(
        "pointer-events-auto flex gap-0.5 p-1 rounded-xl bg-[#14141c]/85 backdrop-blur-md border border-white/10 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.5)]",
        orientation === "vertical" ? "flex-col" : "flex-row items-center",
        posCls,
        className,
      )}
    >
      {title ? (
        <div
          className={cn(
            "text-[10px] uppercase tracking-widest text-white/40 px-2 py-1.5",
            orientation === "vertical" ? "border-b border-white/8" : "border-r border-white/8",
          )}
        >
          {title}
        </div>
      ) : null}

      {entries.map((entry) => (
        <Fragment key={entry.kind === "item" ? entry.item.id : entry.group.id}>
          {entry.kind === "item" ? (
            <ToolbarIconButton item={entry.item} />
          ) : (
            <GroupButton group={entry.group} orientation={orientation} closeDelay={flyoutCloseDelay} />
          )}
          {(entry.kind === "item" ? entry.item.divider : entry.group.divider) ? (
            orientation === "vertical" ? (
              <div className="h-px bg-white/10 my-1 mx-1.5" />
            ) : (
              <div className="w-px bg-white/10 mx-1 my-1.5" />
            )
          ) : null}
        </Fragment>
      ))}

      {trailing ? (
        <>
          {orientation === "vertical" ? (
            <div className="h-px bg-white/10 my-1 mx-1.5" />
          ) : (
            <div className="w-px bg-white/10 mx-1 my-1.5" />
          )}
          {trailing}
        </>
      ) : null}
    </div>
  );
}

function ToolbarIconButton({ item }: { item: FlyoutToolbarItem }) {
  return (
    <button
      onClick={item.onClick}
      disabled={item.disabled}
      title={item.shortcut ? `${item.label ?? item.id} · ${item.shortcut}` : item.label}
      aria-label={item.label ?? item.id}
      aria-pressed={item.active}
      className={cn(
        "w-9 h-9 rounded-lg grid place-items-center transition-colors text-base",
        item.active
          ? "bg-fuchsia-500/20 text-fuchsia-200 ring-1 ring-inset ring-fuchsia-400/40"
          : "text-white/70 hover:bg-white/5 hover:text-white",
        item.disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {item.icon}
    </button>
  );
}

function GroupButton({
  group, orientation, closeDelay,
}: {
  group: FlyoutToolbarGroup;
  orientation: "vertical" | "horizontal";
  closeDelay: number;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeItem = group.items.find((i) => i.active) ?? group.items[0];
  const hasActive = group.items.some((i) => i.active);
  const icon = group.icon ?? activeItem?.icon;

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Submenu sits perpendicular to the rail so it never occludes sibling
  // group buttons.
  const flyoutPlacement = orientation === "vertical"
    ? "left-full top-0 ml-1.5"
    : "top-full left-0 mt-1.5";
  const flyoutOrient = orientation === "vertical" ? "flex-row" : "flex-col";
  const labelBorder = orientation === "vertical"
    ? "border-r border-white/8"
    : "border-b border-white/8";

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => activeItem?.onClick?.()}
        onContextMenu={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        title={group.title ?? `${group.label}${activeItem?.shortcut ? ` · ${activeItem.shortcut}` : ""}`}
        aria-label={group.label}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "w-9 h-9 rounded-lg grid place-items-center transition-colors text-base relative",
          hasActive
            ? "bg-fuchsia-500/20 text-fuchsia-200 ring-1 ring-inset ring-fuchsia-400/40"
            : "text-white/70 hover:bg-white/5 hover:text-white",
        )}
      >
        {icon}
        <span
          aria-hidden
          className={cn(
            "absolute bottom-0.5 right-0.5 w-1.5 h-1.5",
            hasActive ? "text-fuchsia-200/80" : "text-white/40",
          )}
        >
          <svg viewBox="0 0 6 6" className="w-full h-full fill-current">
            <path d="M6 0 L6 6 L0 6 Z" />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className={cn("absolute z-40", flyoutPlacement)}
        >
          <div
            className={cn(
              "flex gap-0.5 p-1 rounded-xl bg-[#14141c]/95 backdrop-blur-md border border-white/10 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.5)]",
              flyoutOrient,
              orientation === "vertical" ? "items-center" : "items-stretch",
            )}
          >
            <div
              className={cn(
                "text-[9px] uppercase tracking-widest text-white/40 px-2 py-1 whitespace-nowrap",
                labelBorder,
              )}
            >
              {group.label}
            </div>
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                disabled={item.disabled}
                title={item.shortcut ? `${item.label ?? item.id} · ${item.shortcut}` : item.label}
                aria-label={item.label ?? item.id}
                aria-pressed={item.active}
                className={cn(
                  "w-9 h-9 rounded-lg grid place-items-center transition-colors text-base shrink-0",
                  item.active
                    ? "bg-fuchsia-500/20 text-fuchsia-200 ring-1 ring-inset ring-fuchsia-400/40"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                  item.disabled && "opacity-40 cursor-not-allowed",
                )}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
