import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface SplitPaneProps {
  orientation?: "horizontal" | "vertical";
  initialSize?: number;
  /** 0..1 of total. If >=2, interpreted as px. */
  min?: number;
  max?: number;
  first: ReactNode;
  second: ReactNode;
  className?: string;
  collapsible?: boolean;
}

export function SplitPane({
  orientation = "horizontal",
  initialSize = 280,
  min = 160,
  max = 600,
  first,
  second,
  className,
  collapsible,
}: SplitPaneProps) {
  const [size, setSize] = useState(initialSize);
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{ pos: number; size: number } | null>(null);

  function onDown(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = {
      pos: orientation === "horizontal" ? e.clientX : e.clientY,
      size,
    };
    setDragging(true);
  }
  function onMove(e: RPointerEvent<HTMLDivElement>) {
    if (!dragging || !startRef.current) return;
    const cur = orientation === "horizontal" ? e.clientX : e.clientY;
    const delta = cur - startRef.current.pos;
    const next = Math.max(min, Math.min(max, startRef.current.size + delta));
    setSize(next);
  }
  function onUp(e: RPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(false);
  }
  function onDouble() {
    if (!collapsible) return;
    setCollapsed((c) => !c);
  }

  useEffect(() => {
    if (!dragging) return;
    function stop() {
      setDragging(false);
    }
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, [dragging]);

  const effectiveSize = collapsed ? 0 : size;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full h-full min-h-0 min-w-0",
        orientation === "vertical" && "flex-col",
        className,
      )}
    >
      <motion.div
        animate={{
          [orientation === "horizontal" ? "width" : "height"]: effectiveSize,
        }}
        transition={
          dragging
            ? { duration: 0 }
            : { type: "spring", stiffness: 400, damping: 38 }
        }
        style={{ flexShrink: 0, overflow: "hidden" }}
        className="min-w-0 min-h-0"
      >
        {first}
      </motion.div>
      <div
        role="separator"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onDoubleClick={onDouble}
        aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
        className={cn(
          "group relative shrink-0 flex items-center justify-center transition-colors",
          orientation === "horizontal"
            ? "w-1 h-full cursor-col-resize"
            : "h-1 w-full cursor-row-resize",
          dragging ? "bg-fuchsia-400/50" : "bg-white/5 hover:bg-white/10",
        )}
      >
        <span
          className={cn(
            "block rounded-full bg-white/0 group-hover:bg-white/30 transition-colors",
            orientation === "horizontal"
              ? "w-0.5 h-8"
              : "h-0.5 w-8",
          )}
        />
      </div>
      <div className="flex-1 min-w-0 min-h-0 overflow-auto">{second}</div>
    </div>
  );
}
