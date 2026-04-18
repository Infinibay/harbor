import { Fragment, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface CanvasToolbarItem {
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

export interface CanvasToolbarProps {
  items: CanvasToolbarItem[];
  orientation?: "vertical" | "horizontal";
  /** Float inside a Canvas `overlay` slot, pinned to one side. Set
   *  `floating={false}` to render inline. */
  floating?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  /** Title block rendered above (vertical) / before (horizontal) the tools. */
  title?: ReactNode;
  className?: string;
}

/** Floating tool rail — the vertical strip of icons that every serious
 *  canvas app has. Pairs with a Canvas `overlay` slot. */
export function CanvasToolbar({
  items,
  orientation = "vertical",
  floating = true,
  position = "left",
  title,
  className,
}: CanvasToolbarProps) {
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
      {items.map((it) => (
        <Fragment key={it.id}>
          <button
            onClick={it.onClick}
            disabled={it.disabled}
            title={
              it.shortcut
                ? `${it.label ?? it.id} · ${it.shortcut}`
                : it.label
            }
            aria-label={it.label ?? it.id}
            aria-pressed={it.active}
            className={cn(
              "w-9 h-9 rounded-lg grid place-items-center transition-colors text-base",
              it.active
                ? "bg-fuchsia-500/20 text-fuchsia-200 ring-1 ring-inset ring-fuchsia-400/40"
                : "text-white/70 hover:bg-white/5 hover:text-white",
              it.disabled && "opacity-40 cursor-not-allowed",
            )}
          >
            {it.icon}
          </button>
          {it.divider ? (
            orientation === "vertical" ? (
              <div className="h-px bg-white/10 my-1 mx-1.5" />
            ) : (
              <div className="w-px bg-white/10 mx-1 my-1.5" />
            )
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
