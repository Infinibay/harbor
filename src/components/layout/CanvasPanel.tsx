import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface CanvasPanelProps {
  title: ReactNode;
  children: ReactNode;
  /** Uncontrolled starting position (in the Canvas viewport space). */
  defaultPosition?: { x: number; y: number };
  /** Controlled position. */
  position?: { x: number; y: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
  /** Width of the panel; height fits content. */
  width?: number;
  /** Start collapsed? (user can expand via header). */
  defaultCollapsed?: boolean;
  /** Show the × close button. */
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

/** Floating, draggable, collapsible panel — for property inspectors,
 *  layers, history, color pickers, anything you'd find floating over a
 *  canvas app. Drag the header to move; click the chevron to collapse.
 *
 *  Positions itself in the Canvas `overlay` slot (absolute coords
 *  relative to the viewport), so pan/zoom don't move it. */
export function CanvasPanel({
  title,
  children,
  defaultPosition = { x: 16, y: 16 },
  position,
  onPositionChange,
  width = 240,
  defaultCollapsed,
  closable,
  onClose,
  className,
}: CanvasPanelProps) {
  const [internalPos, setInternalPos] = useState(defaultPosition);
  const [collapsed, setCollapsed] = useState(Boolean(defaultCollapsed));
  const [dragging, setDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const pos = position ?? internalPos;
  const setPos = (p: { x: number; y: number }) => {
    if (position === undefined) setInternalPos(p);
    onPositionChange?.(p);
  };

  function onHeaderDown(e: React.MouseEvent) {
    if (e.button !== 0) return;
    // Don't hijack clicks on buttons inside the header.
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    e.preventDefault();
    e.stopPropagation();

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startPos = pos;
    setDragging(true);

    function onMove(ev: MouseEvent) {
      setPos({
        x: startPos.x + (ev.clientX - startMouseX),
        y: startPos.y + (ev.clientY - startMouseY),
      });
    }
    function onUp() {
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div
      ref={panelRef}
      style={{ position: "absolute", left: pos.x, top: pos.y, width }}
      className={cn(
        "pointer-events-auto rounded-xl bg-[#14141c]/92 backdrop-blur-md border border-white/10 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden",
        className,
      )}
    >
      <div
        onMouseDown={onHeaderDown}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        className="flex items-center gap-2 px-3 h-8 bg-white/[0.04] border-b border-white/8 select-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed((c) => !c);
          }}
          aria-label={collapsed ? "Expand" : "Collapse"}
          className="text-white/40 hover:text-white/80 text-xs w-4 text-center"
        >
          {collapsed ? "›" : "⌄"}
        </button>
        <div className="flex-1 text-[11px] uppercase tracking-widest text-white/70 truncate">
          {title}
        </div>
        {closable ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            aria-label="Close"
            className="text-white/40 hover:text-white/80 text-xs w-4 text-center"
          >
            ×
          </button>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.22, ease: [0.32, 0.72, 0, 1] },
              opacity: { duration: 0.15 },
            }}
            className="overflow-hidden"
          >
            <div className="p-3">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
