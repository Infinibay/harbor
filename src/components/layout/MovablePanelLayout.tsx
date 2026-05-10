import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

export type MovablePanelPosition = "left" | "right" | "bottom" | "hidden";

export interface MovablePanel {
  id: string;
  title: string;
  subtitle?: string;
  position: MovablePanelPosition;
  content: ReactNode;
  minSize?: number;
  size?: number;
}

export interface MovablePanelLayoutProps {
  panels: readonly MovablePanel[];
  children: ReactNode;
  onPanelMove: (panelId: string, position: MovablePanelPosition) => void;
  className?: string;
  leftSize?: number;
  rightSize?: number;
  bottomSize?: number;
}

interface PanelDragState {
  panelId: string;
  startX: number;
  startY: number;
  active: boolean;
}

export function MovablePanelLayout({
  panels,
  children,
  onPanelMove,
  className,
  leftSize = 320,
  rightSize = 320,
  bottomSize = 280,
}: MovablePanelLayoutProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragEndedRef = useRef(false);
  const [dragState, setDragState] = useState<PanelDragState | null>(null);
  const [dropTarget, setDropTarget] = useState<Exclude<MovablePanelPosition, "hidden"> | null>(null);
  const left = panels.filter((panel) => panel.position === "left");
  const right = panels.filter((panel) => panel.position === "right");
  const bottom = panels.filter((panel) => panel.position === "bottom");
  const draggingPanelId = dragState?.panelId ?? null;

  function beginPanelDrag(panelId: string, event: PointerEvent<HTMLElement> | ReactMouseEvent<HTMLElement>) {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    if ("pointerId" in event) {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    dragEndedRef.current = false;
    setDragState({
      panelId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
    });
  }

  const endPanelDrag = useCallback(function endPanelDrag() {
    setDragState(null);
    setDropTarget(null);
  }, []);

  const getDropTarget = useCallback(function getDropTarget(clientX: number, clientY: number): Exclude<MovablePanelPosition, "hidden"> | null {
    const root = rootRef.current;
    if (!root) return null;
    const rect = root.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (y >= rect.height - bottomSize) return "bottom";
    if (x <= leftSize) return "left";
    if (x >= rect.width - rightSize) return "right";
    return null;
  }, [bottomSize, leftSize, rightSize]);

  useEffect(() => {
    if (!dragState) return;
    const currentDrag = dragState;

    function handleDragMove(event: globalThis.PointerEvent | globalThis.MouseEvent) {
      const distance = Math.hypot(event.clientX - currentDrag.startX, event.clientY - currentDrag.startY);
      const active = currentDrag.active || distance > 5;
      if (!active) return;
      if (!currentDrag.active) {
        setDragState((current) => (current ? { ...current, active: true } : current));
      }
      setDropTarget(getDropTarget(event.clientX, event.clientY));
    }

    function handleDragEnd(event: globalThis.PointerEvent | globalThis.MouseEvent) {
      if (dragEndedRef.current) return;
      dragEndedRef.current = true;
      const target = getDropTarget(event.clientX, event.clientY);
      const distance = Math.hypot(event.clientX - currentDrag.startX, event.clientY - currentDrag.startY);
      if ((currentDrag.active || distance > 5) && target) {
        onPanelMove(currentDrag.panelId, target);
      }
      endPanelDrag();
    }

    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd, { once: true });
    window.addEventListener("pointercancel", endPanelDrag, { once: true });
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd, { once: true });

    return () => {
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);
      window.removeEventListener("pointercancel", endPanelDrag);
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [dragState, endPanelDrag, getDropTarget, onPanelMove]);

  return (
    <div
      ref={rootRef}
      className={cn("relative grid h-full min-h-0 w-full min-w-0 bg-[var(--harbor-workbench-bg,var(--harbor-surface-0))]", className)}
      style={{
        gridTemplateRows: bottom.length ? `minmax(0,1fr) ${bottomSize}px` : "minmax(0,1fr)",
      }}
    >
      <div
        className="grid min-h-0 min-w-0"
        style={{
          gridTemplateColumns: `${left.length ? `${leftSize}px` : "0px"} minmax(0,1fr) ${right.length ? `${rightSize}px` : "0px"}`,
        }}
      >
        <PanelZone side="left" panels={left} onPanelMove={onPanelMove} onPanelDragStart={beginPanelDrag} />
        <div className="min-h-0 min-w-0 overflow-hidden">{children}</div>
        <PanelZone side="right" panels={right} onPanelMove={onPanelMove} onPanelDragStart={beginPanelDrag} />
      </div>
      {bottom.length ? (
        <PanelZone side="bottom" panels={bottom} onPanelMove={onPanelMove} onPanelDragStart={beginPanelDrag} />
      ) : null}
      {draggingPanelId && dragState?.active ? (
        <DockDropOverlay
          panels={panels}
          draggingPanelId={draggingPanelId}
          target={dropTarget}
          leftSize={leftSize}
          rightSize={rightSize}
          bottomSize={bottomSize}
        />
      ) : null}
    </div>
  );
}

function PanelZone({
  side,
  panels,
  onPanelMove,
  onPanelDragStart,
}: {
  side: Exclude<MovablePanelPosition, "hidden">;
  panels: readonly MovablePanel[];
  onPanelMove: (panelId: string, position: MovablePanelPosition) => void;
  onPanelDragStart: (panelId: string, event: PointerEvent<HTMLElement> | ReactMouseEvent<HTMLElement>) => void;
}) {
  if (!panels.length) return <div className="min-h-0 min-w-0 overflow-hidden" />;
  return (
    <aside
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-hidden bg-[var(--harbor-workbench-panel-bg,var(--harbor-surface-1))]",
        side === "left" && "border-r border-[var(--harbor-workbench-border,var(--harbor-border))]",
        side === "right" && "border-l border-[var(--harbor-workbench-border,var(--harbor-border))]",
        side === "bottom" && "border-t border-[var(--harbor-workbench-border,var(--harbor-border))]",
      )}
    >
      {panels.map((panel) => (
        <MovablePanelFrame key={panel.id} panel={panel} onPanelMove={onPanelMove} onPanelDragStart={onPanelDragStart} />
      ))}
    </aside>
  );
}

function MovablePanelFrame({
  panel,
  onPanelMove,
  onPanelDragStart,
}: {
  panel: MovablePanel;
  onPanelMove: (panelId: string, position: MovablePanelPosition) => void;
  onPanelDragStart: (panelId: string, event: PointerEvent<HTMLElement> | ReactMouseEvent<HTMLElement>) => void;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        onPointerDown={(event) => onPanelDragStart(panel.id, event)}
        onMouseDown={(event) => {
          if ("PointerEvent" in window) return;
          onPanelDragStart(panel.id, event);
        }}
        className="flex h-10 shrink-0 cursor-grab items-center gap-2 border-b border-[var(--harbor-workbench-border,var(--harbor-border))] bg-[var(--harbor-workbench-tab-bg,var(--harbor-surface-2))] px-3 active:cursor-grabbing"
      >
        <span
          aria-hidden="true"
          className="h-6 w-3 shrink-0 rounded-sm border border-dashed border-[var(--harbor-workbench-border-strong,var(--harbor-border-strong))] bg-[repeating-linear-gradient(0deg,transparent_0,transparent_3px,rgb(var(--harbor-accent)/0.65)_3px,rgb(var(--harbor-accent)/0.65)_4px)] opacity-70"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-[color:var(--harbor-workbench-fg,var(--harbor-fg))]">{panel.title}</div>
          {panel.subtitle ? (
            <div className="truncate text-[11px] text-[color:var(--harbor-workbench-fg-muted,var(--harbor-fg-muted))]">{panel.subtitle}</div>
          ) : null}
        </div>
        <PanelMoveButton label="Hide" onClick={() => onPanelMove(panel.id, "hidden")}>
          x
        </PanelMoveButton>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{panel.content}</div>
    </section>
  );
}

function DockDropOverlay({
  panels,
  draggingPanelId,
  target,
  leftSize,
  rightSize,
  bottomSize,
}: {
  panels: readonly MovablePanel[];
  draggingPanelId: string;
  target: Exclude<MovablePanelPosition, "hidden"> | null;
  leftSize: number;
  rightSize: number;
  bottomSize: number;
}) {
  function hasPanelAt(position: Exclude<MovablePanelPosition, "hidden">, previewTarget: Exclude<MovablePanelPosition, "hidden">) {
    return panels.some((panel) => panel.id !== draggingPanelId && panel.position === position) || previewTarget === position;
  }

  function zoneStyle(position: Exclude<MovablePanelPosition, "hidden">): CSSProperties {
    const bottomVisible = hasPanelAt("bottom", position);
    const topAreaBottom = bottomVisible ? bottomSize : 0;
    if (position === "left") {
      return {
        left: 0,
        top: 0,
        bottom: topAreaBottom,
        width: leftSize,
      };
    }
    if (position === "right") {
      return {
        right: 0,
        top: 0,
        bottom: topAreaBottom,
        width: rightSize,
      };
    }
    return {
      left: 0,
      right: 0,
      bottom: 0,
      height: bottomSize,
    };
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-40 bg-black/10">
      <DockDropZone
        position="left"
        active={target === "left"}
        style={zoneStyle("left")}
        className="absolute"
      />
      <DockDropZone
        position="right"
        active={target === "right"}
        style={zoneStyle("right")}
        className="absolute"
      />
      <DockDropZone
        position="bottom"
        active={target === "bottom"}
        style={zoneStyle("bottom")}
        className="absolute"
      />
    </div>
  );
}

function DockDropZone({
  active,
  className,
  position,
  style,
}: {
  active: boolean;
  className: string;
  position: Exclude<MovablePanelPosition, "hidden">;
  style: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "grid place-items-center border-2 border-dashed border-[var(--harbor-workbench-border-strong,var(--harbor-border-strong))] bg-[var(--harbor-workbench-panel-bg,var(--harbor-surface-1))]/55 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--harbor-workbench-fg-muted,var(--harbor-fg-muted))] opacity-70 shadow-2xl backdrop-blur-sm transition-colors",
        active && "border-[var(--harbor-workbench-accent-border,rgb(var(--harbor-accent)))] bg-[var(--harbor-workbench-selection-bg,rgb(var(--harbor-accent)/0.18))] text-[color:var(--harbor-workbench-fg,var(--harbor-fg))] opacity-100",
        className,
      )}
    >
      Dock {position}
    </div>
  );
}

function PanelMoveButton({
  active,
  children,
  label,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-pressed={active}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={onClick}
      className={cn(
        "grid h-6 w-6 place-items-center rounded-sm border border-[var(--harbor-workbench-border-strong,var(--harbor-border-strong))] font-mono text-[11px] text-[color:var(--harbor-workbench-fg-muted,var(--harbor-fg-muted))] hover:bg-[var(--harbor-workbench-control-hover-bg,rgb(var(--harbor-fg-rgb,255 255 255)/0.06))] hover:text-[color:var(--harbor-workbench-fg,var(--harbor-fg))]",
        active && "border-[var(--harbor-workbench-accent-border,rgb(var(--harbor-accent)))] bg-[var(--harbor-workbench-selection-bg,rgb(var(--harbor-accent)/0.14))] text-[color:var(--harbor-workbench-fg,var(--harbor-fg))]",
      )}
    >
      {children}
    </button>
  );
}
