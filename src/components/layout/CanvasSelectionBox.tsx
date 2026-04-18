import { useEffect, useMemo, useRef, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCanvas } from "./Canvas";

export type SelectionCorner =
  | "nw" | "n" | "ne"
  | "e"
  | "se" | "s" | "sw"
  | "w";

export interface CanvasSelectionBoxProps {
  /** IDs currently selected. */
  ids: ReadonlySet<string> | string[];
  /** All known items — selection bbox is computed by picking those whose
   *  id is in `ids`. Requires at least `{ id, x, y, width, height }`. */
  items: ReadonlyArray<{ id: string; x: number; y: number; width: number; height: number }>;
  /** Called while the user drags the box body. `phase: "end"` fires once
   *  on release so the parent can commit a single history entry. */
  onMove?: (delta: { dx: number; dy: number }, phase: "drag" | "end") => void;
  /** Called while the user drags a handle. `dir` encodes which corner /
   *  edge is being pulled; the parent chooses how to apply the delta to
   *  each selected item. */
  onResize?: (
    opts: { dx: number; dy: number; corner: SelectionCorner; phase: "drag" | "end" },
  ) => void;
  /** Show resize handles. Default: true when one item is selected. */
  showHandles?: boolean;
  /** Padding added around the bbox so handles don't touch content. */
  padding?: number;
  className?: string;
}

/** Floating bounding box rendered in viewport space. Sticks to the
 *  combined bbox of the selected items, following pan/zoom without
 *  re-rendering (via motion values). Drag the body to move the group,
 *  or a handle to resize (single-item selections by default).
 *
 *  Render inside a Canvas `overlay` slot:
 *
 *  ```tsx
 *  <Canvas overlay={<CanvasSelectionBox ids={...} items={...} ... />}>
 *  ```
 */
export function CanvasSelectionBox({
  ids,
  items,
  onMove,
  onResize,
  showHandles,
  padding = 0,
  className,
}: CanvasSelectionBoxProps) {
  const ctx = useCanvas();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const opacity = useMotionValue(0);

  const selectedSet = useMemo(
    () => (ids instanceof Set ? (ids as ReadonlySet<string>) : new Set(ids)),
    [ids],
  );

  // Stable ref to the latest bbox (world coords) for the handle drag math.
  const bboxRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!ctx) return;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let n = 0;
    for (const it of items) {
      if (!selectedSet.has(it.id)) continue;
      n++;
      if (it.x < minX) minX = it.x;
      if (it.y < minY) minY = it.y;
      if (it.x + it.width > maxX) maxX = it.x + it.width;
      if (it.y + it.height > maxY) maxY = it.y + it.height;
    }
    if (n === 0) {
      opacity.set(0);
      return;
    }
    const pad = padding;
    bboxRef.current = {
      x: minX - pad,
      y: minY - pad,
      width: maxX - minX + pad * 2,
      height: maxY - minY + pad * 2,
    };

    const project = () => {
      const z = ctx.zoom.get();
      const px = ctx.x.get();
      const py = ctx.y.get();
      const b = bboxRef.current;
      x.set(b.x * z + px);
      y.set(b.y * z + py);
      width.set(b.width * z);
      height.set(b.height * z);
      opacity.set(1);
    };
    project();
    const u1 = ctx.x.on("change", project);
    const u2 = ctx.y.on("change", project);
    const u3 = ctx.zoom.on("change", project);
    return () => {
      u1();
      u2();
      u3();
    };
  }, [ctx, items, selectedSet, padding, x, y, width, height, opacity]);

  if (!ctx || selectedSet.size === 0) return null;

  const handlesOn = showHandles ?? selectedSet.size === 1;

  const startMove = (e: ReactMouseEvent) => {
    if (e.button !== 0 || !onMove) return;
    e.preventDefault();
    e.stopPropagation();
    const z = ctx.zoom.get();
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    let lastDelta = { dx: 0, dy: 0 };
    const onMouseMove = (ev: MouseEvent) => {
      lastDelta = {
        dx: (ev.clientX - startClientX) / z,
        dy: (ev.clientY - startClientY) / z,
      };
      onMove?.(lastDelta, "drag");
    };
    const onMouseUp = () => {
      onMove?.(lastDelta, "end");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const startResize = (corner: SelectionCorner) => (e: ReactMouseEvent) => {
    if (e.button !== 0 || !onResize) return;
    e.preventDefault();
    e.stopPropagation();
    const z = ctx.zoom.get();
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    let lastDelta = { dx: 0, dy: 0 };
    const onMouseMove = (ev: MouseEvent) => {
      lastDelta = {
        dx: (ev.clientX - startClientX) / z,
        dy: (ev.clientY - startClientY) / z,
      };
      onResize?.({ ...lastDelta, corner, phase: "drag" });
    };
    const onMouseUp = () => {
      onResize?.({ ...lastDelta, corner, phase: "end" });
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        x,
        y,
        width,
        height,
        opacity,
        // Only intercept clicks when `onMove` is wired — otherwise the
        // box is display-only and items beneath stay reachable.
        pointerEvents: onMove ? "auto" : "none",
        cursor: onMove ? "move" : undefined,
      }}
      onMouseDown={onMove ? startMove : undefined}
      className={cn(
        "rounded-[3px] outline outline-1 outline-sky-400/90 bg-sky-400/5",
        className,
      )}
    >
      {handlesOn ? (
        <>
          <Handle corner="nw" onMouseDown={startResize("nw")} />
          <Handle corner="n"  onMouseDown={startResize("n")} />
          <Handle corner="ne" onMouseDown={startResize("ne")} />
          <Handle corner="e"  onMouseDown={startResize("e")} />
          <Handle corner="se" onMouseDown={startResize("se")} />
          <Handle corner="s"  onMouseDown={startResize("s")} />
          <Handle corner="sw" onMouseDown={startResize("sw")} />
          <Handle corner="w"  onMouseDown={startResize("w")} />
        </>
      ) : null}
    </motion.div>
  );
}

const HANDLE_SIZE = 8;

const cornerStyles: Record<SelectionCorner, CSSProperties> = {
  nw: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: "nwse-resize" },
  n:  { top: -HANDLE_SIZE / 2, left: "50%", marginLeft: -HANDLE_SIZE / 2, cursor: "ns-resize" },
  ne: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: "nesw-resize" },
  e:  { top: "50%", right: -HANDLE_SIZE / 2, marginTop: -HANDLE_SIZE / 2, cursor: "ew-resize" },
  se: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: "nwse-resize" },
  s:  { bottom: -HANDLE_SIZE / 2, left: "50%", marginLeft: -HANDLE_SIZE / 2, cursor: "ns-resize" },
  sw: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: "nesw-resize" },
  w:  { top: "50%", left: -HANDLE_SIZE / 2, marginTop: -HANDLE_SIZE / 2, cursor: "ew-resize" },
};

function Handle({
  corner,
  onMouseDown,
}: {
  corner: SelectionCorner;
  onMouseDown: (e: ReactMouseEvent) => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        pointerEvents: "auto",
        ...cornerStyles[corner],
      }}
      className="rounded-[2px] bg-white border border-sky-400 shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
    />
  );
}
