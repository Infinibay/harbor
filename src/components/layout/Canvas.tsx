import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
  type Transition,
} from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";
import { MenuCtx } from "../overlays/Menu";

export type CanvasTransform = { x: number; y: number; zoom: number };

export interface CanvasHandle {
  getTransform(): CanvasTransform;
  setTransform(t: Partial<CanvasTransform>, opts?: AnimOpts): void;
  /** Zoom around a point in screen (viewport) coordinates. */
  zoomTo(
    zoom: number,
    opts?: AnimOpts & { around?: { x: number; y: number } },
  ): void;
  panTo(x: number, y: number, opts?: AnimOpts): void;
  /** Translate a screen-space point to world-space. */
  screenToWorld(p: { x: number; y: number }): { x: number; y: number };
  /** Translate a world-space point to screen-space. */
  worldToScreen(p: { x: number; y: number }): { x: number; y: number };
  /** Fit the world to show every `[data-canvas-bounds]` child. */
  fit(opts?: { padding?: number } & AnimOpts): void;
  /** Reset to x=0, y=0, zoom=1. */
  reset(opts?: AnimOpts): void;
}

interface AnimOpts {
  animate?: boolean;
  /** Spring stiffness (default 260). */
  stiffness?: number;
  damping?: number;
}

interface CanvasCtx {
  x: MotionValue<number>;
  y: MotionValue<number>;
  zoom: MotionValue<number>;
  minZoom: number;
  maxZoom: number;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  /** Same imperative API that's exposed via the Canvas ref — available
   *  to every descendant so toolbars, zoom controls, minimaps etc. can
   *  drive the view without prop drilling. */
  api: CanvasHandle;
}

const CanvasContext = createContext<CanvasCtx | null>(null);

/** Read the enclosing Canvas's live transform. Use to subscribe a
 *  component to pan/zoom — e.g. an overlay that stays pinned to a
 *  world-space coordinate. Returns `null` outside a `<Canvas>`. */
export function useCanvas(): CanvasCtx | null {
  return useContext(CanvasContext);
}

export interface CanvasProps {
  children?: ReactNode;
  minZoom?: number;
  maxZoom?: number;
  defaultTransform?: Partial<CanvasTransform>;
  /** `dots` = dot pattern (Figma/Excalidraw feel), `lines` = grid lines, `false` = none. */
  grid?: "dots" | "lines" | false;
  /** Base grid cell size, in world units. */
  gridSize?: number;
  gridColor?: string;
  /** Major axis every N cells gets a stronger color. Set to 0 to disable. */
  gridMajor?: number;
  gridMajorColor?: string;
  /** How the user pans.
   *  - `space` = hold space + drag (left)
   *  - `middle` = middle-click drag
   *  - `both` (default) = either of the above
   *  - `always` = left-click drag anywhere
   */
  pan?: "space" | "middle" | "both" | "always";
  wheelZoom?: boolean;
  /** Zoom sensitivity. 0.002 = default; larger = faster. */
  wheelSensitivity?: number;
  onTransformChange?: (t: CanvasTransform) => void;
  /** Controlled transform. If provided, the canvas reflects it but the
   *  user can still interact (pass the new value back via `onTransformChange`). */
  transform?: CanvasTransform;
  className?: string;
  style?: CSSProperties;
  /** Custom overlay drawn in viewport (screen) space, on top of world. */
  overlay?: ReactNode;
  /** Right-click menu for the empty canvas (not on an item). Compose with
   *  `MenuItem`, `MenuSeparator`, `MenuLabel` from overlays. Each MenuItem
   *  can take a `submenu` of more MenuItems for nested menus.
   *  When the menu is a function, it receives the click's world-space
   *  coordinates (so you can, e.g., "Add node here"). */
  menu?: ReactNode | ((ctx: { worldX: number; worldY: number }) => ReactNode);
  /** Override the default cursor — useful for tool modes (e.g. `"crosshair"`
   *  while a draw tool is active). The built-in `grab/grabbing` state
   *  during pan still wins. */
  cursor?: CSSProperties["cursor"];
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function isInputField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    target.isContentEditable ||
    tag === "SELECT"
  );
}

/** GPU-accelerated infinite canvas with pan, zoom and a live grid.
 *
 * The viewport fills its container. A world layer inside is transformed
 * via `translate3d + scale` so pan/zoom stay on the compositor thread —
 * hundreds of React children can ride on top without re-rendering on
 * every frame.
 *
 * Pan with space + drag (or middle-click), zoom with the wheel around
 * the cursor. Wrap positioned items in `CanvasItem`, or drop any plain
 * absolutely-positioned child inside and it'll just work.
 *
 * ```tsx
 * const canvas = useRef<CanvasHandle>(null);
 * <Canvas ref={canvas} grid="dots" gridSize={24}>
 *   <CanvasItem x={120} y={200}>
 *     <Button>Click me</Button>
 *   </CanvasItem>
 * </Canvas>
 * ```
 */
export const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas(
  {
    children,
    minZoom = 0.1,
    maxZoom = 8,
    defaultTransform,
    grid = "dots",
    gridSize = 32,
    gridColor = "rgba(255,255,255,0.08)",
    gridMajor = 5,
    gridMajorColor = "rgba(255,255,255,0.14)",
    pan = "both",
    wheelZoom = true,
    wheelSensitivity = 0.002,
    onTransformChange,
    transform,
    className,
    style,
    overlay,
    menu,
    cursor: cursorOverride,
  },
  ref,
) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const menuState = useContextMenuState();
  const x = useMotionValue(defaultTransform?.x ?? transform?.x ?? 0);
  const y = useMotionValue(defaultTransform?.y ?? transform?.y ?? 0);
  const zoom = useMotionValue(defaultTransform?.zoom ?? transform?.zoom ?? 1);
  const [spaceDown, setSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  // Controlled mode: keep motion values in sync with props.
  useEffect(() => {
    if (!transform) return;
    x.set(transform.x);
    y.set(transform.y);
    zoom.set(transform.zoom);
  }, [transform, x, y, zoom]);

  const emit = useCallback(() => {
    onTransformChange?.({ x: x.get(), y: y.get(), zoom: zoom.get() });
  }, [x, y, zoom, onTransformChange]);

  useEffect(() => {
    const uX = x.on("change", emit);
    const uY = y.on("change", emit);
    const uZ = zoom.on("change", emit);
    return () => {
      uX();
      uY();
      uZ();
    };
  }, [x, y, zoom, emit]);

  // Space-bar tracking (pan modifier).
  useEffect(() => {
    if (pan !== "space" && pan !== "both") return;
    function onDown(e: KeyboardEvent) {
      if (e.code === "Space" && !isInputField(e.target)) {
        setSpaceDown(true);
        e.preventDefault();
      }
    }
    function onUp(e: KeyboardEvent) {
      if (e.code === "Space") setSpaceDown(false);
    }
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [pan]);

  // Pan via mouse drag.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    let dragging = false;
    let startClientX = 0;
    let startClientY = 0;
    let startPanX = 0;
    let startPanY = 0;

    function shouldPan(e: MouseEvent): boolean {
      if (pan === "always") return e.button === 0;
      if (pan === "middle") return e.button === 1;
      if (pan === "space") return e.button === 0 && spaceDown;
      return e.button === 1 || (e.button === 0 && spaceDown);
    }

    function onDown(e: MouseEvent) {
      if (!shouldPan(e)) return;
      dragging = true;
      startClientX = e.clientX;
      startClientY = e.clientY;
      startPanX = x.get();
      startPanY = y.get();
      setIsPanning(true);
      e.preventDefault();
    }
    function onMove(e: MouseEvent) {
      if (!dragging) return;
      x.set(startPanX + (e.clientX - startClientX));
      y.set(startPanY + (e.clientY - startClientY));
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      setIsPanning(false);
    }

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [pan, spaceDown, x, y]);

  // Wheel-to-zoom around cursor.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !wheelZoom) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = el!.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const currentZoom = zoom.get();
      const factor = Math.exp(-e.deltaY * wheelSensitivity);
      const newZoom = clamp(currentZoom * factor, minZoom, maxZoom);
      if (newZoom === currentZoom) return;
      const worldX = (px - x.get()) / currentZoom;
      const worldY = (py - y.get()) / currentZoom;
      x.set(px - worldX * newZoom);
      y.set(py - worldY * newZoom);
      zoom.set(newZoom);
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [wheelZoom, wheelSensitivity, x, y, zoom, minZoom, maxZoom]);

  const applyTransform = useCallback(
    (next: CanvasTransform, opts?: AnimOpts) => {
      if (opts?.animate === false) {
        x.set(next.x);
        y.set(next.y);
        zoom.set(next.zoom);
        return;
      }
      const spring = {
        type: "spring" as const,
        stiffness: opts?.stiffness ?? 260,
        damping: opts?.damping ?? 28,
      };
      animate(x, next.x, spring);
      animate(y, next.y, spring);
      animate(zoom, next.zoom, spring);
    },
    [x, y, zoom],
  );

  // Imperative handle (also shared with descendants via context).
  const api = useMemo<CanvasHandle>(
    () => ({
      getTransform: () => ({ x: x.get(), y: y.get(), zoom: zoom.get() }),
      setTransform(t, opts) {
        applyTransform(
          { x: t.x ?? x.get(), y: t.y ?? y.get(), zoom: t.zoom ?? zoom.get() },
          opts,
        );
      },
      zoomTo(newZoom, opts) {
        const clamped = clamp(newZoom, minZoom, maxZoom);
        const el = viewportRef.current;
        const around =
          opts?.around ??
          (el
            ? { x: el.clientWidth / 2, y: el.clientHeight / 2 }
            : { x: 0, y: 0 });
        const currentZoom = zoom.get();
        const worldX = (around.x - x.get()) / currentZoom;
        const worldY = (around.y - y.get()) / currentZoom;
        applyTransform(
          {
            x: around.x - worldX * clamped,
            y: around.y - worldY * clamped,
            zoom: clamped,
          },
          opts,
        );
      },
      panTo(nx, ny, opts) {
        applyTransform({ x: nx, y: ny, zoom: zoom.get() }, opts);
      },
      screenToWorld(p) {
        const z = zoom.get();
        return { x: (p.x - x.get()) / z, y: (p.y - y.get()) / z };
      },
      worldToScreen(p) {
        const z = zoom.get();
        return { x: p.x * z + x.get(), y: p.y * z + y.get() };
      },
      fit(opts) {
        const el = viewportRef.current;
        if (!el) return;
        const bounds = el.querySelectorAll<HTMLElement>(
          "[data-canvas-bounds]",
        );
        if (bounds.length === 0) return;
        // Each bounds elem is inside the world. Read its world-space box
        // from inline style (left/top/width/height) to avoid measuring
        // the live transformed rect.
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        bounds.forEach((b) => {
          const bx = parseFloat(b.dataset.canvasX ?? "0");
          const by = parseFloat(b.dataset.canvasY ?? "0");
          const bw = b.offsetWidth;
          const bh = b.offsetHeight;
          minX = Math.min(minX, bx);
          minY = Math.min(minY, by);
          maxX = Math.max(maxX, bx + bw);
          maxY = Math.max(maxY, by + bh);
        });
        if (!isFinite(minX)) return;
        const padding = opts?.padding ?? 48;
        const vpW = el.clientWidth;
        const vpH = el.clientHeight;
        const worldW = maxX - minX;
        const worldH = maxY - minY;
        const zx = (vpW - padding * 2) / Math.max(worldW, 1);
        const zy = (vpH - padding * 2) / Math.max(worldH, 1);
        const target = clamp(Math.min(zx, zy), minZoom, maxZoom);
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        applyTransform(
          {
            x: vpW / 2 - cx * target,
            y: vpH / 2 - cy * target,
            zoom: target,
          },
          opts,
        );
      },
      reset(opts) {
        applyTransform({ x: 0, y: 0, zoom: 1 }, opts);
      },
    }),
    // applyTransform depends on x/y/zoom motion values, which are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [x, y, zoom, minZoom, maxZoom],
  );
  useImperativeHandle(ref, () => api, [api]);

  const ctxValue = useMemo<CanvasCtx>(
    () => ({ x, y, zoom, minZoom, maxZoom, viewportRef, api }),
    [x, y, zoom, minZoom, maxZoom, api],
  );

  const cursor = isPanning
    ? "grabbing"
    : spaceDown && pan !== "middle" && pan !== "always"
      ? "grab"
      : pan === "always"
        ? "grab"
        : (cursorOverride ?? "default");

  // Right-click on the empty canvas → open the canvas menu at cursor,
  // carrying the world-space coords where the click landed.
  const [menuWorldPos, setMenuWorldPos] = useState<{ worldX: number; worldY: number }>({ worldX: 0, worldY: 0 });
  const onViewportContext = menu
    ? (e: React.MouseEvent) => {
        // If the default was already prevented by a CanvasItem's menu
        // handler, don't open the canvas-level menu.
        if (e.defaultPrevented) return;
        e.preventDefault();
        const rect = viewportRef.current?.getBoundingClientRect();
        if (rect) {
          const screenX = e.clientX - rect.left;
          const screenY = e.clientY - rect.top;
          const z = zoom.get();
          setMenuWorldPos({
            worldX: (screenX - x.get()) / z,
            worldY: (screenY - y.get()) / z,
          });
        }
        menuState.open(e.clientX, e.clientY);
      }
    : undefined;

  return (
    <CanvasContext.Provider value={ctxValue}>
      <div
        ref={viewportRef}
        className={cn(
          // `w-full` by default because the world is absolutely-positioned
          // and collapses the viewport to 0 width otherwise. Users can
          // still override with their own width class.
          "relative w-full overflow-hidden select-none",
          className,
        )}
        style={{ cursor, touchAction: "none", ...style }}
        onContextMenu={onViewportContext}
      >
        {grid ? (
          <CanvasGrid
            type={grid}
            size={gridSize}
            color={gridColor}
            major={gridMajor}
            majorColor={gridMajorColor}
          />
        ) : null}
        <motion.div
          data-canvas-world
          className="absolute top-0 left-0"
          style={{
            x,
            y,
            scale: zoom,
            transformOrigin: "0 0",
            width: 0,
            height: 0,
          }}
        >
          {children}
        </motion.div>
        {overlay ? (
          <div className="absolute inset-0 pointer-events-none">
            {overlay}
          </div>
        ) : null}
      </div>
      {menu ? (
        <CanvasContextMenu state={menuState}>
          {typeof menu === "function" ? menu(menuWorldPos) : menu}
        </CanvasContextMenu>
      ) : null}
    </CanvasContext.Provider>
  );
});

interface CanvasGridProps {
  type: "dots" | "lines";
  size: number;
  color: string;
  major: number;
  majorColor: string;
}

function CanvasGrid({ type, size, color, major, majorColor }: CanvasGridProps) {
  const ctx = useCanvas();
  // Hooks are always called; fall back to a static MV if no ctx.
  const zero = useMotionValue(0);
  const one = useMotionValue(1);
  const px = ctx?.x ?? zero;
  const py = ctx?.y ?? zero;
  const pz = ctx?.zoom ?? one;

  // Background-position: offset by (pan mod cellSize) so the pattern
  // seams stay continuous while scrolling.
  const bgX = useTransform([px, pz], ([vx, vz]) =>
    `${mod(vx as number, size * (vz as number))}px`,
  );
  const bgY = useTransform([py, pz], ([vy, vz]) =>
    `${mod(vy as number, size * (vz as number))}px`,
  );
  const bgSize = useTransform(pz, (z) => `${size * z}px ${size * z}px`);
  const bgPosition = useMotionTemplate`${bgX} ${bgY}`;

  const majorBgX = useTransform([px, pz], ([vx, vz]) =>
    `${mod(vx as number, size * major * (vz as number))}px`,
  );
  const majorBgY = useTransform([py, pz], ([vy, vz]) =>
    `${mod(vy as number, size * major * (vz as number))}px`,
  );
  const majorBgSize = useTransform(
    pz,
    (z) => `${size * major * z}px ${size * major * z}px`,
  );
  const majorBgPosition = useMotionTemplate`${majorBgX} ${majorBgY}`;

  const minorImage =
    type === "dots"
      ? `radial-gradient(circle, ${color} 1px, transparent 1.5px)`
      : `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;
  const majorImage =
    type === "dots"
      ? `radial-gradient(circle, ${majorColor} 1.5px, transparent 2px)`
      : `linear-gradient(to right, ${majorColor} 1px, transparent 1px), linear-gradient(to bottom, ${majorColor} 1px, transparent 1px)`;

  return (
    <>
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: minorImage,
          backgroundSize: bgSize,
          backgroundPosition: bgPosition,
        }}
      />
      {major > 0 ? (
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: majorImage,
            backgroundSize: majorBgSize,
            backgroundPosition: majorBgPosition,
          }}
        />
      ) : null}
    </>
  );
}

export interface CanvasItemProps {
  /** World-space X coordinate of the item's top-left. */
  x: number;
  /** World-space Y coordinate. */
  y: number;
  children: ReactNode;
  /** Stay at constant screen size regardless of zoom (for pins/labels). */
  fixedSize?: boolean;
  /** When true, the user can drag this item; `onDrag` fires with world coords. */
  draggable?: boolean;
  onDrag?: (pos: { x: number; y: number }) => void;
  onDragStart?: (pos: { x: number; y: number }) => void;
  onDragEnd?: (pos: { x: number; y: number }) => void;
  /** Include in bounds for `fit()`. Default true. */
  bounds?: boolean;
  /** Right-click menu for this item — stops the event from bubbling to
   *  the canvas-level menu. Use `MenuItem`, `MenuSeparator`, `MenuLabel`. */
  menu?: ReactNode;
  onContextMenu?: (e: React.MouseEvent) => void;
  /** Animate x/y changes. Pass a Framer Motion `Transition` object, a
   *  shorthand (`"spring"` / `"tween"`), or `false` (default — no
   *  animation, just snap to the new coords). Drag is always instant. */
  transition?: Transition | "spring" | "tween" | false;
  /** Rotation, degrees. Animates when `transition` is set. */
  rotate?: number;
  /** Scale factor. Animates when `transition` is set. */
  scale?: number;
  /** Opacity 0..1. Animates when `transition` is set. */
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

function resolveTransition(t: CanvasItemProps["transition"]): Transition | false {
  if (!t) return false;
  if (t === "spring") return { type: "spring", stiffness: 260, damping: 28 };
  if (t === "tween") return { type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] };
  return t;
}

/** Absolutely-positioned child of a `Canvas`. Accepts any JSX — buttons,
 *  cards, inputs, images — and places it at `{x, y}` in world coords. */
export function CanvasItem({
  x,
  y,
  children,
  fixedSize,
  draggable,
  onDrag,
  onDragStart,
  onDragEnd,
  bounds = true,
  menu,
  onContextMenu,
  transition,
  rotate,
  scale,
  opacity,
  className,
  style,
}: CanvasItemProps) {
  const ctx = useCanvas();
  const fallback = useMotionValue(1);
  const inverse = useTransform(ctx?.zoom ?? fallback, (z) => 1 / z);
  const menuState = useContextMenuState();

  // Motion values drive the actual transform so prop changes animate
  // without re-rendering the whole subtree.
  const xMV = useMotionValue(x);
  const yMV = useMotionValue(y);
  const rotateMV = useMotionValue(rotate ?? 0);
  const scaleMV = useMotionValue(scale ?? 1);
  const opacityMV = useMotionValue(opacity ?? 1);
  const draggingRef = useRef(false);
  const resolvedTransition = resolveTransition(transition);

  // Sync motion values to props (animating when `transition` is set).
  useEffect(() => {
    const t = resolvedTransition;
    const syncOrAnimate = (mv: MotionValue<number>, next: number) => {
      if (!t || draggingRef.current) {
        mv.set(next);
      } else {
        animate(mv, next, t);
      }
    };
    syncOrAnimate(xMV, x);
    syncOrAnimate(yMV, y);
    // These are undefined → don't animate (keep defaults), but if
    // defined, sync/animate them.
    if (rotate !== undefined) syncOrAnimate(rotateMV, rotate);
    if (scale !== undefined) syncOrAnimate(scaleMV, scale);
    if (opacity !== undefined) syncOrAnimate(opacityMV, opacity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y, rotate, scale, opacity, transition]);

  const handleContextMenu = (e: React.MouseEvent) => {
    onContextMenu?.(e);
    if (menu && !e.defaultPrevented) {
      // Signal to the canvas-level handler that this event is ours.
      e.preventDefault();
      e.stopPropagation();
      menuState.open(e.clientX, e.clientY);
    }
  };

  const handleMouseDown = draggable && ctx
    ? (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        const currentZoom = ctx.zoom.get();
        const startClientX = e.clientX;
        const startClientY = e.clientY;
        const startX = xMV.get();
        const startY = yMV.get();
        draggingRef.current = true;
        onDragStart?.({ x: startX, y: startY });
        let latestPos = { x: startX, y: startY };
        function onMove(ev: MouseEvent) {
          const dx = (ev.clientX - startClientX) / currentZoom;
          const dy = (ev.clientY - startClientY) / currentZoom;
          latestPos = { x: startX + dx, y: startY + dy };
          xMV.set(latestPos.x);
          yMV.set(latestPos.y);
          onDrag?.(latestPos);
        }
        function onUp() {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          draggingRef.current = false;
          onDragEnd?.(latestPos);
        }
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      }
    : undefined;

  const content = fixedSize ? (
    <motion.div
      style={{ scale: inverse, transformOrigin: "0 0" }}
      className={className}
    >
      {children}
    </motion.div>
  ) : (
    <div className={className}>{children}</div>
  );

  return (
    <>
      <motion.div
        data-canvas-bounds={bounds ? "" : undefined}
        data-canvas-x={x}
        data-canvas-y={y}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x: xMV,
          y: yMV,
          rotate: rotate !== undefined ? rotateMV : undefined,
          scale: scale !== undefined ? scaleMV : undefined,
          opacity: opacity !== undefined ? opacityMV : undefined,
          cursor: draggable ? "grab" : undefined,
          ...style,
        }}
      >
        {content}
      </motion.div>
      {menu ? (
        <CanvasContextMenu state={menuState}>{menu}</CanvasContextMenu>
      ) : null}
    </>
  );
}

// === Right-click menu plumbing ==============================

interface ContextMenuState {
  isOpen: boolean;
  pos: { x: number; y: number };
  menuRef: React.RefObject<HTMLDivElement | null>;
  open: (x: number, y: number) => void;
  close: () => void;
}

function useContextMenuState(): ContextMenuState {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onDocClick(e: globalThis.MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const open = useCallback((cx: number, cy: number) => {
    // Flip against the viewport if the menu would overflow.
    setPos({ x: cx, y: cy });
    setIsOpen(true);
    requestAnimationFrame(() => {
      const mr = menuRef.current?.getBoundingClientRect();
      if (!mr) return;
      let nx = cx;
      let ny = cy;
      if (nx + mr.width > window.innerWidth - 8)
        nx = window.innerWidth - mr.width - 8;
      if (ny + mr.height > window.innerHeight - 8)
        ny = window.innerHeight - mr.height - 8;
      if (nx !== cx || ny !== cy) setPos({ x: nx, y: ny });
    });
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, pos, menuRef, open, close };
}

function CanvasContextMenu({
  state,
  children,
}: {
  state: ContextMenuState;
  children: ReactNode;
}) {
  return (
    <MenuCtx.Provider value={{ close: state.close }}>
      <Portal>
        <AnimatePresence>
          {state.isOpen ? (
            <motion.div
              ref={state.menuRef}
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ type: "spring", stiffness: 520, damping: 32 }}
              style={{
                position: "fixed",
                left: state.pos.x,
                top: state.pos.y,
                zIndex: Z.CONTEXT_MENU,
                transformOrigin: "top left",
              }}
              className="min-w-[200px] rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-1"
            >
              {children}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </MenuCtx.Provider>
  );
}
